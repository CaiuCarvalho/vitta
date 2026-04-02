import { z } from "zod";

export const createAddressSchema = z.object({
  body: z.object({
    street: z.string().min(1, "Street is required"),
    number: z.string().min(1, "Number is required"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Neighborhood is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required").max(2, "State must be 2 letters"),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "Invalid zip code format"),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    street: z.string().min(1).optional(),
    number: z.string().min(1).optional(),
    complement: z.string().optional(),
    neighborhood: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).max(2).optional(),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/).optional(),
    isDefault: z.boolean().optional(),
  }),
});
