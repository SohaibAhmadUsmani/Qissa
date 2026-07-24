import express from "express";

import {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
} from "../controllers/cartController.js";

import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../validations/cart.validation.js";

const router = express.Router();

router.use(protect);

router.post("/", validate(addToCartSchema), addToCart);

router.get("/", getCart);

router.put("/:productId", validate(updateCartItemSchema), updateQuantity);

router.delete("/", clearCart);

router.delete("/:productId", validate(removeCartItemSchema), removeItem);

export default router;
