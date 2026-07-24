import { getJewelryImage } from './jewelryImages';
import { getBottomsImages } from './bottomsImages';

const imageModules = import.meta.glob('../assets/images/clothes/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

const folderImages = {};

for (const [filePath, url] of Object.entries(imageModules)) {
  const parts = filePath.replace(/\\/g, '/').match(/clothes\/(.+?)\/(.+)$/);
  if (!parts) continue;
  const folderName = parts[1];
  if (!folderImages[folderName]) {
    folderImages[folderName] = [];
  }
  folderImages[folderName].push(url);
}

for (const folder of Object.keys(folderImages)) {
  folderImages[folder].sort();
}

const productNameToFolder = [
  'Printed Lawn 3 Pcs|printed lawn 3 pc purple',
  'Embroidered & Embellished Chiffon 3 Pcs|embroided  chiffon 3 pc yellow',
  'Embroidered Lawn 3 Pcs|embroided chiffon',
  'Printed Indian Silk 1 Pcs|pret embroidered',
  'Printed Poly Chiffon 1 Pcs|pret jacquard',
  'Pret Embroidered & Printed Lawn 3 Pcs|pret embroidered',
  'Pret Embroidered Lawn 2 Pcs|pret printed 2pc',
  'Pret Solid Jacquard 2 Pcs|pret solid jacard maroon',
  'Embroidered & Printed Lawn 3 Pcs|pret printed 2pc',
  'Embroidered Cotton Karandi 2 Pcs|printed lawn 3 pc',
  'Printed Cambric 2 Pcs|red printed two piece',
  'Embroidered Lawn Shawl|embroided lawn shawl black',
  'Printed Linen 2 Pcs|printed lawn 3 pc',
  'Printed Slub Khaddar 3 Pcs|printed lawn 3 pc',
  'Printed Slub Khaddar 2 Pcs|printed lawn 3 pc',
  'Embroidered Slub Khaddar 3 Pcs|Embroidered Slub Khaddar 3 Pcs',
  'Pret Printed Lawn 2 Pcs|pret embroidered',
  'Luxury Organza Shawl|embroided lawn shawl black',
  'Ivory Drop Earrings|embroided chiffon',
  'Classic Embroidered Khussa|embroided chiffon',
  'Pret Printed 2 Pc|pret embroidered',
];

const nameLookup = {};
for (const entry of productNameToFolder) {
  const [name, folder] = entry.split('|');
  nameLookup[name] = folder;
}

const jewelryNames = [
  'Gold Plated Drop Earrings',
  'Pearl & Crystal Necklace Set',
  'Matte Gold Bangle Set',
];

const bottomsNames = [
  'Straight Cut Cotton Trouser',
  'Printed Lawn Palazzo',
];

export function getProductImages(productName) {
  if (jewelryNames.includes(productName)) {
    const img = getJewelryImage(productName);
    if (img) return [img];
  }

  if (bottomsNames.includes(productName)) {
    const imgs = getBottomsImages(productName);
    if (imgs.length > 0) return imgs;
  }

  const folder = nameLookup[productName];
  if (folder && folderImages[folder]?.length) {
    return folderImages[folder];
  }

  const fallbackKeys = Object.keys(folderImages);
  const used = new Set();
  const result = [];
  for (const key of fallbackKeys) {
    for (const url of folderImages[key]) {
      if (!used.has(url)) {
        result.push(url);
        used.add(url);
        if (result.length >= 3) break;
      }
    }
    if (result.length >= 3) break;
  }
  return result;
}
