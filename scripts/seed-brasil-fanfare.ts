import { prisma } from "../packages/database";

async function main() {
  console.log("🌱 Iniciando Seed: Brasil Fanfare - Elite Collection");

  // 1. Limpar dados antigos (Opcional, mas recomendado para o teste)
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();

  // 2. Criar Categorias
  const jerseys = await prisma.category.upsert({
    where: { slug: "jerseys" },
    update: {},
    create: { name: "Match Jerseys", slug: "jerseys", description: "Mantos oficiais de jogo e torcida" }
  });

  const accessories = await prisma.category.upsert({
    where: { slug: "acessorios" },
    update: {},
    create: { name: "Acessórios", slug: "acessorios", description: "Bonés, mochilas e equipamentos" }
  });

  // 3. Criar Produtos com IDs específicos para casar com o Frontend (para o teste real)
  // Nota: O frontend atual usa "1", "2", "3", "4" no mock de page.tsx
  
  const products = [
    {
      id: "1", // Manto Jogador
      name: "Manto Jogador Brasil 24/25",
      description: "A mesma camisa que nossos craques usam em campo. Tecnologia de alta performance Advance-Fit.",
      price: 499.90,
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2736&auto=format&fit=crop",
      categoryId: jerseys.id
    },
    {
      id: "2", // Manto Torcedor
      name: "Manto Torcedor Brasil 24/25",
      description: "Conforto e tradição para vibrar na arquibancada. Tecido Dry-Vitta ultra respirável.",
      price: 349.90,
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2736&auto=format&fit=crop",
      categoryId: jerseys.id
    },
    {
      id: "3", // Boné
      name: "Boné Brasil Heritage",
      description: "Estilo clássico e proteção. Ajuste premium e escudo bordado em alta definição.",
      price: 149.90,
      imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=2536&auto=format&fit=crop",
      categoryId: accessories.id
    },
    {
      id: "4", // Bola
      name: "Bola Profissional CBF",
      description: "A bola oficial das grandes conquistas. Tecnologia de voo estável e toque macio.",
      price: 189.90,
      imageUrl: "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=2670&auto=format&fit=crop",
      categoryId: accessories.id
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: { ...p },
      create: { ...p }
    });
  }

  console.log("✅ Seed finalizado com sucesso! 3 Produtos carregados.");
}

main()
  .catch((e) => {
    console.error("❌ Erro no Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
