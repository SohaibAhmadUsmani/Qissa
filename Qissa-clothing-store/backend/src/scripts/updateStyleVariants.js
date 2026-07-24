import mongoose from "mongoose";
import { env } from "../config/env.js";
import Product from "../models/Product.js";

const updates = [
  {
    slug: "luxury-organza-shawl",
    variants: [
      { color: "Ivory", size: "Standard", stock: 50 },
    ],
  },
  {
    slug: "ivory-drop-earrings",
    variants: [
      { color: "Gold", size: "Standard", stock: 70 },
    ],
  },
  {
    slug: "classic-embroidered-khussa",
    variants: [
      { color: "Brown", size: "36", stock: 8 },
      { color: "Brown", size: "37", stock: 12 },
      { color: "Brown", size: "38", stock: 15 },
      { color: "Brown", size: "39", stock: 10 },
      { color: "Brown", size: "40", stock: 7 },
      { color: "Brown", size: "41", stock: 5 },
      { color: "Brown", size: "42", stock: 4 },
    ],
  },
];

async function updateVariants() {
  if (!env.MONGO_URI) throw new Error("MONGO_URI is required");
  await mongoose.connect(env.MONGO_URI);
  console.log("MongoDB connected");

  for (const u of updates) {
    const existing = await Product.findOne({ slug: u.slug });
    if (!existing) {
      console.log(`Not found: ${u.slug}`);
      continue;
    }
    existing.variants = u.variants;
    await existing.save();
    console.log(`Updated: ${existing.name} — ${u.variants.length} variant(s)`);
  }

  console.log("Done");
}

updateVariants()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("Failed:", e.message);
    if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
    process.exit(1);
  });
