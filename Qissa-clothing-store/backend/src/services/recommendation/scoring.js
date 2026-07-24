const SEASON_PERFECT = {
  summer: ["lawn", "cotton", "cambric", "chiffon"],
  winter: ["khaddar", "jacquard", "linen", "velvet", "organza", "wool"],
  spring: ["lawn", "cotton", "chiffon", "lightweight"],
  autumn: ["khaddar", "linen", "silk", "cotton"],
};

const SEASON_ACCEPTABLE = {
  summer: ["linen", "silk"],
  winter: ["silk", "heavy"],
  spring: ["silk", "linen"],
  autumn: ["jacquard", "chiffon"],
};

const SEASON_AVOID = {
  summer: ["khaddar", "jacquard", "wool", "velvet", "heavy winter", "thick"],
  winter: ["lawn", "light cotton", "thin summer", "lightweight lawn", "cambric", "chiffon", "lightweight"],
  spring: [],
  autumn: [],
};

const OCCASION_SCORES = {
  wedding: { "luxury pret": 30, "formal wear": 25, embroidered: 25, pret: 20, unstitched: 15, jewelry: 15, shawl: 10, "casual wear": 5 },
  casual: { "casual wear": 30, pret: 20, printed: 20, "luxury pret": 10, "formal wear": 5 },
  party: { embroidered: 30, "luxury pret": 30, "formal wear": 25, pret: 20, jewelry: 20, shawl: 15 },
  office: { pret: 30, "luxury pret": 20, "casual wear": 15, minimal: 25 },
};

const COLOR_FAMILIES = {
  red: ["red", "maroon", "wine", "burgundy", "rust", "crimson", "brick"],
  pink: ["pink", "rose", "blush", "peach", "coral", "salmon"],
  purple: ["purple", "lavender", "lilac", "plum", "mauve", "violet"],
  black: ["black", "charcoal", "dark grey", "dark gray", "navy", "midnight"],
  blue: ["blue", "sky", "royal", "navy", "teal", "aqua", "sapphire"],
  white: ["white", "cream", "ivory", "off white", "off-white", "beige", "ecru"],
  green: ["green", "emerald", "olive", "sage", "mint", "forest"],
  brown: ["brown", "tan", "camel", "taupe", "chocolate"],
  gold: ["gold", "bronze", "brass", "copper", "champagne"],
  silver: ["silver", "grey", "gray", "platinum", "pewter"],
  yellow: ["yellow", "mustard", "saffron", "golden"],
};

const NEUTRAL_ALTERNATIVES = {
  red: ["pink", "purple"],
  pink: ["red", "purple", "peach"],
  purple: ["pink", "blue"],
  black: ["silver", "brown", "blue"],
  blue: ["purple", "green"],
  white: ["silver", "brown"],
  green: ["blue", "brown"],
  brown: ["gold", "green"],
  gold: ["yellow", "brown"],
  silver: ["white", "black"],
  yellow: ["gold"],
};

const PREMIUM_FABRICS = ["silk", "organza", "velvet", "jacquard", "linen", "pashmina", "chiffon", "brocade", "lace"];

const STYLE_KEYWORDS_BY_OCCASION = {
  wedding: ["embroidered", "embroidery", "luxury", "formal", "party", "elegant", "premium", "organza", "jacquard", "gota", "zardozi", "festive"],
  party: ["embroidered", "embroidery", "luxury", "formal", "party", "elegant", "premium", "organza", "jacquard", "gota", "zardozi", "festive"],
  office: ["minimal", "solid", "plain", "simple", "minimalist", "pret", "smart casual", "casual", "comfort", "everyday", "workwear", "breathable"],
  casual: ["casual", "printed", "comfort", "everyday", "cotton", "lawn", "solid", "minimal"],
};

