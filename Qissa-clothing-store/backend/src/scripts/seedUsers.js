import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import User from "../models/User.js";

const users = [
  { name: "Uzma", email: "uzma@gmail.com", password: "pass12345", role: "customer" },
  { name: "Romesa", email: "romesa@gmail.com", password: "pass12345", role: "customer" },
  { name: "Ayyan", email: "ayyan@gmail.com", password: "pass12345", role: "customer" },
  { name: "Noor", email: "noor@gmail.com", password: "pass12345", role: "customer" },
  { name: "Seerat", email: "seerat@gmail.com", password: "pass12345", role: "customer" },
  { name: "Fatima", email: "fatima@gmail.com", password: "pass12345", role: "customer" },
  { name: "Ayesha", email: "ayesha@gmail.com", password: "pass12345", role: "customer" },
  { name: "Bushra", email: "bushra@gmail.com", password: "pass12345", role: "customer" },
];

async function seedUsers() {
  await mongoose.connect(env.MONGO_URI);
  console.log("MongoDB connected");

  let created = 0;

  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`Skipped ${u.email} — already exists`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(u.password, 10);

    await User.create({
      name: u.name,
      email: u.email,
      password: hashedPassword,
      role: u.role,
    });

    console.log(`Created ${u.email}`);
    created++;
  }

  console.log(`Done. ${created} users created.`);
  await mongoose.connection.close();
  process.exit(0);
}

seedUsers().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
