import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3001"),
  JWT_SECRET: z.string().min(10, "JWT_SECRET deve ter no mínimo 10 caracteres."),
  ABACATE_PAY_API_KEY: z.string().min(5, "ABACATE_PAY_API_KEY deve estar definido").optional(),
  ABACATE_WEBHOOK_SECRET: z.string().min(5, "ABACATE_WEBHOOK_SECRET deve estar definido").optional(),
  DATABASE_URL: z.string().url("DATABASE_URL deve ser uma URL válida"),
  RESEND_API_KEY: z.string().min(5, "RESEND_API_KEY deve estar definido"),
  EMAIL_FROM: z.string().email("EMAIL_FROM deve ser um e-mail válido"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL deve ser um e-mail válido"),
  ADMIN_NEW_PASSWORD: z.string().min(8, "ADMIN_NEW_PASSWORD deve ter no mínimo 8 caracteres"),
});

export const validateEnv = () => {
  const _env = envSchema.safeParse(process.env);

  if (!_env.success) {
    console.error("❌ ERRO GRAVE: Variáveis de ambiente inválidas ou ausentes:");
    _env.error.issues.forEach((issue) => {
      console.error(`  👉 ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1); // Encerra aplicação para evitar rodar inseguro
  }
  
  console.log("✅ Ambiente (ENV) verificado com segurança.");
  return _env.data;
};
