import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Order from "../models/Order.js";
import Blog from "../models/Blog.js";
import Wishlist from "../models/Wishlist.js";
import Payment from "../models/Payment.js";
import products from "../seed/catalogProducts.js";

const SHIPPING_COST = 200;

const userSeeds = [
  { name: "Uzma", email: "uzma@gmail.com", role: "customer" },
  { name: "Romesa", email: "romesa@gmail.com", role: "customer" },
  { name: "Ayyan", email: "ayyan@gmail.com", role: "customer" },
  { name: "Noor", email: "noor@gmail.com", role: "customer" },
  { name: "Seerat", email: "seerat@gmail.com", role: "customer" },
  { name: "Fatima", email: "fatima@gmail.com", role: "customer" },
  { name: "Ayesha", email: "ayesha@gmail.com", role: "customer" },
  { name: "Bushra", email: "bushra@gmail.com", role: "customer" },
  { name: "Administrator", email: "admin@qissa.com", role: "admin" },
];

const addresses = [
  { fullName: "Uzma", phone: "0300-1234567", country: "Pakistan", provinceState: "Punjab", city: "Lahore", postalCode: "54000", streetAddress: "23 Main Boulevard Gulberg", landmark: "Near Liberty Market", addressType: "Home", userEmail: "uzma@gmail.com" },
  { fullName: "Romesa", phone: "0301-2345678", country: "Pakistan", provinceState: "Sindh", city: "Karachi", postalCode: "74200", streetAddress: "45 Clifton Road", landmark: "Near Dolmen Mall", addressType: "Home", userEmail: "romesa@gmail.com" },
  { fullName: "Ayyan", phone: "0302-3456789", country: "Pakistan", provinceState: "Islamabad", city: "Islamabad", postalCode: "44000", streetAddress: "12 F-10 Markaz", landmark: "Near Centaurus Mall", addressType: "Home", userEmail: "ayyan@gmail.com" },
  { fullName: "Noor", phone: "0303-4567890", country: "Pakistan", provinceState: "Punjab", city: "Multan", postalCode: "60000", streetAddress: "78 Shah Rukn-e-Alam Colony", addressType: "Home", userEmail: "noor@gmail.com" },
  { fullName: "Seerat", phone: "0304-5678901", country: "Pakistan", provinceState: "KPK", city: "Peshawar", postalCode: "25000", streetAddress: "56 University Road", addressType: "Home", userEmail: "seerat@gmail.com" },
  { fullName: "Fatima", phone: "0305-6789012", country: "Pakistan", provinceState: "Punjab", city: "Gujranwala", postalCode: "52250", streetAddress: "34 Model Town", addressType: "Home", userEmail: "fatima@gmail.com" },
  { fullName: "Ayesha", phone: "0306-7890123", country: "Pakistan", provinceState: "Sindh", city: "Hyderabad", postalCode: "71000", streetAddress: "90 Latifabad", addressType: "Home", userEmail: "ayesha@gmail.com" },
  { fullName: "Bushra", phone: "0307-8901234", country: "Pakistan", provinceState: "Punjab", city: "Faisalabad", postalCode: "38000", streetAddress: "67 Peoples Colony", addressType: "Home", userEmail: "bushra@gmail.com" },
];

const orderStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
const paymentMethods = ["COD", "Stripe"];

function randomDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  return d;
}

function generateOrderNumber() {
  const timestamp = Date.now() + Math.floor(Math.random() * 10000);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${timestamp}-${random}`;
}

function generateTransactionId() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${random}`;
}

