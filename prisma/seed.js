const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Admin user
  const passwordHash = await bcrypt.hash('admin123', 12);
  await prisma.admin.upsert({
    where: { email: 'admin@bhawanijewellers.com' },
    update: {},
    create: { email: 'admin@bhawanijewellers.com', passwordHash, name: 'Admin' },
  });
  console.log('Admin user created');

  // 2. Store Settings
  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeName: 'Bhawani Jewellers',
      tagline: 'Premium Handcrafted Gold & Platinum Jewellery in Palghar',
      address: 'Shop No 3, Opposite Hutatma Chowk, Mahim Road, Palghar West - 401404.',
      phone: '+91 86989 09955',
      email: 'info@bhawanijewellers.com',
      openingHours: 'Monday - Sunday: 9:00 AM - 8:30 PM',
      heroHeading: 'Premium Gold & Platinum Jewellery in Palghar',
      heroSubheading: 'Exquisite gold, platinum and gemstone pieces crafted with traditional Indian techniques and modern elegance. Creating heirloom-quality jewellery for your most cherished moments.',
      heroImage: '/images/hero-banner.png',
      heroCTA1Text: 'View Collections',
      heroCTA1Link: '/collections',
      heroCTA2Text: 'Visit Our Store',
      heroCTA2Link: '/contact',
      aboutHeading: 'Crafting Legacy, One Ornament at a Time',
      aboutSubheading: 'Our Story',
      aboutContent: 'Founded with a vision to bring unparalleled purity and exquisite designs to the heart of Palghar, Bhawani Jewellers has established itself as a trusted name for families across generations.\n\nEvery piece in our showroom undergoes rigorous quality checks. We deal exclusively in BIS Hallmarked gold, ensuring that your investment is secure and authentic. Our master artisans, carrying forward centuries-old techniques, breathe life into gold, platinum, and precious stones.\n\nWhether you are looking for an elaborate bridal trousseau, a minimalist daily wear piece, or a bespoke custom design, our experts are dedicated to helping you find the perfect adornment that matches your personality and budget.',
      aboutImage: '/images/about-showroom.png',
      socialInstagram: 'https://instagram.com/bhawanijewellers',
      socialFacebook: 'https://facebook.com/bhawanijewellers',
      socialYoutube: 'https://youtube.com/@bhawanijewellers',
      footerText: 'Bhawani Jewellers is a family-owned jewellery enterprise in Palghar, specializing in premium handcrafted gold, platinum, gemstone, and diamond jewellery since 2024.',
    },
  });
  console.log('Store settings created');

  // 3. Categories
  const cats = [
    { name: 'Bridal Jewellery', slug: 'bridal-jewellery', description: 'Exquisite bridal sets and wedding jewellery crafted for your special day', image: '/images/categories/bridal-jewellery.png', displayOrder: 1 },
    { name: 'Gold Jewellery', slug: 'gold-jewellery', description: 'Premium 22K and 24K gold jewellery in traditional and contemporary designs', image: '/images/categories/gold-jewellery.png', displayOrder: 2 },
    { name: 'Platinum Jewellery', slug: 'platinum-jewellery', description: 'Elegant platinum pieces for the modern connoisseur', image: '/images/categories/platinum-jewellery.png', displayOrder: 3 },
    { name: 'Gemstone Jewellery', slug: 'gemstone-jewellery', description: 'Beautiful gemstone-studded jewellery featuring precious and semi-precious stones', image: '/images/categories/gemstone-jewellery.png', displayOrder: 4 },
    { name: 'Diamond Jewellery', slug: 'diamond-jewellery', description: 'Brilliant diamond jewellery for every occasion', image: '/images/categories/diamond-jewellery.png', displayOrder: 5 },
    { name: 'Custom & Bespoke', slug: 'custom-bespoke', description: 'Bespoke jewellery designed to your specifications by master craftsmen', image: '/images/categories/custom-bespoke.png', displayOrder: 6 },
  ];
  const createdCats = [];
  for (const c of cats) {
    const r = await prisma.category.upsert({ where: { slug: c.slug }, update: { image: c.image }, create: c });
    createdCats.push(r);
  }
  console.log('Categories created');

  // 4. Products
  const products = [
    { sku: 'BJ 1001', name: 'Classic Gold Necklace Set', slug: 'classic-gold-necklace-set', categoryId: createdCats[1].id, description: 'A stunning 22K gold necklace set featuring intricate traditional craftsmanship with modern appeal. Perfect for weddings and special occasions.', weight: 24.5, metalType: 'GOLD_22K', isTopTrending: true, isNewArrival: false, isSpecialSelection: false, primaryImage: '/images/products/necklace-1.png' },
    { sku: 'BJ 1002', name: 'Diamond Studded Bangles', slug: 'diamond-studded-bangles', categoryId: createdCats[4].id, description: 'Elegant pair of diamond-studded gold bangles with intricate meenakari work.', weight: 18.2, metalType: 'GOLD_22K', isTopTrending: true, isNewArrival: false, isSpecialSelection: false, primaryImage: '/images/products/bangles-1.png' },
    { sku: 'BJ 1003', name: 'Platinum Solitaire Ring', slug: 'platinum-solitaire-ring', categoryId: createdCats[2].id, description: 'A breathtaking platinum solitaire ring perfect for engagements.', weight: 5.8, metalType: 'PLATINUM', isTopTrending: true, isNewArrival: false, isSpecialSelection: false, primaryImage: '/images/products/ring-1.png' },
    { sku: 'BJ 1004', name: 'Temple Gold Earrings', slug: 'temple-gold-earrings', categoryId: createdCats[1].id, description: 'Traditional temple-style gold earrings with detailed goddess motifs.', weight: 8.3, metalType: 'GOLD_22K', isTopTrending: true, isNewArrival: false, isSpecialSelection: false, primaryImage: '/images/products/earrings-1.png' },
    { sku: 'BJ 2001', name: 'Modern Rose Gold Chain', slug: 'modern-rose-gold-chain', categoryId: createdCats[1].id, description: 'A contemporary rose gold chain with a delicate pendant.', weight: 6.7, metalType: 'GOLD_18K', isTopTrending: false, isNewArrival: true, isSpecialSelection: false, primaryImage: '/images/products/chain-1.png' },
    { sku: 'BJ 2002', name: 'Gemstone Cocktail Ring', slug: 'gemstone-cocktail-ring', categoryId: createdCats[3].id, description: 'A bold cocktail ring featuring a stunning emerald surrounded by diamonds.', weight: 7.1, metalType: 'GOLD_18K', isTopTrending: false, isNewArrival: true, isSpecialSelection: false, primaryImage: '/images/products/ring-2.png' },
    { sku: 'BJ 2003', name: 'Pearl Drop Earrings', slug: 'pearl-drop-earrings', categoryId: createdCats[3].id, description: 'Elegant pearl drop earrings in a gold setting.', weight: 4.2, metalType: 'GOLD_22K', isTopTrending: false, isNewArrival: true, isSpecialSelection: false, primaryImage: '/images/products/earrings-2.png' },
    { sku: 'BJ 2004', name: 'Mens Gold Bracelet', slug: 'mens-gold-bracelet', categoryId: createdCats[1].id, description: 'A sophisticated mens gold bracelet with a sleek design.', weight: 22.0, metalType: 'GOLD_22K', isTopTrending: false, isNewArrival: true, isSpecialSelection: false, primaryImage: '/images/products/bracelet-1.png' },
    { sku: 'BJ 3001', name: 'Royal Bridal Necklace Set', slug: 'royal-bridal-necklace-set', categoryId: createdCats[0].id, description: 'A magnificent bridal necklace set featuring kundan work with matching earrings and maang tikka.', weight: 65.0, metalType: 'GOLD_22K', isTopTrending: false, isNewArrival: false, isSpecialSelection: true, primaryImage: '/images/products/bridal-1.png' },
    { sku: 'BJ 3002', name: 'Antique Gold Choker', slug: 'antique-gold-choker', categoryId: createdCats[0].id, description: 'An antique-finish gold choker with temple motifs and ruby accents.', weight: 42.3, metalType: 'GOLD_22K', isTopTrending: false, isNewArrival: false, isSpecialSelection: true, primaryImage: '/images/products/choker-1.png' },
    { sku: 'BJ 3003', name: 'Diamond Tennis Bracelet', slug: 'diamond-tennis-bracelet', categoryId: createdCats[4].id, description: 'A classic diamond tennis bracelet featuring brilliant-cut diamonds in platinum.', weight: 12.5, metalType: 'PLATINUM', isTopTrending: false, isNewArrival: false, isSpecialSelection: true, primaryImage: '/images/products/bracelet-2.png' },
    { sku: 'BJ 3004', name: 'Wedding Mangalsutra', slug: 'wedding-mangalsutra', categoryId: createdCats[0].id, description: 'A beautifully crafted wedding mangalsutra with diamond pendants and black beads.', weight: 15.8, metalType: 'GOLD_22K', isTopTrending: false, isNewArrival: false, isSpecialSelection: true, primaryImage: '/images/products/mangalsutra-1.png' },
  ];
  for (const p of products) {
    await prisma.product.upsert({ where: { sku: p.sku }, update: { primaryImage: p.primaryImage }, create: { ...p, images: JSON.stringify([p.primaryImage]) } });
  }
  console.log('Products created');

  // 5. Metal Rates
  const rateCount = await prisma.metalRate.count();
  if (rateCount === 0) {
    await prisma.metalRate.create({ data: { type: '24K', purity: '999', ratePerGram: 7850.00 } });
    await prisma.metalRate.create({ data: { type: '22K', purity: '916', ratePerGram: 7200.00 } });
  }
  console.log('Metal rates created');

  // 6. Testimonials
  const testimonials = [
    { customerName: 'Priya M.', location: 'Palghar', reviewText: 'I purchased my entire bridal set from Bhawani Jewellers and I was absolutely blown away by the craftsmanship. Every piece was meticulously handcrafted with incredible attention to detail. The team helped me choose pieces that complemented my bridal outfit beautifully. I felt like a queen on my wedding day!', displayOrder: 1 },
    { customerName: 'Rahul K.', location: 'Vasai', reviewText: "I brought my grandmother's old gold necklace to Bhawani Jewellers for redesigning, and the result exceeded all my expectations. They transformed a dated piece into a stunning modern necklace while preserving its sentimental value. The craftsmanship and respect they showed for the original piece was truly remarkable.", displayOrder: 2 },
    { customerName: 'Neha & Amit', location: 'Mumbai', reviewText: 'As a couple shopping for our wedding jewellery, we wanted transparency and guidance. Bhawani Jewellers delivered on both counts. They patiently explained every detail about gold purity, pricing, and hallmarking. The collection was stunning and the prices were fair. The entire experience was stress-free and enjoyable!', displayOrder: 3 },
    { customerName: 'Sunita D.', location: 'Palghar', reviewText: 'I have been a loyal customer of Bhawani Jewellers for over 5 years now. Their consistency in quality and service is unmatched. Every festival season, I make it a point to visit their showroom. The staff is always welcoming and knowledgeable. Highly recommended!', displayOrder: 4 },
    { customerName: 'Vikram S.', location: 'Boisar', reviewText: 'Bought a pair of diamond earrings for my wife\'s anniversary gift. The brilliance and quality exceeded what I expected at this price point. The certification and hallmarking gave me complete confidence in my purchase. Will definitely return!', displayOrder: 5 },
  ];
  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { customerName: t.customerName } });
    if (!exists) await prisma.testimonial.create({ data: t });
  }
  console.log('Testimonials created');

  // 7. Services
  const services = [
    { title: 'Bespoke Jewellery Design', shortDescription: 'Custom-designed jewellery crafted to your vision by master artisans.', detailedDescription: 'Work directly with our master craftsmen to bring your jewellery vision to life. From initial sketches to the final masterpiece, we guide you through every step.', icon: 'sparkles', displayOrder: 1 },
    { title: 'Jewellery Redesign', shortDescription: 'Transform cherished old pieces into stunning modern designs.', detailedDescription: 'Breathe new life into your treasured heirloom jewellery. Our artisans can redesign and modernize old pieces while preserving their sentimental value.', icon: 'refresh', displayOrder: 2 },
    { title: 'Certified Hallmarking', shortDescription: 'BIS-certified hallmarking guaranteeing purity of gold and silver.', detailedDescription: 'All our gold and silver jewellery comes with BIS-certified hallmarking, providing an official guarantee of metal purity and complete transparency.', icon: 'shield-check', displayOrder: 3 },
    { title: 'Professional Valuation', shortDescription: 'Expert jewellery valuation for insurance, tax, or personal purposes.', detailedDescription: 'Our certified valuers provide accurate and professional jewellery appraisals for insurance, tax assessment, or personal knowledge.', icon: 'document-text', displayOrder: 4 },
    { title: 'Quality Assurance', shortDescription: 'Rigorous quality checks on every piece for guaranteed excellence.', detailedDescription: 'Every piece undergoes our comprehensive multi-point quality inspection to ensure the highest standards.', icon: 'badge-check', displayOrder: 5 },
    { title: 'Cleaning & Polishing', shortDescription: "Complimentary professional cleaning to restore your jewellery's brilliance.", detailedDescription: 'Keep your precious jewellery looking brilliant with our complimentary professional cleaning and polishing service.', icon: 'star', displayOrder: 6 },
  ];
  for (const s of services) {
    const exists = await prisma.service.findFirst({ where: { title: s.title } });
    if (!exists) await prisma.service.create({ data: s });
  }
  console.log('Services created');

  // 8. Blog Posts
  const posts = [
    { title: 'How to Select the Perfect Bridal Necklace', slug: 'how-to-select-perfect-bridal-necklace', excerpt: 'Choosing the right bridal necklace is one of the most important decisions a bride makes. Learn expert tips.', content: 'Your bridal necklace is more than just jewellery — it is the centrepiece of your entire bridal ensemble. Consider your neckline, match your metal to your skin tone, think about comfort, and set a budget. Visit Bhawani Jewellers to explore our stunning bridal collection.', coverImage: '/images/blog/bridal-necklace.png', isPublished: true, publishDate: new Date('2025-03-15') },
    { title: 'Tips for Maintaining Your Gold Jewellery Shine', slug: 'tips-maintaining-gold-jewellery-shine', excerpt: 'Gold jewellery requires proper care to maintain its lustre. Discover expert tips to keep your pieces brilliant.', content: 'Gold jewellery is an investment that can last generations. Remove before bathing, apply makeup first, store separately. For cleaning, soak in mild soapy water for 15 minutes, scrub gently, rinse and dry. Visit Bhawani Jewellers for complimentary cleaning.', coverImage: '/images/blog/gold-maintenance.png', isPublished: true, publishDate: new Date('2025-04-20') },
  ];
  for (const p of posts) {
    await prisma.blogPost.upsert({ where: { slug: p.slug }, update: { coverImage: p.coverImage }, create: p });
  }
  console.log('Blog posts created');
  console.log('Database seeded successfully!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
