const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = [
  `CREATE TABLE IF NOT EXISTS "Admin" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "name" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "name" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "Category" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "slug" TEXT NOT NULL, "description" TEXT, "image" TEXT, "displayOrder" INTEGER NOT NULL DEFAULT 0, "parentId" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "Product" ("id" TEXT NOT NULL PRIMARY KEY, "sku" TEXT NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL, "categoryId" TEXT NOT NULL, "description" TEXT, "weight" REAL, "metalType" TEXT NOT NULL DEFAULT 'GOLD_22K', "purity" TEXT DEFAULT '22K 916', "availabilityStatus" TEXT NOT NULL DEFAULT 'In Stock', "isHallmarked" BOOLEAN NOT NULL DEFAULT true, "price" REAL, "isTopTrending" BOOLEAN NOT NULL DEFAULT false, "isNewArrival" BOOLEAN NOT NULL DEFAULT false, "isSpecialSelection" BOOLEAN NOT NULL DEFAULT false, "isVisible" BOOLEAN NOT NULL DEFAULT true, "images" TEXT NOT NULL DEFAULT '[]', "primaryImage" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "MetalRate" ("id" TEXT NOT NULL PRIMARY KEY, "type" TEXT NOT NULL, "purity" TEXT NOT NULL, "ratePerGram" REAL NOT NULL, "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "Testimonial" ("id" TEXT NOT NULL PRIMARY KEY, "customerName" TEXT NOT NULL, "location" TEXT NOT NULL, "reviewText" TEXT NOT NULL, "displayOrder" INTEGER NOT NULL DEFAULT 0, "isVisible" BOOLEAN NOT NULL DEFAULT true, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "Service" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "shortDescription" TEXT NOT NULL, "detailedDescription" TEXT, "icon" TEXT, "image" TEXT, "displayOrder" INTEGER NOT NULL DEFAULT 0, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "BlogPost" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "slug" TEXT NOT NULL, "excerpt" TEXT NOT NULL, "content" TEXT NOT NULL, "coverImage" TEXT, "publishDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "isPublished" BOOLEAN NOT NULL DEFAULT false, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "StoreSettings" ("id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default', "storeName" TEXT NOT NULL DEFAULT 'Bhawani Jewellers', "tagline" TEXT, "address" TEXT, "phone" TEXT, "email" TEXT, "openingHours" TEXT, "heroHeading" TEXT, "heroSubheading" TEXT, "heroImage" TEXT, "heroCTA1Text" TEXT, "heroCTA1Link" TEXT, "heroCTA2Text" TEXT, "heroCTA2Link" TEXT, "aboutHeading" TEXT, "aboutSubheading" TEXT, "aboutContent" TEXT, "aboutImage" TEXT, "socialInstagram" TEXT, "socialFacebook" TEXT, "socialYoutube" TEXT, "footerText" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "ContactEnquiry" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "phone" TEXT, "message" TEXT NOT NULL, "interestedIn" TEXT, "isRead" BOOLEAN NOT NULL DEFAULT false, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Product_sku_key" ON "Product"("sku")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug")`,
];

async function main() {
  console.log('Pushing schema to Turso database...');
  for (const sql of statements) {
    const tableName = sql.match(/"(\w+)"/)?.[1] || 'index';
    try {
      await client.execute(sql);
      console.log(`  ✓ ${tableName}`);
    } catch (err) {
      console.log(`  ✗ ${tableName}: ${err.message}`);
    }
  }
  console.log('Done!');
}

main().catch(console.error);
