export const dynamic = 'force-dynamic';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function CategoryPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { displayOrder: 'asc' },
    include: { 
      children: { orderBy: { displayOrder: 'asc' } },
      _count: { select: { products: true } }
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero */}
      <div className="pt-32 pb-16 bg-[#FFF8F0]">
        <div className="container-custom text-center">
          <span className="text-[#B8860B] font-semibold tracking-widest uppercase text-sm mb-4 block">Browse</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">Shop By Category</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore our curated collection of fine jewellery across all categories.
          </p>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map(category => (
              <Link key={category.id} href={`/collections/${category.slug}`} className="group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 relative mb-4">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] to-[#f5ede0] text-[#c5a059] text-5xl">
                      ✦
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs font-semibold tracking-wider uppercase bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {category._count.products} Products
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-heading font-bold text-gray-900 group-hover:text-[#c5a059] transition-colors">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
                )}
                {category.children.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {category.children.slice(0, 3).map(child => (
                      <span key={child.id} className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{child.name}</span>
                    ))}
                    {category.children.length > 3 && (
                      <span className="text-[11px] text-[#c5a059] font-medium">+{category.children.length - 3} more</span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
