import Link from 'next/link';
import prisma from '@/lib/prisma';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ProductCard from '@/components/public/ProductCard';

async function getHomePageData() {
  const [trendingProducts, newArrivals, specialSelection, categories, settings, testimonials] = await Promise.all([
    prisma.product.findMany({ where: { isVisible: true, isTopTrending: true }, include: { category: true }, take: 8 }),
    prisma.product.findMany({ where: { isVisible: true, isNewArrival: true }, include: { category: true }, take: 8 }),
    prisma.product.findMany({ where: { isVisible: true, isSpecialSelection: true }, include: { category: true }, take: 10 }),
    prisma.category.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.storeSettings.findFirst(),
    prisma.testimonial.findMany({ where: { isVisible: true }, orderBy: { displayOrder: 'asc' }, take: 6 })
  ]);

  // Fetch rates separately so a failure doesn't break the whole page
  let metalRates: { id: string; type: string; purity: string; ratePerGram: number; lastUpdated: Date }[] = [];
  try {
    metalRates = await prisma.metalRate.findMany({ orderBy: { type: 'desc' } });
  } catch {
    // Silently fail — the UI will show a fallback message
  }

  return { trendingProducts, newArrivals, specialSelection, categories, settings, metalRates, testimonials };
}

export default async function Home() {
  const { trendingProducts, newArrivals, specialSelection, categories, settings, metalRates, testimonials } = await getHomePageData();

  const heroTitle = settings?.heroHeading || 'Premium Gold Jewellery';
  const heroSubtitle = settings?.heroSubheading || 'Discover our exclusive collection of BIS Hallmarked Jewellery';
  const heroImage = settings?.heroImage || '/images/hero-banner.png';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Hero Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>
        <div className="container-custom relative z-10 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight max-w-4xl mx-auto" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4)' }}>
            {heroTitle}
          </h1>
          <p className="text-white/95 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
            {heroSubtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/collections" className="btn-primary">
              Shop Collection
            </Link>
            <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-black">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Live Rates Banner */}
      <div className="bg-[#fafafa] border-b border-gray-100 py-6 text-sm text-gray-800">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-bold tracking-widest uppercase text-black">Retail Metal Rate</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 font-medium">
            {metalRates.length > 0 ? (
              metalRates.map(rate => (
                <div key={rate.id} className="flex flex-col items-center gap-1">
                  <span className="inline-block">
                    {rate.type} ({rate.purity}): <span className="text-[#c5a059] font-bold">₹{rate.ratePerGram.toLocaleString('en-IN')}/g</span>
                  </span>
                  <span className="text-[10px] text-gray-400">+3% GST applicable • Updated {new Date(rate.lastUpdated).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                </div>
              ))
            ) : (
              <span className="text-gray-500 italic">Rates currently unavailable. Please check back shortly.</span>
            )}
          </div>
          <div className="hidden md:block text-xs text-gray-400">
            * Rates are indicative.
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <section className="py-12 border-b border-gray-100 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-gray-100">
            <div className="text-center px-4">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-2">100% Certified</h4>
              <p className="text-xs text-gray-500">Authentic Jewellery</p>
            </div>
            <div className="text-center px-4">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-2">BIS Hallmarked</h4>
              <p className="text-xs text-gray-500">Guaranteed Purity</p>
            </div>
            <div className="text-center px-4">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-2">Easy Returns</h4>
              <p className="text-xs text-gray-500">14-Day Return Policy</p>
            </div>
            <div className="text-center px-4">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-2">Secure Payments</h4>
              <p className="text-xs text-gray-500">100% Safe Shopping</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Shop By Category</h2>
            <div className="w-16 h-1 bg-[#c5a059] mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {categories.slice(0, 6).map(category => (
              <Link key={category.id} href={`/collections/${category.slug}`} className="flex flex-col items-center group">
                <div className="w-full aspect-square rounded-full bg-gray-50 overflow-hidden mb-4 relative transition-transform duration-500 group-hover:scale-105">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#f9f9f9] text-gray-300 text-3xl">✦</div>
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-[#c5a059] transition-colors">{category.name}</span>
              </Link>
            ))}
          </div>
          {categories.length > 6 && (
            <div className="text-center mt-10">
              <Link href="/category" className="text-sm font-semibold text-black hover:text-[#c5a059] transition-colors border-b border-black pb-1 hover:border-[#c5a059]">View All Categories</Link>
            </div>
          )}
        </div>
      </section>

      {/* Trending Products */}
      <section className="section-padding bg-[#f9f9f9]">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">Top Trending Products</h2>
              <p className="text-gray-500 text-sm">Discover our most loved pieces</p>
            </div>
            <Link href="/collections?trending=true" className="text-sm font-semibold text-black hover:text-[#c5a059] transition-colors border-b border-black pb-1 hover:border-[#c5a059]">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {trendingProducts.map(product => (
              <ProductCard key={product.id} product={{...product, weight: product.weight || null, price: product.price || null, primaryImage: product.primaryImage || null}} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">New Arrivals</h2>
              <p className="text-gray-500 text-sm">Fresh designs handcrafted for you</p>
            </div>
            <Link href="/collections?newArrival=true" className="text-sm font-semibold text-black hover:text-[#c5a059] transition-colors border-b border-black pb-1 hover:border-[#c5a059]">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={{...product, weight: product.weight || null, price: product.price || null, primaryImage: product.primaryImage || null}} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Selection For You */}
      {specialSelection.length > 0 && (
        <section className="section-padding bg-[#fdf8f0]">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Special Selection For You</h2>
              <p className="text-gray-500 text-sm max-w-lg mx-auto">Handpicked pieces curated by our experts, just for you</p>
              <div className="w-16 h-1 bg-[#c5a059] mx-auto mt-4"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {specialSelection.map(product => (
                <ProductCard key={product.id} product={{...product, weight: product.weight || null, price: product.price || null, primaryImage: product.primaryImage || null}} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Testimonials</h2>
              <p className="text-gray-500 text-sm max-w-lg mx-auto">What our cherished customers say about us</p>
              <div className="w-16 h-1 bg-[#c5a059] mx-auto mt-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="bg-[#fafafa] rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex gap-1 text-[#c5a059] mb-4 text-sm">★★★★★</div>
                  <p className="text-gray-600 text-sm italic mb-8 leading-relaxed">
                    &quot;{testimonial.reviewText}&quot;
                  </p>
                  <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4A843] to-[#B8860B] text-white flex items-center justify-center font-heading font-bold text-xl shadow-inner">
                      {testimonial.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.customerName}</h4>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/testimonials" className="text-sm font-semibold text-black hover:text-[#c5a059] transition-colors border-b border-black pb-1 hover:border-[#c5a059]">View All Reviews</Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
