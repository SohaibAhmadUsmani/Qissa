const catalogProducts = [
  {
    name: "Printed Lawn 3 Pcs",
    slug: "printed-lawn-3-pcs",
    description: "Vibrant printed lawn three-piece suit featuring digital prints and delicate lace details. Lightweight and breathable for all-day comfort.",
    price: 5499,
    discountPrice: 4674,
    category: "Women",
    subCategory: "Unstitched",
    fabric: "Lawn",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/printed-lawn-3pc-purple/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/printed-lawn-3pc-purple/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Purple", size: "S", stock: 2 },
      { color: "Purple", size: "M", stock: 1 },
      { color: "Purple", size: "L", stock: 5 },
      { color: "Purple", size: "XL", stock: 8 },
      { color: "Purple", size: "XXL", stock: 3 }
    ],
    rating: 4.6,
    numReviews: 187,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["summer", "printed", "lawn", "unstitched", "3-pcs"]
  },
  {
    name: "Embroidered & Embellished Chiffon 3 Pcs",
    slug: "embroidered-embellished-chiffon-3-pcs",
    description: "Exquisite embroidered chiffon ensemble with delicate embellishments and a lightweight feel. Perfect for formal occasions and celebrations.",
    price: 17999,
    discountPrice: 14399,
    category: "Women",
    subCategory: "Formal Wear",
    fabric: "Chiffon",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/embroidered-chiffon-3pc-yellow/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/embroidered-chiffon-3pc-yellow/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Yellow", size: "S", stock: 2 },
      { color: "Yellow", size: "M", stock: 4 },
      { color: "Yellow", size: "L", stock: 1 },
      { color: "Yellow", size: "XL", stock: 3 },
      { color: "Yellow", size: "XXL", stock: 4 },
      { color: "Purple", size: "S", stock: 1 },
      { color: "Purple", size: "M", stock: 2 },
      { color: "Purple", size: "L", stock: 3 },
      { color: "Purple", size: "XL", stock: 3 },
      { color: "Purple", size: "XXL", stock: 2 }
    ],
    rating: 4.8,
    numReviews: 95,
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["formal", "chiffon", "embroidered", "embellished", "evening", "3-pcs"]
  },
  {
    name: "Embroidered Lawn 3 Pcs",
    slug: "embroidered-lawn-3-pcs",
    description: "A luxurious embroidered lawn three-piece with intricate threadwork. Perfect for summer gatherings and casual festive occasions.",
    price: 10999,
    discountPrice: 8799,
    category: "Women",
    subCategory: "Unstitched",
    fabric: "Lawn",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/embroidered-chiffon/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/embroidered-chiffon/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Green", size: "S", stock: 7 },
      { color: "Green", size: "M", stock: 2 },
      { color: "Green", size: "L", stock: 6 },
      { color: "Green", size: "XL", stock: 4 },
      { color: "Green", size: "XXL", stock: 1 }
    ],
    rating: 4.9,
    numReviews: 312,
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    tags: ["lawn", "embroidered", "summer", "unstitched", "3-pcs"]
  },
  {
    name: "Printed Indian Silk 1 Pcs",
    slug: "printed-indian-silk-1-pcs",
    description: "Elegant printed Indian silk piece with a smooth finish and vibrant print. Ideal for ready-to-wear occasions.",
    price: 2499,
    discountPrice: 1999,
    category: "Women",
    subCategory: "Luxury Pret",
    fabric: "Silk",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/pret-embroidered/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/pret-embroidered/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "White", size: "S", stock: 5 },
      { color: "White", size: "M", stock: 20 },
      { color: "White", size: "L", stock: 15 },
      { color: "White", size: "XL", stock: 8 },
      { color: "White", size: "XXL", stock: 2 }
    ],
    rating: 4.5,
    numReviews: 108,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["silk", "printed", "ready-to-wear", "indian", "1-pc"]
  },
  {
    name: "Printed Poly Chiffon 1 Pcs",
    slug: "printed-poly-chiffon-1-pcs",
    description: "Lightweight printed poly chiffon piece with a soft drape. A breathable option for everyday elegance.",
    price: 2999,
    discountPrice: 2399,
    category: "Women",
    subCategory: "Luxury Pret",
    fabric: "Poly Chiffon",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/pret-jacquard/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/pret-jacquard/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "White", size: "S", stock: 11 },
      { color: "White", size: "M", stock: 5 },
      { color: "White", size: "L", stock: 11 },
      { color: "White", size: "XL", stock: 2 },
      { color: "White", size: "XXL", stock: 1 }
    ],
    rating: 4.3,
    numReviews: 67,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["poly-chiffon", "printed", "ready-to-wear", "1-pc"]
  },
  {
    name: "Pret Embroidered & Printed Lawn 3 Pcs",
    slug: "pret-embroidered-printed-lawn-3-pcs",
    description: "A stunning pret ensemble combining embroidery and digital prints on premium lawn. Ready-to-wear elegance for any occasion.",
    price: 12499,
    discountPrice: 9999,
    category: "Women",
    subCategory: "Luxury Pret",
    fabric: "Lawn",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/pret-embroidered/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/pret-embroidered/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Black", size: "S", stock: 5 },
      { color: "Black", size: "M", stock: 3 },
      { color: "Black", size: "L", stock: 2 },
      { color: "Black", size: "XL", stock: 5 },
      { color: "Black", size: "XXL", stock: 4 }
    ],
    rating: 4.7,
    numReviews: 145,
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["pret", "embroidered", "printed", "lawn", "ready-to-wear", "3-pcs"]
  },
  {
    name: "Pret Embroidered Lawn 2 Pcs",
    slug: "pret-embroidered-lawn-2-pcs",
    description: "A chic pret embroidered lawn two-piece with modern styling. Effortless sophistication for daily wear.",
    price: 9499,
    discountPrice: 7599,
    category: "Women",
    subCategory: "Luxury Pret",
    fabric: "Lawn",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/pret-embroidered-2pc/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/pret-embroidered-2pc/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Black", size: "S", stock: 2 },
      { color: "Black", size: "M", stock: 9 },
      { color: "Black", size: "L", stock: 6 },
      { color: "Black", size: "XL", stock: 9 },
      { color: "Black", size: "XXL", stock: 5 }
    ],
    rating: 4.6,
    numReviews: 89,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["pret", "embroidered", "lawn", "ready-to-wear", "2-pcs"]
  },
  {
    name: "Pret Solid Jacquard 2 Pcs",
    slug: "pret-solid-jacquard-2-pcs",
    description: "A solid jacquard pret two-piece with rich texture and a structured fit. Perfect for festive gatherings.",
    price: 8499,
    discountPrice: 6799,
    category: "Women",
    subCategory: "Luxury Pret",
    fabric: "Jacquard",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/pret-jacquard-maroon/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/pret-jacquard-maroon/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Maroon", size: "S", stock: 8 },
      { color: "Maroon", size: "M", stock: 3 },
      { color: "Maroon", size: "L", stock: 8 },
      { color: "Maroon", size: "XL", stock: 3 },
      { color: "Maroon", size: "XXL", stock: 6 }
    ],
    rating: 4.5,
    numReviews: 73,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["pret", "jacquard", "solid", "ready-to-wear", "2-pcs"]
  },
  {
    name: "Embroidered & Printed Lawn 3 Pcs",
    slug: "embroidered-printed-lawn-3-pcs",
    description: "Beautiful embroidered and printed lawn three-piece with contemporary design. A versatile addition to your wardrobe.",
    price: 8999,
    discountPrice: 5849,
    category: "Women",
    subCategory: "Unstitched",
    fabric: "Lawn",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/pret-printed-2pc/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/pret-printed-2pc/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Charcoal", size: "S", stock: 10 },
      { color: "Charcoal", size: "M", stock: 5 },
      { color: "Charcoal", size: "L", stock: 10 },
      { color: "Charcoal", size: "XL", stock: 2 },
      { color: "Charcoal", size: "XXL", stock: 4 }
    ],
    rating: 4.6,
    numReviews: 87,
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["embroidered", "printed", "lawn", "unstitched", "new-arrival", "3-pcs"]
  },
  {
    name: "Embroidered Cotton Karandi 2 Pcs",
    slug: "embroidered-cotton-karandi-2-pcs",
    description: "Traditional embroidery on premium cotton karandi fabric. A timeless piece for cultural celebrations.",
    price: 8499,
    discountPrice: 6374,
    category: "Women",
    subCategory: "Unstitched",
    fabric: "Karandi",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/printed-lawn-3pc/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/printed-lawn-3pc/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Green", size: "S", stock: 6 },
      { color: "Green", size: "M", stock: 1 },
      { color: "Green", size: "L", stock: 3 },
      { color: "Green", size: "XL", stock: 4 },
      { color: "Green", size: "XXL", stock: 3 }
    ],
    rating: 4.7,
    numReviews: 56,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["embroidered", "cotton", "karandi", "unstitched", "2-pcs", "traditional"]
  },
  {
    name: "Printed Cambric 2 Pcs",
    slug: "printed-cambric-2-pcs",
    description: "Lightweight printed cambric two-piece with a soft finish. Ideal for everyday comfort and casual wear.",
    price: 4999,
    discountPrice: 3249,
    category: "Women",
    subCategory: "Casual Wear",
    fabric: "Cambric",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/red-printed-two-piece/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/red-printed-two-piece/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Black", size: "S", stock: 1 },
      { color: "Black", size: "M", stock: 14 },
      { color: "Black", size: "L", stock: 5 },
      { color: "Black", size: "XL", stock: 8 },
      { color: "Black", size: "XXL", stock: 3 }
    ],
    rating: 4.4,
    numReviews: 134,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["printed", "cambric", "casual", "2-pcs", "everyday"]
  },
  {
    name: "Embroidered Lawn Shawl",
    slug: "embroidered-lawn-shawl",
    description: "An intricately embroidered lawn shawl with delicate threadwork. A versatile layering piece for both formal and casual occasions.",
    price: 4999,
    discountPrice: 4499,
    category: "Women",
    subCategory: "Shawl",
    fabric: "Lawn",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/embroidered-lawn-shawl-black/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/embroidered-lawn-shawl-black/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Black", size: "S", stock: 3 },
      { color: "Black", size: "M", stock: 3 },
      { color: "Black", size: "L", stock: 3 },
      { color: "Black", size: "XL", stock: 3 },
      { color: "Black", size: "XXL", stock: 3 },
      { color: "White", size: "S", stock: 5 },
      { color: "White", size: "M", stock: 5 },
      { color: "White", size: "L", stock: 5 },
      { color: "White", size: "XL", stock: 5 },
      { color: "White", size: "XXL", stock: 5 }
    ],
    rating: 4.7,
    numReviews: 178,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["shawl", "lawn", "embroidered", "summer", "layer"]
  },
  {
    name: "Printed Linen 2 Pcs",
    slug: "printed-linen-2-pcs",
    description: "Crisp printed linen two-piece with a relaxed fit. Effortless style for warm-weather days.",
    price: 4399,
    discountPrice: 2639,
    category: "Women",
    subCategory: "Casual Wear",
    fabric: "Linen",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/printed-lawn-3pc/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/printed-lawn-3pc/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Black", size: "S", stock: 18 },
      { color: "Black", size: "M", stock: 10 },
      { color: "Black", size: "L", stock: 18 },
      { color: "Black", size: "XL", stock: 3 },
      { color: "Black", size: "XXL", stock: 2 }
    ],
    rating: 4.5,
    numReviews: 92,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["linen", "printed", "casual", "2-pcs", "summer", "sale"]
  },
  {
    name: "Printed Slub Khaddar 3 Pcs",
    slug: "printed-slub-khaddar-3-pcs",
    description: "Comfortable printed slub khaddar three-piece with a textured finish. Ideal for casual and semi-formal occasions.",
    price: 7699,
    discountPrice: 4619,
    category: "Women",
    subCategory: "Casual Wear",
    fabric: "Khaddar",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/printed-lawn-3pc/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/printed-lawn-3pc/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Orange", size: "S", stock: 1 },
      { color: "Orange", size: "M", stock: 4 },
      { color: "Orange", size: "L", stock: 2 },
      { color: "Orange", size: "XL", stock: 4 },
      { color: "Orange", size: "XXL", stock: 2 },
      { color: "Maroon", size: "S", stock: 2 },
      { color: "Maroon", size: "M", stock: 7 },
      { color: "Maroon", size: "L", stock: 3 },
      { color: "Maroon", size: "XL", stock: 7 },
      { color: "Maroon", size: "XXL", stock: 5 }
    ],
    rating: 4.3,
    numReviews: 156,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["khaddar", "printed", "slub", "3-pcs", "casual", "sale"]
  },
  {
    name: "Printed Slub Khaddar 2 Pcs",
    slug: "printed-slub-khaddar-2-pcs",
    description: "A comfortable printed slub khaddar two-piece with a relaxed drape. Great for everyday wear.",
    price: 4999,
    discountPrice: 3499,
    category: "Women",
    subCategory: "Casual Wear",
    fabric: "Khaddar",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/printed-lawn-3pc/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/printed-lawn-3pc/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Rust", size: "S", stock: 2 },
      { color: "Rust", size: "M", stock: 3 },
      { color: "Rust", size: "L", stock: 9 },
      { color: "Rust", size: "XL", stock: 6 },
      { color: "Rust", size: "XXL", stock: 4 }
    ],
    rating: 4.4,
    numReviews: 78,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    tags: ["khaddar", "printed", "slub", "2-pcs", "casual"]
  },
  {
    name: "Embroidered Slub Khaddar 3 Pcs",
    slug: "embroidered-slub-khaddar-3-pcs",
    description: "Intricate embroidery on premium slub khaddar fabric. A beautifully crafted piece for festive winter occasions.",
    price: 10499,
    discountPrice: 7874,
    category: "Women",
    subCategory: "Casual Wear",
    fabric: "Khaddar",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/embroidered-slub-khaddar-3pc/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/embroidered-slub-khaddar-3pc/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Navy Blue", size: "S", stock: 2 },
      { color: "Navy Blue", size: "M", stock: 1 },
      { color: "Navy Blue", size: "L", stock: 6 },
      { color: "Navy Blue", size: "XL", stock: 3 },
      { color: "Navy Blue", size: "XXL", stock: 4 }
    ],
    rating: 4.8,
    numReviews: 112,
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["khaddar", "embroidered", "slub", "winter", "festive", "3-pcs"]
  },
  {
    name: "Pret Printed Lawn 2 Pcs",
    slug: "pret-printed-lawn-2-pcs",
    description: "A trendy pret printed lawn two-piece with vibrant digital prints. Ready-to-wear style for the modern woman.",
    price: 6999,
    discountPrice: 4899,
    category: "Women",
    subCategory: "Luxury Pret",
    fabric: "Lawn",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/pret-embroidered/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/pret-embroidered/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Blue", size: "S", stock: 13 },
      { color: "Blue", size: "M", stock: 5 },
      { color: "Blue", size: "L", stock: 13 },
      { color: "Blue", size: "XL", stock: 3 },
      { color: "Blue", size: "XXL", stock: 3 }
    ],
    rating: 4.6,
    numReviews: 94,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["pret", "printed", "lawn", "ready-to-wear", "2-pcs"]
  },
  {
    name: "Luxury Organza Shawl",
    slug: "luxury-organza-shawl",
    description: "A luxurious organza shawl with delicate embroidery and a soft, ethereal drape. Perfect for evening events and formal occasions.",
    price: 5999,
    discountPrice: 4999,
    category: "Women",
    subCategory: "Shawl",
    fabric: "Organza",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/luxury-organza-shawl/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/luxury-organza-shawl/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Ivory", size: "Standard", stock: 50 }
    ],
    rating: 4.5,
    numReviews: 34,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["shawl", "organza", "luxury", "evening", "accessory"]
  },
  {
    name: "Ivory Drop Earrings",
    slug: "ivory-drop-earrings",
    description: "Elegant ivory drop earrings with gold-toned accents. Lightweight and perfect for adding a touch of sophistication to any outfit.",
    price: 2999,
    discountPrice: 2499,
    category: "Accessories",
    subCategory: "Jewelry",
    fabric: "Metal",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/ivory-drop-earrings/IMG1.webp", alt: "Front View" }
    ],
    variants: [
      { color: "Gold", size: "Standard", stock: 70 }
    ],
    rating: 4.3,
    numReviews: 18,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["earrings", "ivory", "jewelry", "accessory", "drop"]
  },
  {
    name: "Classic Embroidered Khussa",
    slug: "classic-embroidered-khussa",
    description: "Handcrafted classic embroidered khussa with traditional threadwork. Comfortable and stylish for festive and casual occasions.",
    price: 4999,
    discountPrice: 3999,
    category: "Accessories",
    subCategory: "Footwear",
    fabric: "Leather",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/classic-embroidered-khussa/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/classic-embroidered-khussa/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Brown", size: "36", stock: 10 },
      { color: "Brown", size: "37", stock: 15 },
      { color: "Brown", size: "38", stock: 20 },
      { color: "Brown", size: "39", stock: 18 },
      { color: "Brown", size: "40", stock: 12 },
      { color: "Brown", size: "41", stock: 8 },
      { color: "Brown", size: "42", stock: 5 }
    ],
    rating: 4.7,
    numReviews: 46,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["khussa", "embroidered", "footwear", "traditional", "accessory"]
  },
  {
    name: "Pret Printed 2 Pc",
    slug: "pret-embroidered-2pc",
    description: "A vibrant pret printed two-piece with digital floral prints. Ready-to-wear style for effortless everyday elegance.",
    price: 6599,
    discountPrice: 4599,
    category: "Women",
    subCategory: "Luxury Pret",
    fabric: "Lawn",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/pret-embroidered/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/pret-embroidered/IMG2.webp", alt: "Back View" }
    ],
    variants: [
      { color: "Red", size: "S", stock: 10 },
      { color: "Red", size: "M", stock: 15 },
      { color: "Red", size: "L", stock: 12 },
      { color: "Red", size: "XL", stock: 8 },
      { color: "Red", size: "XXL", stock: 5 }
    ],
    rating: 4.4,
    numReviews: 62,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["pret", "printed", "lawn", "ready-to-wear", "2-pc"]
  }
];

export default catalogProducts;
