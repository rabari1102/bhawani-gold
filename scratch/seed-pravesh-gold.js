const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Wiping existing data...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('Creating Pravesh Gold styled categories...');

  // 1. Parent Categories
  const goldJewellery = await prisma.category.create({
    data: { name: 'Gold Jewellery', slug: 'gold-jewellery', displayOrder: 1 }
  });

  const goldCoins = await prisma.category.create({
    data: { name: 'Gold Coins', slug: 'gold-coins', displayOrder: 2 }
  });

  const silver = await prisma.category.create({
    data: { name: 'Silver', slug: 'silver', displayOrder: 3 }
  });

  // 2. Subcategories for Gold Jewellery
  const subCats = ['Bangles', 'Bracelets', 'Chain', 'Earrings', 'Kada', 'Mangalsutra', 'Nathiya', 'Necklaces', 'Pendants', 'Rings', 'Wedding Set'];
  
  for (let i = 0; i < subCats.length; i++) {
    await prisma.category.create({
      data: {
        name: subCats[i],
        slug: subCats[i].toLowerCase().replace(/\s+/g, '-'),
        parentId: goldJewellery.id,
        displayOrder: i + 1,
      }
    });
  }

  // 3. Subcategories for Gold Coins
  const coinCats = ['0.5 Gram', '1 Gram', '2 Gram', '5 Gram', '10 Gram', '20 Gram', '50 Gram'];
  for (let i = 0; i < coinCats.length; i++) {
    await prisma.category.create({
      data: {
        name: coinCats[i],
        slug: coinCats[i].toLowerCase().replace(/\s+/g, '-').replace('.', '-'),
        parentId: goldCoins.id,
        displayOrder: i + 1,
      }
    });
  }

  console.log('Categories created successfully.');

  // Create some mock products
  const bangles = await prisma.category.findUnique({ where: { slug: 'bangles' } });
  const necklaces = await prisma.category.findUnique({ where: { slug: 'necklaces' } });
  const rings = await prisma.category.findUnique({ where: { slug: 'rings' } });

  const mockProducts = [
    { name: 'Plain Daily Wear Bangles', slug: 'plain-daily-wear-bangles', catId: bangles.id, weight: 15.5, sku: 'BGL-001', isTrending: true },
    { name: 'Kundan Antique Necklace', slug: 'kundan-antique-necklace', catId: necklaces.id, weight: 45.2, sku: 'NCK-001', isNewArrival: true },
    { name: 'Rose Gold Couple Rings', slug: 'rose-gold-couple-rings', catId: rings.id, weight: 12.0, sku: 'RNG-001', isTrending: true },
    { name: 'Bridal Wedding Set', slug: 'bridal-wedding-set-1', catId: necklaces.id, weight: 120.0, sku: 'SET-001', isSpecialSelection: true }
  ];

  for (const p of mockProducts) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        categoryId: p.catId,
        weight: p.weight,
        description: `Premium ${p.name} handcrafted to perfection.`,
        metalType: 'GOLD_22K',
        purity: '22K 916',
        availabilityStatus: 'In Stock',
        isHallmarked: true,
        isTopTrending: p.isTrending || false,
        isNewArrival: p.isNewArrival || false,
        isSpecialSelection: p.isSpecialSelection || false,
        isVisible: true
      }
    });
    console.log(`Created product: ${p.name}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
