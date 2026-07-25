import mongoose from "mongoose";

const LOCAL_URI = "mongodb://localhost:27017/qissa";
const ATLAS_URI = "mongodb+srv://Ayyan_Zubair:ayyan123@cluster0.lxzbk8y.mongodb.net/qissa";

async function getCollections(db) {
  const names = await db.listCollections().toArray();
  const data = {};
  for (const { name } of names) {
    const docs = await db.collection(name).find({}).toArray();
    data[name] = docs;
    console.log(`  ${name}: ${docs.length} documents`);
  }
  return data;
}

async function migrate() {
  console.log("Connecting to local MongoDB...");
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log("Connected to local. Reading data...");
  const data = await getCollections(localConn.db);

  console.log("\nConnecting to MongoDB Atlas...");
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log("Connected to Atlas. Writing data...");

  for (const [name, docs] of Object.entries(data)) {
    if (docs.length === 0) continue;
    const col = atlasConn.db.collection(name);
    await col.deleteMany({});
    await col.insertMany(docs);
    console.log(`  ${name}: ${docs.length} documents written`);
  }

  console.log("\nMigration complete!");
  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
