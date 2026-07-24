import { getGroq } from "../config/groq.js";
import Product from "../models/Product.js";
import { selectCandidates } from "./recommendation/candidateSelector.js";
import { buildPrompt, callGroq } from "./recommendation/promptBuilder.js";
import { colorMatchPriority, catKey, capitalize } from "./recommendation/scoring.js";
import { getDiscountedPrice, getDiscountPercentage, getColors, getSizes, getTotalStock, getProductImage, getFirstVariant } from "./recommendation/filters.js";

export function fmt(amount) {
  return "Rs. " + Number(amount).toLocaleString("en-PK");
}

function computeFinalConfidence(score, maxScore, rank) {
  const scoreRatio = maxScore > 0 ? score / maxScore : 0;
  const rankBonus = Math.max(0, (5 - rank) * 2);
  return Math.min(99, Math.round(70 + scoreRatio * 20 + rankBonus));
}

function generateTitle(occasion, style) {
  const occasionLabels = {
    wedding: "Wedding Edit",
    party: "Party Collection",
    office: "Office Edit",
    casual: "Casual Picks",
  };
  return `${style || "Curated"} ${occasionLabels[catKey(occasion)] || "Selection"}`;
}

function generateSummary(recommendedProducts, occasion) {
  const names = recommendedProducts.map((p) => p.name).slice(0, 3);
  const list = names.join(", ");
  const count = recommendedProducts.length;
  const occasionLabel = capitalize(occasion);
  return `We've curated ${count} ${occasionLabel.toLowerCase()} pieces tailored to your preferences. Featuring ${list}${names.length < count ? ` and ${count - names.length} more` : ""}.`;
}

function generateReason(recommendedProducts, occasion, budget) {
  const count = recommendedProducts.length;
  const total = recommendedProducts.reduce((s, p) => s + (p.discountedPrice || p.price), 0);
  const withinBudget = total <= budget;
  const occasionLabel = capitalize(occasion);
  return `This ${count}-piece ${occasionLabel.toLowerCase()} set costs ${fmt(total)}${withinBudget ? "" : " (slightly over your budget)"}. Each piece is selected to match your preferences.`;
}

function generateColorAdvice(recommendedProducts, preferredColor) {
  const colorMentions = recommendedProducts
    .map((p) => {
      const colors = getColors(p);
      if (colors.length > 0) return `${p.name} (${colors.join(", ")})`;
      return null;
    })
    .filter(Boolean);

  if (!preferredColor || !preferredColor.trim()) {
    if (colorMentions.length > 0) {
      return `The selected pieces come in ${colorMentions.map(m => m.split('(')[1]?.replace(')', '')).filter(Boolean).join(', ')}.`;
    }
    return `The selected pieces offer versatile color options that coordinate well together.`;
  }

  const directMatches = recommendedProducts.filter((p) => {
    const colors = getColors(p);
    return colorMatchPriority(preferredColor, colors).level === "exact";
  });

  if (directMatches.length > 0) {
    return `Your preferred color ${preferredColor} is available in ${directMatches.length} of the selected pieces.`;
  }
  if (colorMentions.length > 0) {
    return `While we don't have exact ${preferredColor} pieces in this selection, these items offer complementary shades.`;
  }
  return `The selected pieces offer versatile color options that coordinate well together.`;
}

export async function testGemini() {
  try {
    const response = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: "Reply only with: Groq connection successful." },
      ],
    });
    return response.choices[0]?.message?.content || "";
  } catch (error) {
    throw new Error(`Groq API error: ${error.message}`);
  }
}

