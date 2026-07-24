import { Router } from "express";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "../../../frontend/public");
const CACHE_DIR = path.resolve(__dirname, "../../../frontend/public/.thumbnails");

const router = Router();

const FORMAT_MAP = {
  ".jpg": "jpeg",
  ".jpeg": "jpeg",
  ".png": "png",
  ".webp": "webp",
};

router.get("/{*imagePath}", async (req, res) => {
  const assetPath = "/assets" + (req.path.startsWith("/") ? req.path : "/" + req.path);
  const resolved = path.resolve(PUBLIC_DIR, "." + assetPath);

  if (!resolved.startsWith(PUBLIC_DIR)) {
    return res.status(403).send("Forbidden");
  }

  if (!fs.existsSync(resolved)) {
    return res.status(404).send("Not found");
  }

  const width = parseInt(req.query.w) || null;

  if (!width || width <= 0) {
    return res.sendFile(resolved);
  }

  const ext = path.extname(resolved).toLowerCase();
  if (!FORMAT_MAP[ext]) {
    return res.sendFile(resolved);
  }

  const relativePath = resolved.slice(PUBLIC_DIR.length).replace(/\\/g, "/");
  const cacheName = relativePath.replace(ext, `.w${width}${ext}`);
  const cachePath = path.join(CACHE_DIR, cacheName);

  if (fs.existsSync(cachePath)) {
    const data = fs.readFileSync(cachePath);
    res.set("Content-Type", `image/${FORMAT_MAP[ext]}`);
    return res.send(data);
  }

  fs.mkdirSync(path.dirname(cachePath), { recursive: true });

  try {
    await sharp(resolved)
      .resize(width, undefined, { fit: "cover", withoutEnlargement: true })
      .toFile(cachePath);

    const data = fs.readFileSync(cachePath);
    res.set("Content-Type", `image/${FORMAT_MAP[ext]}`);
    res.send(data);
  } catch (err) {
    res.sendFile(resolved);
  }
});

export default router;
