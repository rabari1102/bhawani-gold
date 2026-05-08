import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ProductCard from '@/components/public/ProductCard';
import CollectionFilters from '@/components/public/CollectionFilters';
import Link from 'next/link';

export default async function CollectionsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const weightParam = typeof resolvedParams.weight === 'string' ? resolvedParams.weight : undefined;

  // Build Prisma where clause
  const where: any = { isVisible: true };
  
  if (weightParam) {
    if (weightParam === '0-5') where.weight = { gte: 0, lte: 5 };
    else if (weightParam === '5-10') where.weight = { gt: 5, lte: 10 };
    else if (weightParam === '10-20') where.weight = { gt: 10, lte: 20 };
    else if (weightParam === '20-50') where.weight = { gt: 20, lte: 50 };
    else if (weightParam === '50-plus') where.weight = { gt: 50 };
  }

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { displayOrder: 'asc' },
      include: { children: { orderBy: { displayOrder: 'asc' } } }
    }),
    prisma.product.findMany({
      where,
      orderBy: { isTopTrending: 'desc' }
    })
  ]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      {/* Breadcrumbs & Header */}
      <div className="pt-28 pb-8 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 uppercase tracking-widest font-medium">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <span className="text-black">All Products</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500 mt-2">Explore our complete collection of fine jewellery.</p>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/4 xl:w-1/5 shrink-0">
              <CollectionFilters categories={categories} />
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={{...product, weight: product.weight || null, price: product.price || null, primaryImage: product.primaryImage || null}} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                  <div className="text-6xl mb-4 text-gray-200">✧</div>
                  <h3 className="text-xl font-heading font-bold text-gray-500 mb-2">No products found</h3>
                  <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
