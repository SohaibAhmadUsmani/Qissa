const imageModules = import.meta.glob('../assets/images/bottoms/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const productImages = {};

for (const [filePath, url] of Object.entries(imageModules)) {
  const filename = filePath.replace(/\\/g, '/').split('/').pop() || '';
  const match = filename.match(/^(.+?)\s+img(\d+)\.\w+$/i);
  if (!match) continue;
  const productName = match[1].trim();
  const index = parseInt(match[2], 10);
  if (!productImages[productName]) {
    productImages[productName] = [];
  }
  productImages[productName][index - 1] = url;
}

for (const name of Object.keys(productImages)) {
  productImages[name] = productImages[name].filter(Boolean);
}

export function getBottomsImages(productTitle) {
  const key = productTitle.trim();
  if (productImages[key]) {
    return productImages[key];
  }
  const match = Object.keys(productImages).find((k) => key.includes(k) || k.includes(key));
  return match ? productImages[match] : [];
}
