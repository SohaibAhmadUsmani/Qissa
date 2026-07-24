import { isSeasonAppropriate, calculateSeasonScore, colorMatchPriority } from "./scoring.js";

export function getDiscountedPrice(product) {
  const price = Math.round(product.price);
  if (product.discountPrice > 0) {
    const pct = Math.round(((product.price - product.discountPrice) / product.price) * 100);
    return Math.round(price - (price * pct / 100));
  }
  return price;
}

export function getDiscountPercentage(product) {
  if (!product.discountPrice || product.discountPrice <= 0) return 0;
  return Math.round(((product.price - product.discountPrice) / product.price) * 100);
}

export function getColors(product) {
  return [...new Set((product.variants || []).map((v) => v.color))];
}

export function getSizes(product) {
  return [...new Set((product.variants || []).map((v) => v.size))];
}

export function getTotalStock(product) {
  return (product.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0);
}

export function getProductImage(product) {
  return product.images && product.images.length > 0 ? product.images[0].url : "";
}

export function getFirstVariant(product) {
  return product.variants && product.variants.length > 0 ? product.variants[0] : null;
}

export function eligibleProducts(products) {
  return products.filter((p) => {
    const stock = getTotalStock(p);
    return p.isActive === true && stock > 0;
  });
}

export function filterByBudget(products, budget) {
  return products.filter((p) => {
    const discountedPrice = getDiscountedPrice(p);
    return discountedPrice <= budget;
  });
}

export function filterBySeason(products, season, minCount) {
  const seasonOk = products.filter((p) => isSeasonAppropriate(p.fabric, season));
  if (seasonOk.length >= minCount) return seasonOk;
  const seasonNeutral = products.filter((p) => {
    if (seasonOk.some((s) => s._id.toString() === p._id.toString())) return false;
    return calculateSeasonScore(p.fabric, season) > 0;
  });
  const combined = [...seasonOk, ...seasonNeutral];
  if (combined.length >= minCount) return combined;
  return products;
}

export function prioritizeByColor(products, preferredColor) {
  return [...products].sort((a, b) => {
    const aColors = getColors(a);
    const bColors = getColors(b);
    const aMatch = colorMatchPriority(preferredColor, aColors);
    const bMatch = colorMatchPriority(preferredColor, bColors);
    const order = { exact: 3, near: 2, neutral: 1, none: 0 };
    return order[bMatch.level] - order[aMatch.level];
  });
}

export function augmentProduct(product) {
  const discountedPrice = getDiscountedPrice(product);
  const totalStock = getTotalStock(product);
  const colors = getColors(product);
  const sizes = getSizes(product);
  const discountPct = getDiscountPercentage(product);

  return {
    ...product,
    discountedPrice,
    discountPercentage: discountPct,
    colors,
    sizes,
    stock: totalStock,
  };
}
