import mongoose from "mongoose";
import { env } from "../config/env.js";
import Product from "../models/Product.js";
import products from "../seed/catalogProducts.js";

async function seedProducts() {
	if (!env.MONGO_URI) {
		throw new Error("MONGO_URI is required to run seed");
	}

	await mongoose.connect(env.MONGO_URI);
	console.log("MongoDB connected for seeding");

	const ops = products.map((p) => ({
		updateOne: {
			filter: { slug: p.slug },
			update: { $set: p },
			upsert: true,
		},
	}));

	const result = await Product.bulkWrite(ops);
	const upserted = result.upsertedCount || 0;
	const modified = result.modifiedCount || 0;

	console.log(`Seed complete: ${upserted} created, ${modified} updated`);
}

seedProducts()
	.then(async () => {
		await mongoose.connection.close();
		console.log("Database connection closed");
		process.exit(0);
	})
	.catch(async (error) => {
		console.error("Seeding failed:", error.message);
		if (mongoose.connection.readyState !== 0) {
			await mongoose.connection.close();
		}
		process.exit(1);
	});
