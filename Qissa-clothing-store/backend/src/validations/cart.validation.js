import { z } from "zod";
import mongoose from "mongoose";

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID.",
  });

export const addToCartSchema = z.object({
  product: objectId,

  color: z
    .string()
    .min(1, "Color is required"),

  size: z
    .string()
    .min(1, "Size is required"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

export const updateCartItemSchema = z.object({
  color: z
    .string()
    .min(1, "Color is required"),

  size: z
    .string()
    .min(1, "Size is required"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

export const removeCartItemSchema = z.object({
  color: z
    .string()
    .min(1, "Color is required"),

  size: z
    .string()
    .min(1, "Size is required"),
});
