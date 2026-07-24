import { z } from "zod";
import mongoose from "mongoose";

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID.",
  });

export const addToWishlistSchema = z.object({
  product: objectId,
});
