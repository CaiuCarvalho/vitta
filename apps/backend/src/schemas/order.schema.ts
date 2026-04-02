import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.string().min(1, "productId is required"),
          quantity: z.number().int().positive("Quantity must be greater than zero"),
        })
      )
      .min(1, "Order must have at least one item"),
  }),
});

export const patchTrackingSchema = z.object({
  body: z.object({
    trackingCode: z.string().min(5, "O código de rastreamento é muito curto e inválido."),
  }),
});
