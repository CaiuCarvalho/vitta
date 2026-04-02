import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Formato de e-mail inválido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres."),
    email: z.string().email("Formato de e-mail inválido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Formato de e-mail inválido."),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Formato de e-mail inválido."),
    code: z.string().length(6, "O código deve ter exatamente 6 dígitos."),
    newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres."),
  }),
});
