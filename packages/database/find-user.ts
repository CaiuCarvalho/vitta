import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    select: { email: true, name: true, role: true }
  });
  console.log("TEST_USER:", JSON.stringify(user));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
