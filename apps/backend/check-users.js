const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    select: { email: true, password_hash: true }
  });
  console.log("USERS IN DB:");
  users.forEach(u => {
    const isHashed = u.password_hash.startsWith('$2a$') || u.password_hash.startsWith('$2b$');
    console.log(`- ${u.email}: password_hash is ${isHashed ? 'VALID BCRYPT HASH' : 'PLAIN TEXT (WILL FAIL LOGIN)'}`);
  });
}

main().catch(console.error).finally(() => process.exit(0));