export function catKey(str) {
  return (str || "").toLowerCase().trim();
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function fmt(amount) {
  return "Rs. " + Number(amount).toLocaleString("en-PK");
}

function findColorFamily(color) {
  const c = catKey(color);
  for (const [family, members] of Object.entries(COLOR_FAMILIES)) {
    if (c === family || members.includes(c) || members.some((m) => c.includes(m) || m.includes(c))) {
      return family;
    }
  }
  return null;
}

function isSeasonFiltered(fabric, season) {
  const f = catKey(fabric);
  const avoid = SEASON_AVOID[catKey(season)] || [];
  return avoid.some((a) => f.includes(a) || a.includes(f));
}

export function colorMatchPriority(preferred, productColors) {
  if (!preferred || !preferred.trim()) {
    return { level: "none", matchColor: null, score: 0 };
  }
  const pref = catKey(preferred);
  if (!productColors || productColors.length === 0) {
    return { level: "none", matchColor: null, score: 0 };
  }

  for (const pc of productColors) {
    if (catKey(pc) === pref) {
      return { level: "exact", matchColor: pc, score: 40 };
    }
  }

  const prefFamily = findColorFamily(pref);

  for (const pc of productColors) {
    const pcLower = catKey(pc);
    const pcFamily = findColorFamily(pcLower);
    if (prefFamily && pcFamily === prefFamily) {
      return { level: "near", matchColor: pc, score: 25 };
    }
    if (pcLower.includes(pref) || pref.includes(pcLower)) {
      return { level: "near", matchColor: pc, score: 25 };
    }
  }

  if (prefFamily) {
    const neutrals = NEUTRAL_ALTERNATIVES[prefFamily] || [];
    for (const pc of productColors) {
      const pcFamily = findColorFamily(catKey(pc));
      if (pcFamily && neutrals.includes(pcFamily)) {
        return { level: "neutral", matchColor: pc, score: 10 };
      }
    }
  }

  return { level: "none", matchColor: null, score: 0 };
}

export function calculateColorScore(matchLevel) {
  switch (matchLevel) {
    case "exact": return 40;
    case "near": return 25;
    case "neutral": return 10;
    default: return 0;
  }
}

export function calculateBudgetProximity(price, budget) {
  if (price <= 0 || budget <= 0) return 0;
  if (price > budget) return 0;
  const diff = budget - price;
  const ratio = diff / budget;
  return Math.round((1 - ratio) * 10);
}

export function calculateSeasonScore(fabric, season) {
  const f = catKey(fabric || "");
  const s = catKey(season || "");
  const perfect = SEASON_PERFECT[s] || [];
  const acceptable = SEASON_ACCEPTABLE[s] || [];
  if (perfect.some((p) => f.includes(p) || p.includes(f))) return 10;
  if (acceptable.some((a) => f.includes(a) || a.includes(f))) return 5;
  return 0;
}

export function isSeasonAppropriate(fabric, season) {
  return !isSeasonFiltered(fabric, season);
}

export function calculateOccasionScore(occasion, product) {
  const scores = OCCASION_SCORES[catKey(occasion)];
  if (!scores) return 0;
  const sub = catKey(product.subCategory);
  const cat = catKey(product.category);
  const text = catKey((product.name || "") + " " + (product.description || ""));
  let best = 0;
  if (sub && scores[sub] !== undefined) best = Math.max(best, scores[sub]);
  if (cat && scores[cat] !== undefined) best = Math.max(best, scores[cat]);
  for (const [key, val] of Object.entries(scores)) {
    if (key !== sub && key !== cat && text.includes(key)) best = Math.max(best, val);
  }
  if (best >= 25) return 15;
  if (best >= 15) return 10;
  if (best >= 5) return 5;
  return 0;
}

export function calculateStyleScore(style, occasion, product) {
  const text = catKey(product.name + " " + (product.description || "") + " " + (product.category || "") + " " + (product.subCategory || ""));
  const occasionLower = catKey(occasion);

  const occasionKeywords = STYLE_KEYWORDS_BY_OCCASION[occasionLower];
  if (occasionKeywords && occasionKeywords.some((k) => text.includes(k))) return 10;

  const userStyle = catKey(style);
  if (userStyle) {
    const styleKeywordMap = {
      elegant: ["embroidered", "embroidery", "luxury", "formal", "elegant"],
      minimal: ["simple", "solid", "plain", "minimal", "minimalist"],
      luxury: ["premium", "embroidered", "organza", "jacquard", "luxury"],
      modern: ["printed", "contemporary", "digital print", "modern"],
    };
    const keywords = styleKeywordMap[userStyle];
    if (keywords && keywords.some((k) => text.includes(k))) return 10;
  }

  return 0;
}

export function calculateFabricScore(fabric) {
  const f = catKey(fabric || "");
  for (const premium of PREMIUM_FABRICS) {
    if (f.includes(premium)) return 5;
  }
  return 0;
}

export function calculateOverallScore(product, { occasion, budget, preferredColor, style, season }) {
  const colors = product.colors || [];
  const discountedPrice = product.discountedPrice || product.price || 0;

  const colorResult = colorMatchPriority(preferredColor, colors);
  const colorScore = colorResult.score;

  const occasionScore = calculateOccasionScore(occasion, product);

  const withinBudget = discountedPrice <= budget ? 20 : 0;

  const budgetProximity = calculateBudgetProximity(discountedPrice, budget);

  const seasonScore = calculateSeasonScore(product.fabric, season);
  const styleScore = calculateStyleScore(style, occasion, product);
  const fabricBonus = calculateFabricScore(product.fabric);
  const stockPenalty = (product.stock || 0) > 0 && (product.stock || 0) <= 3 ? -5 : 0;

  const total = colorScore + withinBudget + budgetProximity + occasionScore + seasonScore + styleScore + fabricBonus + stockPenalty;

  return {
    score: Math.max(0, total),
    breakdown: {
      color: colorScore,
      colorLevel: colorResult.level,
      colorMatchColor: colorResult.matchColor,
      budget: withinBudget + budgetProximity,
      withinBudget,
      budgetProximity,
      occasion: occasionScore,
      season: seasonScore,
      style: styleScore,
      fabric: fabricBonus,
      stock: stockPenalty,
    },
  };
}

export function buildMatchedRules(product, { occasion, budget, preferredColor, season, style }, colorLevel) {
  const rules = [];
  const breakdown = product.breakdown || {};
  if (product.discountedPrice <= budget) rules.push("Within Budget");
  if (breakdown.occasion > 0) rules.push(capitalize(occasion) + " Occasion");
  if (breakdown.season > 0) rules.push(capitalize(season) + " Fabric");
  if (colorLevel === "exact") rules.push(preferredColor + " Color");
  else if (colorLevel === "near") rules.push("Closest to " + preferredColor);
  else if (colorLevel === "neutral") rules.push("Neutral " + preferredColor + " Alternative");
  if (product.discountPercentage >= 30) rules.push(product.discountPercentage + "% Discount");
  else if (product.discountPercentage >= 10) rules.push(product.discountPercentage + "% Discount");
  if (breakdown.style > 0) rules.push(style + " Style");
  if (product.subCategory) rules.push(product.subCategory);
  return rules;
}

export function pickStylingHint(occasion, season) {
  const o = catKey(occasion);
  const s = catKey(season);
  const lines = [];
  if (o === "wedding") {
    lines.push("Pearl earrings", "Nude heels", "Matching clutch", "Delicate jewelry");
  } else if (o === "casual") {
    lines.push("White sneakers", "Crossbody bag", "Minimal jewelry", "Denim jacket");
  } else if (o === "office") {
    lines.push("Minimal jewelry", "Comfortable flats", "Watch", "Neutral handbag");
  } else if (o === "party") {
    lines.push("Statement earrings", "Heels", "Clutch", "Bold lip color");
  } else {
    lines.push("Minimal jewelry", "Handbag", "Scarf");
  }
  if (s === "winter") lines.push("Embroidered shawl", "Ankle boots");
  else if (s === "summer") lines.push("Sandals", "Light accessories", "Sunglasses");
  return lines.join(", ");
}

export function isAccessoryProduct(product) {
  const cat = catKey(product.category);
  const sub = catKey(product.subCategory);
  return cat.includes("jewelry") || sub.includes("jewelry") ||
         cat.includes("shawl") || sub.includes("shawl") ||
         cat.includes("accessories") || sub.includes("accessories");
}
