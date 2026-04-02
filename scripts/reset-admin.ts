import { prisma } from "../packages/database/src";
import bcrypt from "bcryptjs";

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("❌ ERRO: Variável de ambiente ADMIN_PASSWORD não definda.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.update({
    where: { email: "caiul.lfc@gmail.com" },
    data: { password_hash: passwordHash, role: "ADMIN" },
  });
  console.log("✅ Senha do admin redefinida com sucesso a partir da env segura.");
}

main().catch(console.error);
