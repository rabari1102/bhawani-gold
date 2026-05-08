const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Get Categories
  const coinCat = await prisma.category.findUnique({ where: { slug: 'gold-coins' } });
  
  // 2. Add some Gold Coin products if they don't exist
  if (coinCat) {
    const weights = [1, 2, 5, 10, 20, 50];
    for (const w of weights) {
      const slug = `24k-pure-gold-coin-${w}g`;
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (!existing) {
        await prisma.product.create({
          data: {
            name: `24K Pure Gold Coin - ${w} Grams`,
            slug: slug,
            sku: `GC24K-${w}G`,
            description: `Premium 24K (99.9%) pure gold coin weighing ${w} grams. Comes with certification.`,
            categoryId: coinCat.id,
            price: w * 7500, // mock price
            weight: w,
            primaryImage: '/images/coin.png',
            metalType: 'GOLD',
            isVisible: true,
            isTopTrending: w === 10 || w === 5,
          }
        });
        console.log(`Created coin: ${w}g`);
      } else {
        await prisma.product.update({
          where: { id: existing.id },
          data: { primaryImage: '/images/coin.png' }
        });
      }
    }
  }

  // 3. Update existing products with images based on their categories or slugs
  const products = await prisma.product.findMany({ include: { category: true } });
  
  for (const p of products) {
    let img = null;
    if (p.category?.slug.includes('coin') || p.slug.includes('coin')) img = '/images/coin.png';
    else if (p.category?.slug.includes('bangle') || p.slug.includes('bangle')) img = '/images/bangle.png';
    else if (p.category?.slug.includes('necklace') || p.slug.includes('necklace')) img = '/images/necklace.png';
    else if (p.category?.slug.includes('earring') || p.slug.includes('earring')) img = '/images/earrings.png';
    else img = '/images/necklace.png'; // default fallback for any other jewelry

    if (img && p.primaryImage !== img) {
      await prisma.product.update({
        where: { id: p.id },
        data: { primaryImage: img }
      });
      console.log(`Updated product ${p.name} with image ${img}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
