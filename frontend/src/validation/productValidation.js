import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters"),

  sku: z
    .string()
    .trim()
    .min(1, "SKU is required"),

  price: z
    .number()
    .min(0, "Price cannot be negative"),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  description: z
    .string()
    .trim()
    .optional(),

  status: z
    .enum(["Active", "Inactive"]),
});