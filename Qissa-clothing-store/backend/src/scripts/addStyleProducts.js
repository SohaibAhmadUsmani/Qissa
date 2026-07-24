import mongoose from "mongoose";
import { env } from "../config/env.js";
import Product from "../models/Product.js";

const styleProducts = [
  {
    name: "Luxury Organza Shawl",
    slug: "luxury-organza-shawl",
    description:
      "An exquisite organza shawl with delicate embroidered details and a lightweight, airy drape. The perfect finishing layer for both formal ensembles and elevated casual looks. Features intricate threadwork along the borders with a soft, sheer body that adds elegance without weight.",
    price: 4299,
    discountPrice: 3499,
    category: "Women",
    subCategory: "Shawl",
    fabric: "Organza",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/luxury-organza-shawl/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/luxury-organza-shawl/IMG2.webp", alt: "Detail View" },
    ],
    variants: [
      { color: "Ivory", size: "S", stock: 10 },
      { color: "Ivory", size: "M", stock: 15 },
      { color: "Ivory", size: "L", stock: 8 },
      { color: "Ivory", size: "XL", stock: 5 },
    ],
    rating: 4.5,
    numReviews: 24,
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["shawl", "organza", "evening", "formal", "luxury"],
  },
  {
    name: "Ivory Drop Earrings",
    slug: "ivory-drop-earrings",
    description:
      "Elegant ivory drop earrings with a gold-toned finish, designed to complement any outfit from casual daywear to formal evening ensembles. Lightweight and comfortable for all-day wear with secure hook closures.",
    price: 1699,
    discountPrice: 1299,
    category: "Accessories",
    subCategory: "Accessories",
    fabric: "Gold Finish",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/ivory-drop-earrings/IMG1.webp", alt: "Front View" },
    ],
    variants: [
      { color: "Gold", size: "S", stock: 20 },
      { color: "Gold", size: "M", stock: 25 },
      { color: "Gold", size: "L", stock: 15 },
      { color: "Gold", size: "XL", stock: 10 },
    ],
    rating: 4.3,
    numReviews: 18,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    tags: ["earrings", "gold", "ivory", "accessories", "drop"],
  },
  {
    name: "Classic Embroidered Khussa",
    slug: "classic-embroidered-khussa",
    description:
      "Handcrafted classic khussa with intricate embroidered detailing across the upper. Featuring a comfortable leather sole and pointed toe design, these traditional shoes pair beautifully with both casual and formal Pakistani attire.",
    price: 5999,
    discountPrice: 4999,
    category: "Women",
    subCategory: "Khussa",
    fabric: "Leather",
    brand: "Qissa",
    images: [
      { url: "/assets/images/clothes/classic-embroidered-khussa/IMG1.webp", alt: "Front View" },
      { url: "/assets/images/clothes/classic-embroidered-khussa/IMG2.webp", alt: "Side View" },
    ],
    variants: [
      { color: "Brown", size: "S", stock: 8 },
      { color: "Brown", size: "M", stock: 12 },
      { color: "Brown", size: "L", stock: 10 },
      { color: "Brown", size: "XL", stock: 6 },
    ],
    rating: 4.7,
    numReviews: 32,
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    tags: ["khussa", "embroidered", "footwear", "traditional", "leather"],
  },
];

async function addStyleProducts() {
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(env.MONGO_URI);
  console.log("MongoDB connected");

  for (const product of styleProducts) {
    const existing = await Product.findOne({ slug: product.slug });
    if (existing) {
      console.log(`Already exists: ${product.name}`);
    } else {
      await Product.create(product);
      console.log(`Created: ${product.name}`);
    }
  }

  console.log("Done — style products added");
}

addStyleProducts()
  .then(async () => {
    await mongoose.connection.close();
    console.log("Connection closed");
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Failed:", error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  });
