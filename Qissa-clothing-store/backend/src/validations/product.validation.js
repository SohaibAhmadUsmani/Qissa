import { z } from "zod";

// Image Schema
const imageSchema = z.object({
  url: z.string().min(1, "Image URL is required"),
  alt: z.string().optional(),
});

// Variant Schema
const variantSchema = z.object({
  color: z.string().min(1, "Color is required"),

  size: z.string().min(1, "Size is required"),

  stock: z
    .number()
    .int()
    .min(0, "Stock cannot be negative"),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must contain at least 3 characters"),

  slug: z
    .string()
    .min(3, "Slug is required")
    .toLowerCase(),

  description: z
    .string()
    .min(10, "Description should contain at least 10 characters"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  discountPrice: z
    .number()
    .min(0)
    .optional(),

  category: z.string(),

  subCategory: z
    .string()
    .optional(),

  brand: z
    .string()
    .optional(),

  fabric: z
    .string()
    .optional(),

  images: z
    .array(imageSchema)
    .min(1, "At least one image is required"),

  variants: z
    .array(variantSchema)
    .min(1, "At least one product variant is required"),

  rating: z
    .number()
    .min(0)
    .max(5)
    .optional(),

  numReviews: z
    .number()
    .int()
    .min(0)
    .optional(),

  isFeatured: z
    .boolean()
    .optional(),

  isNewArrival: z
    .boolean()
    .optional(),

  isActive: z
    .boolean()
    .optional(),

  tags: z
    .array(z.string())
    .optional(),
});