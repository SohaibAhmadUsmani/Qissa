const clothesModules = import.meta.glob('../assets/images/clothes/**/*.{webp,jpg,jpeg,png,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const clothesImages = {};
for (const [filePath, url] of Object.entries(clothesModules)) {
  const match = filePath.replace(/\\/g, '/').match(/clothes\/(.+?)\/(.+)$/);
  if (!match) continue;
  const folder = match[1];
  if (!clothesImages[folder]) clothesImages[folder] = [];
  clothesImages[folder].push(url);
}

const trendingModules = import.meta.glob('../assets/images/trending/**/*.{webp,jpg,jpeg,png,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const trendingImages = {};
for (const [filePath, url] of Object.entries(trendingModules)) {
  const match = filePath.replace(/\\/g, '/').match(/trending\/(.+?)\/(.+)$/);
  if (!match) continue;
  const folder = match[1];
  if (!trendingImages[folder]) trendingImages[folder] = [];
  trendingImages[folder].push(url);
}

const folderMap = {
  'fsp1365-purple': 'printed-lawn-3pc-purple',
  'fse719-yellow': 'embroidered-chiffon-3pc-yellow',
  'fsp1359-pret-maroon': 'pret-jacquard-maroon',
  'fse707-black': 'embroidered-lawn-shawl-black',
  'fse710-purple': 'embroidered-chiffon',
  'fsp1354-pret-black': 'pret-embroidered',
  'fsp1330-pret-black': 'pret-embroidered',
  'fsp1294-pret-black': 'pret-embroidered-2pc',
  'fsp729-pret-blue': 'pret-printed-2pc',
  'fse703-green': 'embroidered-chiffon',
  'fsp1321-charcoal': 'pret-printed-2pc',
  'fse515-green': 'printed-lawn-3pc',
  'fse608-navy': 'embroidered-slub-khaddar-3pc',
  'fsp1397-white': 'printed-lawn-3pc',
  'fsp1402-white': 'pret-jacquard',
  'fsp1072-black': 'red-printed-two-piece',
  'fse697-white': 'embroidered-chiffon',
  'fsp1002-black': 'printed-lawn-3pc',
  'fsp943-orange': 'printed-lawn-3pc',
  'bottoms-palazzo-2': 'printed-lawn-3pc',
  'fsp1176-rust': 'printed-lawn-3pc',
  'style-shawl': 'luxury-organza-shawl',
  'style-earrings': 'ivory-drop-earrings',
  'style-khussa': 'classic-embroidered-khussa',
  'pret-embroidered-2pc': 'pret-embroidered-2pc',
  'bottoms-trouser-1': 'bottoms-trouser-1',
  'bottoms-palazzo-1': 'bottoms-palazzo-1',
  'jewelry-earrings-1': 'jewelry-earrings-1',
  'jewelry-necklace-1': 'jewelry-necklace-1',
  'jewelry-bangle-1': 'jewelry-bangle-1',
};

export function getProductFolder(id) {
  return folderMap[id] || null;
}

const imageCount = {
  'style-shawl': 2,
  'style-earrings': 1,
  'style-khussa': 2,
  'pret-embroidered-2pc': 3,
};

const trendingFolderMap = {
  'fsp1002-black': 'Printed Linen 2 Pcs (Unstitched)',
};

const clothesFolderMap = {
  'fsp943-orange': 'Printed Slub Khaddar 3 Pcs',
  'fse703-green': 'Embroidered Lawn 3 Pcs (Unstitched)',
};

export function getProductImages(id) {
  const trendingFolder = trendingFolderMap[id];
  if (trendingFolder && trendingImages[trendingFolder]) {
    return trendingImages[trendingFolder];
  }

  const clothesFolder = clothesFolderMap[id];
  if (clothesFolder && clothesImages[clothesFolder]) {
    return clothesImages[clothesFolder];
  }

  const folder = getProductFolder(id);
  if (!folder) return null;
  const count = imageCount[id] || 3;
  return Array.from({ length: count }, (_, i) =>
    `/assets/images/clothes/${folder}/IMG${i + 1}.webp`,
  );
}

export const editorialStories = {
  'fsp1365-purple': 'Crafted for the woman who values understated luxury, this printed lawn three-piece brings together fluid silhouette and artisanal print work. The muted purple tones offer a refined palette that moves effortlessly from daylight gatherings to intimate evening occasions.',
  'fse719-yellow': 'Bathed in the warmth of golden saffron, this embroidered chiffon ensemble is a tribute to festive craftsmanship. Delicate embellishments dance across lightweight fabric, creating a piece that feels as breathable as it is breathtaking — made for celebrations that linger.',
  'fsp1359-pret-maroon': 'Deep maroon meets precise jacquard weaving in this pret ensemble built for impact. The structured fabric holds its form elegantly while the rich wine tone commands attention. Designed for occasions where you want your arrival remembered.',
  'fse707-black': 'A study in contrast and texture — this embroidered lawn shawl wraps you in quiet sophistication. The black base lets the intricate threadwork take centre stage, making it the perfect companion for both formal evenings and elevated casual moments.',
};