async function seedAll() {
  await mongoose.connect(env.MONGO_URI);
  console.log("MongoDB connected");

  // ─── 1. USERS ───
  console.log("\n--- Seeding Users ---");
  const userMap = {};
  for (const u of userSeeds) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      userMap[u.email] = existing;
      console.log(`Skipped ${u.email} — exists`);
      continue;
    }
    const hashedPassword = await bcrypt.hash("pass12345", 10);
    const user = await User.create({
      name: u.name, email: u.email, password: hashedPassword, role: u.role,
    });
    userMap[u.email] = user;
    console.log(`Created ${u.email}`);
  }

  // ─── 2. PRODUCTS ───
  console.log("\n--- Seeding Products ---");
  const ops = products.map((p) => ({
    updateOne: {
      filter: { slug: p.slug },
      update: { $set: p },
      upsert: true,
    },
  }));
  await Product.bulkWrite(ops);
  const allProducts = await Product.find({}).lean();
  console.log(`${allProducts.length} products ready`);

  if (allProducts.length === 0) {
    console.log("No products found — creating dummy products");
    const dummyProducts = [
      { name: "Printed Lawn 3 Pcs", slug: "printed-lawn-3-pcs", description: "Vibrant printed lawn three-piece suit", price: 5499, discountPrice: 4674, category: "Women", subCategory: "Unstitched", fabric: "Lawn", images: [{ url: "/assets/images/clothes/printed-lawn-3pc-purple/IMG1.webp" }], variants: [{ color: "Purple", size: "M", stock: 10 }], rating: 4.5, numReviews: 100, isActive: true, tags: ["lawn", "women"] },
      { name: "Embroidered Chiffon 3 Pcs", slug: "embroidered-chiffon-3-pcs", description: "Exquisite embroidered chiffon ensemble", price: 17999, discountPrice: 14399, category: "Women", subCategory: "Formal Wear", fabric: "Chiffon", images: [{ url: "/assets/images/clothes/embroidered-chiffon-3pc-yellow/IMG1.webp" }], variants: [{ color: "Yellow", size: "M", stock: 5 }], rating: 4.8, numReviews: 95, isFeatured: true, isNewArrival: true, isActive: true, tags: ["formal", "chiffon"] },
      { name: "Pret Embroidered Lawn 2 Pcs", slug: "pret-embroidered-lawn-2-pcs", description: "Chic pret embroidered lawn two-piece", price: 9499, discountPrice: 7599, category: "Women", subCategory: "Luxury Pret", fabric: "Lawn", images: [{ url: "/assets/images/clothes/pret-embroidered-2pc/IMG1.webp" }], variants: [{ color: "Black", size: "M", stock: 9 }], rating: 4.6, numReviews: 89, isActive: true, tags: ["pret", "lawn"] },
      { name: "Embroidered Khussa", slug: "embroidered-khussa", description: "Handcrafted khussa with thread embroidery", price: 3990, discountPrice: 3490, category: "Accessories", subCategory: "Khussa", fabric: "Cotton", images: [{ url: "/assets/images/clothes/classic-embroidered-khussa/IMG1.webp" }], variants: [{ color: "Brown", size: "38", stock: 15 }], rating: 4.8, numReviews: 95, isFeatured: true, isActive: true, tags: ["khussa", "footwear"] },
      { name: "Luxury Organza Shawl", slug: "luxury-organza-shawl", description: "Luxurious organza shawl with delicate embroidery", price: 5999, discountPrice: 4999, category: "Women", subCategory: "Shawl", fabric: "Organza", images: [{ url: "/assets/images/clothes/luxury-organza-shawl/IMG1.webp" }], variants: [{ color: "Ivory", size: "Standard", stock: 50 }], rating: 4.5, numReviews: 34, isNewArrival: true, isActive: true, tags: ["shawl", "organza"] },
      { name: "Ivory Drop Earrings", slug: "ivory-drop-earrings", description: "Elegant ivory drop earrings with gold-toned accents", price: 2999, discountPrice: 2499, category: "Accessories", subCategory: "Jewelry", fabric: "Metal", images: [{ url: "/assets/images/clothes/ivory-drop-earrings/IMG1.webp" }], variants: [{ color: "Gold", size: "Standard", stock: 70 }], rating: 4.3, numReviews: 18, isNewArrival: true, isActive: true, tags: ["earrings", "jewelry"] },
    ];
    const dummyOps = dummyProducts.map((p) => ({
      updateOne: { filter: { slug: p.slug }, update: { $set: p }, upsert: true },
    }));
    await Product.bulkWrite(dummyOps);
    allProducts.push(...await Product.find({}).lean());
    console.log(`${allProducts.length} products after dummy seeding`);
  }

  // ─── 3. ADDRESSES ───
  console.log("\n--- Seeding Addresses ---");
  for (const a of addresses) {
    const user = userMap[a.userEmail];
    if (!user) continue;
    const existing = await Address.findOne({ user: user._id, streetAddress: a.streetAddress });
    if (existing) continue;
    await Address.create({
      user: user._id, fullName: a.fullName, phone: a.phone,
      country: a.country, provinceState: a.provinceState,
      city: a.city, postalCode: a.postalCode,
      streetAddress: a.streetAddress, landmark: a.landmark || "",
      addressType: a.addressType || "Home", isDefault: true,
    });
  }
  const addrCount = await Address.countDocuments();
  console.log(`${addrCount} addresses ready`);

  // ─── 4. ORDERS ───
  console.log("\n--- Seeding Orders ---");
  const customerEmails = userSeeds.filter((u) => u.role === "customer").map((u) => u.email);
  const existingOrders = await Order.countDocuments();
  if (existingOrders > 0) {
    console.log(`${existingOrders} orders already exist — skipping order seed`);
  } else {
    const targetOrders = 20;
    for (let i = 0; i < targetOrders; i++) {
      const email = customerEmails[i % customerEmails.length];
      const user = userMap[email];
      if (!user) continue;

      const userAddress = await Address.findOne({ user: user._id });
      if (!userAddress) continue;

      const numItems = 1 + Math.floor(Math.random() * 3);
      const orderItems = [];
      for (let j = 0; j < numItems; j++) {
        const product = allProducts[Math.floor(Math.random() * allProducts.length)];
        const variant = product.variants?.[0] || { color: "Standard", size: "M" };
        const price = product.discountPrice || product.price || 1000;
        const qty = 1 + Math.floor(Math.random() * 2);
        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.images?.[0]?.url || "",
          price,
          color: variant.color,
          size: variant.size,
          quantity: qty,
        });
      }

      const subtotal = orderItems.reduce((s, item) => s + item.price * item.quantity, 0);
      const total = subtotal + SHIPPING_COST;

      const weighted = ["Delivered", "Delivered", "Shipped", "Confirmed", "Pending", "Delivered", "Shipped", "Confirmed", "Delivered", "Cancelled"];
      const status = weighted[i % weighted.length];
      const daysAgo = status === "Pending" ? 0 : status === "Confirmed" ? 2 : status === "Shipped" ? 5 : status === "Delivered" ? 15 : 10;
      const createdDate = randomDate(daysAgo + 5);

      const isPaid = status === "Delivered" || (status === "Shipped" && i % 3 === 0);
      const paymentMethod = i % 4 === 0 ? "Stripe" : "COD";

      const order = await Order.create({
        user: user._id,
        orderNumber: generateOrderNumber(),
        items: orderItems,
        address: {
          fullName: userAddress.fullName,
          phone: userAddress.phone,
          country: userAddress.country,
          provinceState: userAddress.provinceState,
          city: userAddress.city,
          postalCode: userAddress.postalCode,
          streetAddress: userAddress.streetAddress,
          landmark: userAddress.landmark || "",
          addressType: userAddress.addressType,
        },
        subtotal,
        shipping: SHIPPING_COST,
        total,
        status,
        paymentMethod,
        paymentStatus: isPaid ? "Paid" : "Unpaid",
        createdAt: createdDate,
        updatedAt: createdDate,
      });

      if (isPaid) {
        const payMethod = paymentMethod === "Stripe" ? "StripeFuture" : "COD";
        await Payment.create({
          user: user._id,
          order: order._id,
          amount: total,
          currency: "PKR",
          paymentMethod: payMethod,
          status: "Success",
          transactionId: generateTransactionId(),
        });
      }
    }
    console.log(`${targetOrders} orders created with payments`);
  }

  // ─── 5. BLOGS ───
  console.log("\n--- Seeding Blogs ---");
  const existingBlogs = await Blog.countDocuments();
  if (existingBlogs > 0) {
    console.log(`${existingBlogs} blogs already exist — skipping`);
  } else {
    const blogs = [
      { title: "Summer Fashion Guide 2026", slug: "summer-fashion-guide-2026", excerpt: "Stay cool and stylish this summer with our top lawn and chiffon picks.", content: "Summer is here and so is our latest collection of breathable lawn suits and lightweight chiffon ensembles. From vibrant prints to pastel solids, we've curated the ultimate guide to keeping your style fresh all season long.", coverImage: "/assets/images/banner-1.webp", category: "Fashion", tags: ["summer", "lawn", "style"], status: "PUBLISHED" },
      { title: "Wedding Season Edit", slug: "wedding-season-edit", excerpt: "Everything you need for the upcoming wedding festivities.", content: "Wedding season calls for showstopping ensembles. Our wedding edit features heavily embroidered organza suits, luxury pret, and handcrafted khussas. Discover the perfect outfit for every ceremony.", coverImage: "/assets/images/banner-2.webp", category: "Wedding", tags: ["wedding", "formal", "embroidered"], status: "PUBLISHED" },
      { title: "How to Style Your Khussa", slug: "how-to-style-khussa", excerpt: "Traditional footwear meets modern fashion.", content: "The classic khussa has made a major comeback. Whether you're pairing them with a casual kurta or a formal ensemble, here are our top tips for styling handcrafted khussas with confidence.", coverImage: "/assets/images/clothes/classic-embroidered-khussa/IMG1.webp", category: "Style Tips", tags: ["khussa", "footwear", "styling"], status: "PUBLISHED" },
      { title: "Fabric Care 101", slug: "fabric-care-101", excerpt: "Make your favorite pieces last longer.", content: "From delicate chiffon to durable khaddar, each fabric needs specific care. Learn how to wash, store, and maintain your Qissa Wear collection.", coverImage: "/assets/images/banner-3.webp", category: "Care", tags: ["fabric", "care", "maintenance"], status: "PUBLISHED" },
      { title: "Eid Collection Preview", slug: "eid-collection-preview", excerpt: "Get ready for Eid with our exclusive collection.", content: "Our upcoming Eid collection blends tradition with contemporary design. Here's an exclusive first look at what's coming.", coverImage: "/assets/images/banner-1.webp", category: "Collections", tags: ["eid", "new-arrivals", "collection"], status: "DRAFT" },
    ];
    for (const b of blogs) {
      const existing = await Blog.findOne({ slug: b.slug });
      if (existing) continue;
      await Blog.create({ ...b, publishedAt: b.status === "PUBLISHED" ? new Date() : null });
      console.log(`Blog: ${b.title}`);
    }
    console.log(`${blogs.length} blogs created`);
  }

  // ─── 6. WISHLISTS ───
  console.log("\n--- Seeding Wishlists ---");
  for (const email of customerEmails.slice(0, 4)) {
    const user = userMap[email];
    if (!user) continue;
    const existing = await Wishlist.findOne({ user: user._id });
    if (existing) continue;
    const randomProds = allProducts.sort(() => Math.random() - 0.5).slice(0, 3);
    await Wishlist.create({
      user: user._id,
      products: randomProds.map((p) => p._id),
    });
    console.log(`Wishlist for ${email}`);
  }

  console.log("\n=== SEED COMPLETE ===");
  await mongoose.connection.close();
  process.exit(0);
}

seedAll().catch(async (error) => {
  console.error("Seed failed:", error.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(1);
});
