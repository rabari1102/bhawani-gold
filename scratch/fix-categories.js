const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Gold Jewellery', slug: 'gold-jewellery', description: 'All kinds of premium gold jewellery.' },
    { name: 'Bracelets', slug: 'bracelets', description: 'Elegant gold bracelets for all occasions.' },
    { name: 'Chains', slug: 'chains', description: 'Classic and modern gold chains.' },
    { name: 'Earrings', slug: 'earrings', description: 'Beautiful gold earrings and jhumkas.' },
    { name: 'Mangalsutra', slug: 'mangalsutra', description: 'Traditional and modern Mangalsutras.' },
    { name: 'Rings (Anguthi)', slug: 'rings', description: 'Premium gold rings.' },
    { name: 'Necklaces', slug: 'necklaces', description: 'Stunning gold necklaces.' },
    { name: 'Bangles', slug: 'bangles', description: 'Traditional gold bangles.' },
    { name: 'Gold Coins', slug: 'gold-coins', description: '24k pure gold coins.' }
  ];

  let order = 10;
  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          displayOrder: order++,
        }
      });
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Category exists: ${cat.name}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
