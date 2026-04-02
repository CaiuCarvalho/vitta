const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();

  // 1. Criar categoria
  const category = await prisma.category.upsert({
    where: { slug: "camisas" },
    update: {},
    create: {
      slug: "camisas",
      name: "Camisas da Seleção",
      description: "Camisas oficiais e de torcedor da Seleção Brasileira",
    },
  });
  console.log("✅ Categoria criada/existente:", category.name, category.id);

  // 2. Criar produto de teste
  const product = await prisma.product.create({
    data: {
      name: "Camisa Seleção Brasileira 2026 - Titular",
      description: "Camisa oficial da Seleção Brasileira para a Copa 2026. Material Dri-FIT, tecnologia de ponta.",
      price: 349.90,
      imageUrl: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800",
      categoryId: category.id,
    },
  });
  console.log("✅ Produto criado:", product.name, "| ID:", product.id, "| R$", product.price);
}

main().catch(console.error).finally(() => process.exit(0));
