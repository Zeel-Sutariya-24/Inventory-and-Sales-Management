const { z } = require("zod");

const orderSchema = z.object({
  customer: z
    .string()
    .min(1, "Customer is required"),

  items: z
    .array(
      z.object({
        product: z
          .string()
          .min(1, "Product is required"),

        quantity: z
          .number()
          .int("Quantity must be a whole number")
          .min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Order must contain at least one product"),
});

module.exports = {
  orderSchema,
};