import api from './api';

let _backendProductsCache = null;

async function getAllBackendProducts() {
  if (_backendProductsCache) return _backendProductsCache;
  const { data } = await api.get('/products?limit=100');
  _backendProductsCache = data.data || [];
  return _backendProductsCache;
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function stripParenthetical(str) {
  return str.replace(/\s*\([^)]*\)/g, '').trim();
}

function getSignificantWords(str) {
  return normalize(str).split(' ').filter((w) => w.length >= 3);
}

function findBestProductMatch(catalogTitle, products) {
  const cleaned = stripParenthetical(catalogTitle);
  const cleanedNorm = normalize(cleaned);

  for (const p of products) {
    if (cleanedNorm === normalize(p.name)) return p;
  }

  for (const p of products) {
    if (cleanedNorm.startsWith(normalize(p.name))) return p;
  }

  const catWords = getSignificantWords(cleaned);

  let best = null;
  let bestScore = 0;

  for (const p of products) {
    const bkWords = getSignificantWords(p.name);
    const common = catWords.filter((w) => bkWords.includes(w)).length;
    if (common > bestScore) {
      bestScore = common;
      best = p;
    } else if (common === bestScore && common > 0 && best) {
      const bestBkWords = getSignificantWords(best.name);
      if (catWords[0] !== bestBkWords[0] && catWords[0] === bkWords[0]) {
        best = p;
      }
    }
  }

  if (bestScore >= 2) return best;
  if (bestScore >= 1 && catWords.length <= 2) return best;

  return null;
}

export async function getProductById(id) {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data.data || null;
  } catch {
    return null;
  }
}

export async function findBackendProduct(title) {
  if (typeof title === 'string' && /^[0-9a-fA-F]{24}$/.test(title)) {
    const byId = await getProductById(title);
    if (byId) return byId;
  }
  const products = await getAllBackendProducts();
  if (typeof title === 'string' && /^[0-9a-fA-F]{24}$/.test(title)) {
    const byId = products.find(p => (p._id || '').toString() === title);
    if (byId) return byId;
  }
  return findBestProductMatch(title, products) || null;
}

export async function findBackendProductId(title) {
  const product = await findBackendProduct(title);
  return product ? product._id : null;
}

export function hasVariantMatch(product, color, size) {
  if (product.variants && product.variants.length > 0) {
    return product.variants.some(
      (v) => v.color === color && v.size === size && v.stock > 0,
    );
  }
  const hasColor = product.colors && product.colors.some((c) => c.toLowerCase() === color.toLowerCase());
  const hasSize = product.sizes && product.sizes.some((s) => s.toLowerCase() === size.toLowerCase());
  return hasColor && hasSize;
}

export function getVariantStock(product, color, size) {
  if (!product || !product.variants) return 0;
  const variant = product.variants.find(
    (v) => v.color === color && v.size === size
  );
  return variant ? variant.stock : 0;
}

export function getVariantMap(product, color) {
  if (!product || !product.variants) return {};
  const map = {};
  for (const v of product.variants) {
    if (v.color === color) {
      map[v.size] = v.stock;
    }
  }
  return map;
}

export function clearProductCache() {
  _backendProductsCache = null;
}
