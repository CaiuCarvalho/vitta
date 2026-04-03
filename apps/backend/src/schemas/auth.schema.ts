import { z } from "zod";

// Item 6: Schema de senha forte — min 8, 1 maiúscula, 1 número
// Centralizado aqui para reusar em register e reset
const strongPasswordSchema = z
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres.")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
  .regex(/\d/, "A senha deve conter pelo menos um número.");

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Formato de e-mail inválido."),
    // Login mantém min 6 para não bloquear usuários com senhas antigas durante transição
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres."),
    email: z.string().email("Formato de e-mail inválido."),
    // Item 6: Registro exige senha forte
    password: strongPasswordSchema,
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
    // Item 6: Reset também exige senha forte
    newPassword: strongPasswordSchema,
  }),
});