export async function getStylistRecommendations({
  occasion,
  budget,
  preferredColor,
  style,
  season,
}) {
  try {
    const { candidates, matchedRulesList, backendScores } = await selectCandidates({
      occasion, budget, preferredColor, style, season,
    });

    if (candidates.length === 0) {
      return {
        title: "",
        summary: "",
        reason: "",
        stylingTips: "",
        whyThisWorks: "",
        colorAdvice: "",
        confidenceScore: 0,
        recommendedProducts: [],
      };
    }

    const prompt = buildPrompt(candidates, {
      occasion, budget, preferredColor, style, season,
    });

    let rankedResults;
    try {
      rankedResults = await callGroq(prompt);
    } catch (groqError) {
      const sorted = [...candidates].sort((a, b) => b.score - a.score);
      rankedResults = sorted.slice(0, 4).map((c) => ({
        id: c._id.toString(),
        reason: "Best match based on your preferences.",
      }));
    }

    if (!Array.isArray(rankedResults)) {
      rankedResults = [];
    }

    const maxScore = Math.max(...candidates.map((c) => c.score), 1);

    const sortedCandidates = [...candidates]
      .filter((c) => rankedResults.some((r) => r.id === c._id.toString()))
      .sort((a, b) => {
        const aIdx = rankedResults.findIndex((r) => r.id === a._id.toString());
        const bIdx = rankedResults.findIndex((r) => r.id === b._id.toString());
        return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
      });

    let topRanked = sortedCandidates.slice(0, 4);

    if (topRanked.length === 0) {
      const sorted = [...candidates].sort((a, b) => b.score - a.score);
      topRanked.push(...sorted.slice(0, 4));
    }

    const rankedIds = topRanked.map((c) => c._id);
    const completeProducts = await Product.find({ _id: { $in: rankedIds } }).lean();
    const productMap = {};
    for (const p of completeProducts) {
      productMap[p._id.toString()] = p;
    }

    const finalProducts = topRanked.map((product, index) => {
      const idStr = product._id.toString();
      const fullProduct = productMap[idStr];
      const rank = index + 1;
      const confidence = computeFinalConfidence(product.score, maxScore, rank);
      const rules = matchedRulesList.find((m) => m.id === idStr)?.rules || [];
      const groqItem = rankedResults.find((r) => r.id === idStr);

      if (!fullProduct) return null;

      const discountedPrice = getDiscountedPrice(fullProduct);
      const discountPct = getDiscountPercentage(fullProduct);
      const colors = getColors(fullProduct);
      const sizes = getSizes(fullProduct);
      const stock = getTotalStock(fullProduct);
      const firstVariant = getFirstVariant(fullProduct);

      return {
        ...fullProduct,
        discountedPrice,
        discountPercentage: discountPct,
        colors,
        sizes,
        stock,
        category: fullProduct.subCategory || fullProduct.category,
        image: getProductImage(fullProduct),
        reason: groqItem?.reason || "Selected based on your preferences.",
        matchedRules: rules,
        confidence,
        firstAvailableColor: firstVariant?.color || (colors.length > 0 ? colors[0] : ""),
        firstAvailableSize: firstVariant?.size || (sizes.length > 0 ? sizes[0] : "Standard"),
      };
    }).filter(Boolean);

    const avgConfidence = Math.round(
      finalProducts.reduce((s, p) => s + p.confidence, 0) / finalProducts.length
    );

    return {
      title: generateTitle(occasion, style),
      summary: generateSummary(finalProducts, occasion),
      reason: generateReason(finalProducts, occasion, budget),
      stylingTips: `These pieces work beautifully for ${occasion.toLowerCase()} events. ${season === "Summer" ? "Choose lightweight accessories and breathable footwear." : "Layer with complementary pieces for a complete look."}`,
      whyThisWorks: `This set combines pieces that match your ${preferredColor} color preference with ${style.toLowerCase()} styling for ${occasion.toLowerCase()} wear.`,
      colorAdvice: generateColorAdvice(finalProducts, preferredColor),
      confidenceScore: avgConfidence,
      recommendedProducts: finalProducts,
    };
  } catch (error) {
    throw new Error(`Groq API error: ${error.message}`);
  }
}
