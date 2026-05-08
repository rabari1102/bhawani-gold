import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { metalTypeLabels } from '@/lib/utils';
import ProductActions from '@/components/public/ProductActions';
import ProductGallery from '@/components/public/ProductGallery';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true }
  });

  if (!product || !product.isVisible) {
    notFound();
  }

  // Parse images
  let imagesList: string[] = [];
  if (product.primaryImage) imagesList.push(product.primaryImage);
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed)) {
      for (const img of parsed) {
        if (img && !imagesList.includes(img)) imagesList.push(img);
      }
    }
  } catch (e) {}
  if (imagesList.length === 0) imagesList = [product.primaryImage || ''];

  const storeSettings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
  const phone = storeSettings?.phone || '+918698909955';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container-custom pt-32 pb-16">
        <div className="text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#B8860B]">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/collections/${product.category.slug}`} className="hover:text-[#B8860B]">{product.category.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images Section */}
          <ProductGallery 
            images={imagesList} 
            productName={product.name} 
            badges={
              <>
                {product.isTopTrending && <span className="bg-[#B8860B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Trending</span>}
                {product.isNewArrival && <span className="bg-white text-[#B8860B] border border-[#B8860B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">New</span>}
              </>
            }
          />

          {/* Product Info Section */}
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-sm text-[#B8860B] font-semibold tracking-wider mb-6">SKU: {product.sku}</p>
            
            {product.price ? (
              <p className="text-3xl font-bold text-gray-900 mb-8">₹ {product.price.toLocaleString('en-IN')}</p>
            ) : (
              <p className="text-lg text-gray-500 italic mb-8 border-b border-gray-100 pb-8">Price available on request</p>
            )}

            <div className="space-y-6 mb-10">
              <h3 className="font-heading font-bold text-xl text-gray-900 border-b border-gray-100 pb-2">Product Details</h3>
              
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-gray-500">Metal Type</div>
                <div className="font-medium text-gray-900">{metalTypeLabels[product.metalType] || product.metalType}</div>
                
                {product.purity && (
                  <>
                    <div className="text-gray-500">Purity</div>
                    <div className="font-medium text-gray-900">{product.purity}</div>
                  </>
                )}
                
                {product.weight && (
                  <>
                    <div className="text-gray-500">Gross Weight</div>
                    <div className="font-medium text-gray-900">{product.weight.toFixed(3)} Grams</div>
                  </>
                )}

                {product.availabilityStatus && (
                  <>
                    <div className="text-gray-500">Availability</div>
                    <div className="font-medium text-gray-900">{product.availabilityStatus}</div>
                  </>
                )}
                
                <div className="text-gray-500">Category</div>
                <div className="font-medium text-gray-900">
                  <Link href={`/collections/${product.category.slug}`} className="text-[#B8860B] hover:underline">
                    {product.category.name}
                  </Link>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="mb-10">
                <h3 className="font-heading font-bold text-xl text-gray-900 border-b border-gray-100 pb-2 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
              </div>
            )}

            <ProductActions product={{ id: product.id, name: product.name, sku: product.sku, price: product.price }} phone={phone} />

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-2 justify-center text-xs text-gray-500">
                {product.isHallmarked ? (
                  <><span className="text-[#c5a059]">✓</span> BIS Hallmarked Jewellery <span className="mx-2">|</span></>
                ) : null}
                <span className="text-[#c5a059]">✓</span> 100% Certified
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
