const products = [
  {
    name: "Embroidered Lawn Suit",
    slug: "embroidered-lawn-suit",
    description: "A luxurious embroidered lawn suit with intricate threadwork and a matching dupatta. Perfect for summer gatherings and casual festive occasions.",
    price: 5990,
    discountPrice: 4990,
    category: "Women",
    subCategory: "Luxury Pret",
    fabric: "Lawn",
    brand: "Qissa",
    images: [
      { url: "/images/products/lawn-suit-1.jpg", alt: "Front View" },
      { url: "/images/products/lawn-suit-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Green", size: "S", stock: 6 },
      { color: "Green", size: "M", stock: 12 },
      { color: "Green", size: "L", stock: 8 },
      { color: "White", size: "S", stock: 5 },
      { color: "White", size: "M", stock: 10 },
      { color: "White", size: "L", stock: 7 }
    ],
    rating: 4.9,
    numReviews: 312,
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["eid", "summer", "embroidered", "lawn", "trending"]
  },
  {
    name: "Printed Lawn 3 Pcs",
    slug: "printed-lawn-3-pcs",
    description: "Vibrant printed lawn three-piece suit featuring digital prints and delicate lace details. Lightweight and breathable for all-day comfort.",
    price: 3490,
    discountPrice: 2990,
    category: "Women",
    subCategory: "Lawn",
    fabric: "Lawn",
    brand: "Qissa",
    images: [
      { url: "/images/products/printed-lawn-1.jpg", alt: "Front View" },
      { url: "/images/products/printed-lawn-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Blue", size: "S", stock: 10 },
      { color: "Blue", size: "M", stock: 15 },
      { color: "Blue", size: "L", stock: 8 },
      { color: "Pink", size: "S", stock: 7 },
      { color: "Pink", size: "M", stock: 12 },
      { color: "Pink", size: "L", stock: 6 }
    ],
    rating: 4.6,
    numReviews: 187,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["summer", "printed", "casual", "daily-wear", "lawn"]
  },
  {
    name: "Luxury Chiffon Maxi",
    slug: "luxury-chiffon-maxi",
    description: "An elegant chiffon maxi with delicate embroidery and flowing silhouette. Ideal for formal dinners and festive celebrations.",
    price: 7990,
    discountPrice: 6790,
    category: "Women",
    subCategory: "Formal Wear",
    fabric: "Chiffon",
    brand: "Qissa",
    images: [
      { url: "/images/products/chiffon-maxi-1.jpg", alt: "Front View" },
      { url: "/images/products/chiffon-maxi-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Black", size: "S", stock: 4 },
      { color: "Black", size: "M", stock: 8 },
      { color: "Black", size: "L", stock: 5 },
      { color: "Maroon", size: "S", stock: 3 },
      { color: "Maroon", size: "M", stock: 6 },
      { color: "Maroon", size: "L", stock: 4 }
    ],
    rating: 4.8,
    numReviews: 95,
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["formal", "evening", "chiffon", "maxi", "luxury"]
  },
  {
    name: "Cotton Kurti with Dupatta",
    slug: "cotton-kurti-dupatta",
    description: "A breezy cotton kurti paired with a lightweight printed dupatta. Perfect for everyday elegance and casual outings.",
    price: 2490,
    discountPrice: 1990,
    category: "Women",
    subCategory: "Casual Wear",
    fabric: "Cotton",
    brand: "Qissa",
    images: [
      { url: "/images/products/cotton-kurti-1.jpg", alt: "Front View" },
      { url: "/images/products/cotton-kurti-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "White", size: "S", stock: 15 },
      { color: "White", size: "M", stock: 20 },
      { color: "White", size: "L", stock: 12 },
      { color: "Olive", size: "S", stock: 8 },
      { color: "Olive", size: "M", stock: 14 },
      { color: "Olive", size: "L", stock: 10 }
    ],
    rating: 4.5,
    numReviews: 234,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["cotton", "casual", "everyday", "kurti", "summer"]
  },
  {
    name: "Embroidered Organza Suit",
    slug: "embroidered-organza-suit",
    description: "Exquisite organza suit with heavy floral embroidery and intricate gota work. A stunning choice for weddings and mehndi events.",
    price: 12500,
    discountPrice: 9990,
    category: "Women",
    subCategory: "Luxury Pret",
    fabric: "Organza",
    brand: "Qissa",
    images: [
      { url: "/images/products/organza-suit-1.jpg", alt: "Front View" },
      { url: "/images/products/organza-suit-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Gold", size: "S", stock: 3 },
      { color: "Gold", size: "M", stock: 5 },
      { color: "Gold", size: "L", stock: 4 },
      { color: "Peach", size: "S", stock: 2 },
      { color: "Peach", size: "M", stock: 6 },
      { color: "Peach", size: "L", stock: 3 }
    ],
    rating: 4.9,
    numReviews: 68,
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    tags: ["wedding", "organza", "embroidered", "gota", "mehndi", "luxury"]
  },
  {
    name: "Silk Embroidered Kurta",
    slug: "silk-embroidered-kurta",
    description: "A premium silk kurta with hand-embroidered neckline and cuffs. Luxuriously soft with a subtle sheen for refined occasions.",
    price: 6890,
    discountPrice: 5890,
    category: "Women",
    subCategory: "Formal Wear",
    fabric: "Silk",
    brand: "Qissa",
    images: [
      { url: "/images/products/silk-kurta-1.jpg", alt: "Front View" },
      { url: "/images/products/silk-kurta-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Beige", size: "S", stock: 5 },
      { color: "Beige", size: "M", stock: 9 },
      { color: "Beige", size: "L", stock: 6 },
      { color: "Black", size: "S", stock: 4 },
      { color: "Black", size: "M", stock: 8 },
      { color: "Black", size: "L", stock: 5 }
    ],
    rating: 4.7,
    numReviews: 143,
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    tags: ["silk", "formal", "embroidered", "kurta", "premium"]
  },
  {
    name: "Unstitched Lawn Collection",
    slug: "unstitched-lawn-collection",
    description: "Premium unstitched lawn fabric with matching trouser and dupatta. Customize your fit while enjoying Qissa's signature lawn quality.",
    price: 4590,
    discountPrice: 3990,
    category: "Women",
    subCategory: "Unstitched",
    fabric: "Lawn",
    brand: "Qissa",
    images: [
      { url: "/images/products/unstitched-lawn-1.jpg", alt: "Front View" },
      { url: "/images/products/unstitched-lawn-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Purple", size: "Unstitched", stock: 20 },
      { color: "Purple", size: "Medium", stock: 15 },
      { color: "Teal", size: "Unstitched", stock: 18 },
      { color: "Teal", size: "Medium", stock: 12 }
    ],
    rating: 4.7,
    numReviews: 421,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["unstitched", "lawn", "summer", "fabric", "custom"]
  },
  {
    name: "Khaddar Winter Suit",
    slug: "khaddar-winter-suit",
    description: "Warm khaddar suit with block print detailing and a contrasting dupatta. A winter essential for casual comfort with traditional charm.",
    price: 3990,
    discountPrice: 3490,
    category: "Women",
    subCategory: "Casual Wear",
    fabric: "Khaddar",
    brand: "Qissa",
    images: [
      { url: "/images/products/khaddar-suit-1.jpg", alt: "Front View" },
      { url: "/images/products/khaddar-suit-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Brown", size: "S", stock: 8 },
      { color: "Brown", size: "M", stock: 14 },
      { color: "Brown", size: "L", stock: 10 },
      { color: "Maroon", size: "S", stock: 6 },
      { color: "Maroon", size: "M", stock: 11 },
      { color: "Maroon", size: "L", stock: 7 }
    ],
    rating: 4.5,
    numReviews: 276,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["winter", "khaddar", "block-print", "warm", "casual"]
  },
  {
    name: "Velvet Embroidered Suit",
    slug: "velvet-embroidered-suit",
    description: "Rich velvet suit with heavy zardozi embroidery and sequin accents. A showstopper for winter weddings and festive gatherings.",
    price: 14900,
    discountPrice: 12900,
    category: "Women",
    subCategory: "Formal Wear",
    fabric: "Velvet",
    brand: "Qissa",
    images: [
      { url: "/images/products/velvet-suit-1.jpg", alt: "Front View" },
      { url: "/images/products/velvet-suit-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Burgundy", size: "S", stock: 2 },
      { color: "Burgundy", size: "M", stock: 5 },
      { color: "Burgundy", size: "L", stock: 3 },
      { color: "Navy", size: "S", stock: 3 },
      { color: "Navy", size: "M", stock: 6 },
      { color: "Navy", size: "L", stock: 4 }
    ],
    rating: 4.8,
    numReviews: 52,
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["velvet", "winter", "wedding", "zardozi", "formal", "luxury"]
  },
  {
    name: "Linen Straight Kurta",
    slug: "linen-straight-kurta",
    description: "A crisp linen straight-cut kurta with clean tailoring and minimal design. Effortless sophistication for workwear and smart casual settings.",
    price: 5490,
    discountPrice: 4790,
    category: "Women",
    subCategory: "Casual Wear",
    fabric: "Linen",
    brand: "Qissa",
    images: [
      { url: "/images/products/linen-kurta-1.jpg", alt: "Front View" },
      { url: "/images/products/linen-kurta-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Mint", size: "S", stock: 7 },
      { color: "Mint", size: "M", stock: 12 },
      { color: "Mint", size: "L", stock: 9 },
      { color: "Blush", size: "S", stock: 5 },
      { color: "Blush", size: "M", stock: 10 },
      { color: "Blush", size: "L", stock: 6 }
    ],
    rating: 4.6,
    numReviews: 108,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["linen", "workwear", "minimal", "kurta", "smart-casual"]
  },
  {
    name: "Men's Cotton Kurta Shalwar",
    slug: "mens-cotton-kurta-shalwar",
    description: "Classic cotton kurta shalwar set with fine stitching and a comfortable fit. Essential for everyday wear and casual family gatherings.",
    price: 3490,
    discountPrice: 2990,
    category: "Men",
    subCategory: "Casual Wear",
    fabric: "Cotton",
    brand: "Qissa",
    images: [
      { url: "/images/products/men-cotton-kurta-1.jpg", alt: "Front View" },
      { url: "/images/products/men-cotton-kurta-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "White", size: "M", stock: 15 },
      { color: "White", size: "L", stock: 20 },
      { color: "White", size: "XL", stock: 12 },
      { color: "Sky Blue", size: "M", stock: 10 },
      { color: "Sky Blue", size: "L", stock: 14 },
      { color: "Sky Blue", size: "XL", stock: 8 }
    ],
    rating: 4.7,
    numReviews: 389,
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["men", "cotton", "kurta", "casual", "everyday"]
  },
  {
    name: "Men's Embroidered Kurta",
    slug: "mens-embroidered-kurta",
    description: "Hand-embroidered kurta with detailed neckline work for men. Perfect for eid prayers, dawat gatherings, and formal ceremonies.",
    price: 5490,
    discountPrice: 4690,
    category: "Men",
    subCategory: "Formal Wear",
    fabric: "Linen",
    brand: "Qissa",
    images: [
      { url: "/images/products/men-embroidered-kurta-1.jpg", alt: "Front View" },
      { url: "/images/products/men-embroidered-kurta-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Black", size: "M", stock: 8 },
      { color: "Black", size: "L", stock: 12 },
      { color: "Black", size: "XL", stock: 7 },
      { color: "Off White", size: "M", stock: 10 },
      { color: "Off White", size: "L", stock: 15 },
      { color: "Off White", size: "XL", stock: 9 }
    ],
    rating: 4.8,
    numReviews: 156,
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    tags: ["men", "embroidered", "formal", "linen", "eid", "wedding"]
  },
  {
    name: "Men's Khaddar Kurta",
    slug: "mens-khaddar-kurta",
    description: "Warm khaddar kurta with a relaxed fit and traditional styling. Ideal for winter months and countryside casual wear.",
    price: 2990,
    discountPrice: 2590,
    category: "Men",
    subCategory: "Casual Wear",
    fabric: "Khaddar",
    brand: "Qissa",
    images: [
      { url: "/images/products/men-khaddar-kurta-1.jpg", alt: "Front View" },
      { url: "/images/products/men-khaddar-kurta-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Grey", size: "M", stock: 12 },
      { color: "Grey", size: "L", stock: 18 },
      { color: "Grey", size: "XL", stock: 10 },
      { color: "Olive", size: "M", stock: 8 },
      { color: "Olive", size: "L", stock: 14 },
      { color: "Olive", size: "XL", stock: 9 }
    ],
    rating: 4.5,
    numReviews: 203,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["men", "khaddar", "winter", "casual", "kurta"]
  },
  {
    name: "Men's Waistcoat",
    slug: "mens-waistcoat",
    description: "A tailored waistcoat in premium fabric with detailed stitching and button work. Complements any kurta for a polished traditional look.",
    price: 2890,
    discountPrice: 2390,
    category: "Men",
    subCategory: "Waistcoat",
    fabric: "Cotton",
    brand: "Qissa",
    images: [
      { url: "/images/products/men-waistcoat-1.jpg", alt: "Front View" },
      { url: "/images/products/men-waistcoat-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Black", size: "M", stock: 10 },
      { color: "Black", size: "L", stock: 15 },
      { color: "Black", size: "XL", stock: 8 },
      { color: "Maroon", size: "M", stock: 6 },
      { color: "Maroon", size: "L", stock: 12 },
      { color: "Maroon", size: "XL", stock: 7 }
    ],
    rating: 4.6,
    numReviews: 87,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["men", "waistcoat", "formal", "traditional", "layering"]
  },
  {
    name: "Men's Silk Kurta",
    slug: "mens-silk-kurta",
    description: "Luxurious silk kurta with subtle sheen and clean finish. The ultimate choice for formal dinners, nikah ceremonies, and milestone events.",
    price: 7990,
    discountPrice: 6990,
    category: "Men",
    subCategory: "Formal Wear",
    fabric: "Silk",
    brand: "Qissa",
    images: [
      { url: "/images/products/men-silk-kurta-1.jpg", alt: "Front View" },
      { url: "/images/products/men-silk-kurta-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Cream", size: "M", stock: 5 },
      { color: "Cream", size: "L", stock: 8 },
      { color: "Cream", size: "XL", stock: 4 },
      { color: "Navy", size: "M", stock: 6 },
      { color: "Navy", size: "L", stock: 10 },
      { color: "Navy", size: "XL", stock: 5 }
    ],
    rating: 4.9,
    numReviews: 62,
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    tags: ["men", "silk", "formal", "luxury", "wedding", "nikah"]
  },
  {
    name: "Velvet Shawl",
    slug: "velvet-shawl",
    description: "Plush velvet shawl with embroidered borders and a soft drape. A timeless winter accessory that elevates any outfit instantly.",
    price: 2990,
    discountPrice: 2490,
    category: "Accessories",
    subCategory: "Shawl",
    fabric: "Velvet",
    brand: "Qissa",
    images: [
      { url: "/images/products/velvet-shawl-1.jpg", alt: "Front View" },
      { url: "/images/products/velvet-shawl-1-back.jpg", alt: "Back View" }
    ],
    variants: [
      { color: "Maroon", size: "One Size", stock: 20 },
      { color: "Maroon", size: "Large", stock: 12 },
      { color: "Navy", size: "One Size", stock: 18 },
      { color: "Navy", size: "Large", stock: 10 },
      { color: "Emerald", size: "One Size", stock: 14 },
      { color: "Emerald", size: "Large", stock: 8 }
    ],
    rating: 4.7,
    numReviews: 178,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["winter", "shawl", "velvet", "accessory", "embroidered"]
  },
  {
    name: "Silk Dupatta",
    slug: "silk-dupatta",
    description: "Pure silk dupatta with delicate hand-painted borders and a lightweight feel. A versatile accessory that adds grace to any ensemble.",
    price: 2490,
    discountPrice: 1990,
    category: "Accessories",
    subCategory: "Dupatta",
    fabric: "Silk",
    brand: "Qissa",
    images: [
      { url: "/images/products/silk-dupatta-1.jpg", alt: "Full View" },
      { url: "/images/products/silk-dupatta-1-detail.jpg", alt: "Border Detail" }
    ],
    variants: [
      { color: "Cream", size: "One Size", stock: 25 },
      { color: "Gold", size: "One Size", stock: 18 },
      { color: "Pink", size: "One Size", stock: 20 },
      { color: "Light Blue", size: "One Size", stock: 15 }
    ],
    rating: 4.6,
    numReviews: 312,
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    tags: ["dupatta", "silk", "accessory", "hand-painted", "formal"]
  },
  {
    name: "Embroidered Khussa",
    slug: "embroidered-khussa",
    description: "Handcrafted khussa with intricate thread embroidery and comfortable leather sole. Traditional footwear with a contemporary edge.",
    price: 3990,
    discountPrice: 3490,
    category: "Accessories",
    subCategory: "Khussa",
    fabric: "Cotton",
    brand: "Qissa",
    images: [
      { url: "/images/products/khussa-1.jpg", alt: "Side View" },
      { url: "/images/products/khussa-1-top.jpg", alt: "Top View" }
    ],
    variants: [
      { color: "Gold", size: "37", stock: 5 },
      { color: "Gold", size: "38", stock: 8 },
      { color: "Gold", size: "39", stock: 10 },
      { color: "Gold", size: "40", stock: 6 },
      { color: "Black", size: "37", stock: 7 },
      { color: "Black", size: "38", stock: 12 },
      { color: "Black", size: "39", stock: 14 },
      { color: "Black", size: "40", stock: 9 }
    ],
    rating: 4.8,
    numReviews: 95,
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["khussa", "footwear", "embroidered", "handcrafted", "traditional"]
  },
  {
    name: "Embroidered Handbag",
    slug: "embroidered-handbag",
    description: "Elegant handbag with hand-embroidered floral motifs and a spacious interior. A sophisticated accessory that complements both casual and formal wear.",
    price: 4590,
    discountPrice: 3890,
    category: "Accessories",
    subCategory: "Handbag",
    fabric: "Velvet",
    brand: "Qissa",
    images: [
      { url: "/images/products/handbag-1.jpg", alt: "Front View" },
      { url: "/images/products/handbag-1-side.jpg", alt: "Side View" }
    ],
    variants: [
      { color: "Black", size: "Small", stock: 8 },
      { color: "Black", size: "Medium", stock: 12 },
      { color: "Black", size: "Large", stock: 6 },
      { color: "Red", size: "Small", stock: 5 },
      { color: "Red", size: "Medium", stock: 10 },
      { color: "Red", size: "Large", stock: 4 }
    ],
    rating: 4.5,
    numReviews: 73,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["handbag", "embroidered", "accessory", "velvet", "formal", "gift"]
  },
  {
    name: "Chiffon Dupatta",
    slug: "chiffon-dupatta",
    description: "Light-as-air chiffon dupatta with digital print and lace trim. An essential layering piece that adds a pop of color to any outfit.",
    price: 1890,
    discountPrice: 1490,
    category: "Accessories",
    subCategory: "Dupatta",
    fabric: "Chiffon",
    brand: "Qissa",
    images: [
      { url: "/images/products/chiffon-dupatta-1.jpg", alt: "Full View" },
      { url: "/images/products/chiffon-dupatta-1-detail.jpg", alt: "Border Detail" }
    ],
    variants: [
      { color: "Teal", size: "One Size", stock: 30 },
      { color: "Coral", size: "One Size", stock: 25 },
      { color: "Lavender", size: "One Size", stock: 22 },
      { color: "Mustard", size: "One Size", stock: 18 }
    ],
    rating: 4.4,
    numReviews: 267,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["dupatta", "chiffon", "lightweight", "printed", "accessory", "summer"]
  }
];

export default products;
