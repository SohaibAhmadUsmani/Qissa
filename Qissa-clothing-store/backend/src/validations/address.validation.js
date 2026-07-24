import { z } from "zod";

export const createAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters"),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 characters"),

  country: z
    .string()
    .trim()
    .min(1, "Country is required"),

  provinceState: z
    .string()
    .trim()
    .min(1, "Province or state is required"),

  city: z
    .string()
    .trim()
    .min(1, "City is required"),

  postalCode: z
    .string()
    .trim()
    .min(1, "Postal code is required"),

  streetAddress: z
    .string()
    .trim()
    .min(5, "Street address must be at least 5 characters"),

  landmark: z
    .string()
    .trim()
    .optional(),

  addressType: z
    .enum(["Home", "Office", "Other"])
    .optional(),

  isDefault: z
    .boolean()
    .optional(),
});

export const updateAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .optional(),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 characters")
    .optional(),

  country: z
    .string()
    .trim()
    .min(1, "Country is required")
    .optional(),

  provinceState: z
    .string()
    .trim()
    .min(1, "Province or state is required")
    .optional(),

  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .optional(),

  postalCode: z
    .string()
    .trim()
    .min(1, "Postal code is required")
    .optional(),

  streetAddress: z
    .string()
    .trim()
    .min(5, "Street address must be at least 5 characters")
    .optional(),

  landmark: z
    .string()
    .trim()
    .optional(),

  addressType: z
    .enum(["Home", "Office", "Other"])
    .optional(),

  isDefault: z
    .boolean()
    .optional(),
});
