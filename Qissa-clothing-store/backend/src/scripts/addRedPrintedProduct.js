import mongoose from "mongoose";
import { env } from "../config/env.js";
import Product from "../models/Product.js";

const product = {
  name: "Pret Printed 2 Pc",
  slug: "pret-embroidered-2pc",
  description:
    "An exquisitely embroidered pret two-piece in premium lawn fabric, featuring intricate threadwork and a comfortable fitted silhouette. Perfect for festive gatherings, casual outings, and everyday elegance. Pair with contrasting accessories for a complete statement look.",
  price: 6999,
  discountPrice: 5499,
  category: "Women",
  subCategory: "Luxury Pret",
  fabric: "Lawn",
  brand: "Qissa",
  images: [
    { url: "/assets/images/clothes/pret-embroidered-2pc/IMG1.webp", alt: "Front View" },
    { url: "/assets/images/clothes/pret-embroidered-2pc/IMG2.webp", alt: "Back View" },
    { url: "/assets/images/clothes/pret-embroidered-2pc/IMG3.webp", alt: "Detail View" },
  ],
  variants: [
    { color: "Red", size: "S", stock: 8 },
    { color: "Red", size: "M", stock: 15 },
    { color: "Red", size: "L", stock: 12 },
    { color: "Red", size: "XL", stock: 6 },
    { color: "Red", size: "XXL", stock: 4 },
  ],
  rating: 4.6,
  numReviews: 42,
  isFeatured: true,
  isNewArrival: true,
  isActive: true,
  tags: ["embroidered", "lawn", "pret", "ready-to-wear", "2-pcs", "summer", "festive"],
};

async function addProduct() {
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(env.MONGO_URI);
  console.log("MongoDB connected");

  const deleted = await Product.findOneAndDelete({ slug: "red-printed-two-piece" });
  if (deleted) console.log("Removed old: Red Printed Two Piece");

  const existing = await Product.findOne({ slug: product.slug });
  if (existing) {
    await Product.findOneAndUpdate({ slug: product.slug }, product);
    console.log(`Updated: ${product.name}`);
  } else {
    await Product.create(product);
    console.log(`Created: ${product.name}`);
  }

  console.log("Done — product added");
}

addProduct()
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
