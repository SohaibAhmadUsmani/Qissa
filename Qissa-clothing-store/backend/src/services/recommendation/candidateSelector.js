import Product from "../../models/Product.js";
import { calculateOverallScore, buildMatchedRules, isAccessoryProduct } from "./scoring.js";
import { augmentProduct, eligibleProducts, filterByBudget, filterBySeason } from "./filters.js";

const CANDIDATE_LIMIT = 50;
const ACCESSORY_BUDGET_MIN = 3000;

export async function selectCandidates({ occasion, budget, preferredColor, style, season }) {
  const allProducts = await Product.find({ isActive: true }).lean();

  const eligible = eligibleProducts(allProducts);
  if (eligible.length === 0) {
    return { candidates: [], matchedRulesList: [], backendScores: {} };
  }

  const budgetFiltered = filterByBudget(eligible, budget);
  if (budgetFiltered.length === 0) {
    return { candidates: [], matchedRulesList: [], backendScores: {} };
  }

  const seasonFiltered = filterBySeason(budgetFiltered, season, 30);

  const augmented = seasonFiltered.map((p) => augmentProduct(p));

  const scored = augmented.map((product) => {
    const result = calculateOverallScore(product, {
      occasion, budget, preferredColor, style, season,
    });
    return { ...product, score: result.score, breakdown: result.breakdown };
  });

  scored.sort((a, b) => b.score - a.score);

  let topCandidates = scored.slice(0, CANDIDATE_LIMIT);

  const totalSpent = topCandidates.slice(0, 4).reduce((s, p) => s + p.discountedPrice, 0);
  const remaining = budget - totalSpent;

  if (remaining >= ACCESSORY_BUDGET_MIN) {
    const topIds = new Set(topCandidates.map((c) => c._id.toString()));
    const accessory = scored.find(
      (p) => !topIds.has(p._id.toString()) && isAccessoryProduct(p) && p.discountedPrice <= remaining
    );
    if (accessory) {
      topCandidates.push(accessory);
    }
  }

  const matchedRulesList = topCandidates.map((product) => ({
    id: product._id.toString(),
    rules: buildMatchedRules(product, { occasion, budget, preferredColor, season, style }, product.breakdown.colorLevel),
  }));

  const backendScores = topCandidates.reduce((map, p) => {
    map[p._id.toString()] = { score: p.score, breakdown: p.breakdown };
    return map;
  }, {});

  return { candidates: topCandidates, matchedRulesList, backendScores };
}
