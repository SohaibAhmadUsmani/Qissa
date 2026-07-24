import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { addToWishlistSchema } from "../validations/wishlist.validation.js";

const router = express.Router();

router.use(protect);

router.post("/", validate(addToWishlistSchema), addToWishlist);

router.get("/", getWishlist);

router.delete("/", clearWishlist);

router.delete("/:productId", removeFromWishlist);

export default router;
