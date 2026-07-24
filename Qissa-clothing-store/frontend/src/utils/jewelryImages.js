const imageModules = import.meta.glob('../assets/images/jewellery/*.{jpg,jpeg,png,webp,avif,mp4}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const titleToImage = {};

for (const [filePath, url] of Object.entries(imageModules)) {
  const filename = filePath.replace(/\\/g, '/').split('/').pop() || '';
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '').trim().toLowerCase();
  titleToImage[nameWithoutExt] = url;
}

export function getJewelryImage(productTitle) {
  const key = productTitle.trim().toLowerCase();
  if (titleToImage[key]) {
    return titleToImage[key];
  }

  const matches = Object.keys(titleToImage).filter((t) => key.includes(t) || t.includes(key));
  if (matches.length > 0) {
    return titleToImage[matches[0]];
  }

  const all = Object.values(titleToImage);
  return all.length > 0 ? all[0] : null;
}
