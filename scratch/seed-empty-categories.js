const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  
  const mockProducts = {
    'bracelets': [
      { name: 'Kundan Bangle Bracelet', price: 45000, img: '/images/bangle.png' },
      { name: 'Men\'s Gold Chain Bracelet', price: 65000, img: '/images/necklace.png' }
    ],
    'chains': [
      { name: 'Classic Rope Chain', price: 35000, img: '/images/necklace.png' },
      { name: 'Thick Curb Chain', price: 85000, img: '/images/necklace.png' }
    ],
    'mangalsutra': [
      { name: 'Traditional Maharashtrian Mangalsutra', price: 55000, img: '/images/necklace.png' },
      { name: 'Short Daily Wear Mangalsutra', price: 25000, img: '/images/necklace.png' }
    ],
    'rings': [
      { name: '22k Gold Engagement Ring', price: 15000, img: '/images/earrings.png' },
      { name: 'Men\'s Signet Ring', price: 30000, img: '/images/earrings.png' }
    ]
  };

  for (const cat of categories) {
    if (mockProducts[cat.slug]) {
      const items = mockProducts[cat.slug];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const slug = `${cat.slug}-item-${i+1}`;
        const existing = await prisma.product.findUnique({ where: { slug } });
        
        if (!existing) {
          await prisma.product.create({
            data: {
              name: item.name,
              slug: slug,
              sku: `SKU-${cat.slug.toUpperCase()}-${i+1}`,
              description: `Beautiful ${item.name} for your collection.`,
              categoryId: cat.id,
              price: item.price,
              primaryImage: item.img,
              metalType: 'GOLD',
              isVisible: true,
              isTopTrending: i === 0, // Make the first one trending
            }
          });
          console.log(`Created product: ${item.name} in ${cat.slug}`);
        }
      }
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
