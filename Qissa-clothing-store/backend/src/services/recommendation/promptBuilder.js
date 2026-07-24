import { getGroq } from "../../config/groq.js";
import { fmt, pickStylingHint } from "./scoring.js";

const RANKING_COUNT = 4;

export function buildPromptPayload(candidates) {
  return candidates.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    category: product.subCategory || product.category,
    description: product.description ? product.description.substring(0, 150) : "",
    color: product.colors && product.colors.length > 0 ? product.colors.join(", ") : "Not specified",
    fabric: product.fabric || "Not specified",
    price: product.price,
    discountedPrice: product.discountedPrice,
    stock: product.stock,
  }));
}

export function buildPrompt(candidates, { occasion, budget, preferredColor, style, season }) {
  const payload = buildPromptPayload(candidates);
  const stylingHint = pickStylingHint(occasion, season);

  return `You are QISSA's AI Fashion Stylist, a premium Pakistani fashion brand.

You are a RANKING ENGINE. You do NOT create products. You do NOT generate data.

The products below are the ONLY products available in our catalog. They are real MongoDB documents from our database. Every product has been pre-filtered and scored by our backend engine.

CRITICAL RULES - STRICTLY FOLLOW:
1. NEVER invent products. Only use the exact products listed below.
2. NEVER change product IDs. Use the exact IDs provided.
3. NEVER generate product names, prices, colors, fabrics, descriptions, or any product data.
4. NEVER create new products that are not in the list.
5. NEVER generate image URLs.
6. You may ONLY rank the products provided below.

USER PREFERENCES:
- Occasion: ${occasion}
- Budget: ${fmt(budget)}
- Preferred Color: ${preferredColor}
- Style: ${style}
- Season: ${season}

PRODUCTS TO RANK (${payload.length} products):
${JSON.stringify(payload, null, 2)}

YOUR TASK:
1. Analyze each product against the user's preferences: occasion, budget, color, style, season.
2. RANK all products from best match to worst match.
3. Select the top ${RANKING_COUNT} best matching products.
4. For each selected product, provide a brief 1-sentence reason explaining WHY it matches. Mention fabric, color, budget fit, or occasion relevance.
5. Use reasoning that references the user's specific preferences.

RANKING GUIDELINES:
- Color priority: Exact match > Near match (same family) > Neutral alternative > No match
- Budget: Products closest to budget (but within budget) rank higher than far-below-budget products
- Occasion: Wedding/Party should favor embroidered, luxury, formal. Office should favor minimal, solid, pret. Casual should favor comfort, everyday.
- Season: Favor fabrics appropriate for the selected season
- Style: Match product attributes to the user's style preference

Return ONLY this exact JSON array - no other text, no markdown, no code blocks:
[
  { "id": "exact_mongodb_id_from_above", "reason": "Brief 1-sentence match reason" },
  { "id": "exact_mongodb_id_from_above", "reason": "Brief 1-sentence match reason" }
]

You MUST return exactly ${RANKING_COUNT} products. No more, no fewer. Use only valid MongoDB IDs from the list above.`;
}

export async function callGroq(prompt) {
  const response = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.choices[0]?.message?.content || "";

  let jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    jsonMatch = text.match(/\{[\s\S]*\}/);
  }
  if (!jsonMatch) {
    throw new Error("AI response did not contain valid JSON");
  }

  return JSON.parse(jsonMatch[0]);
}
