export const dynamic = 'force-dynamic';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AboutPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });

  const storeName = settings?.storeName || 'Bhawani Jewellers';
  const heading = settings?.aboutHeading || 'Crafting Legacy, One Ornament at a Time';
  const subheading = settings?.aboutSubheading || 'Our Story';
  const aboutImage = settings?.aboutImage || '/images/about-showroom.png';
  
  // Split content into paragraphs
  const contentText = settings?.aboutContent || 'Founded with a vision to bring unparalleled purity and exquisite designs to the heart of Palghar, Bhawani Jewellers has established itself as a trusted name for families across generations.\n\nEvery piece in our showroom undergoes rigorous quality checks. We deal exclusively in BIS Hallmarked gold, ensuring that your investment is secure and authentic. Our master artisans, carrying forward centuries-old techniques, breathe life into gold, platinum, and precious stones.\n\nWhether you are looking for an elaborate bridal trousseau, a minimalist daily wear piece, or a bespoke custom design, our experts are dedicated to helping you find the perfect adornment that matches your personality and budget.';
  const paragraphs = contentText.split('\n\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero */}
      <div className="pt-32 pb-16 bg-[#FFF8F0] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[#B8860B] opacity-5 rounded-l-full transform translate-x-1/3"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="text-[#B8860B] font-semibold tracking-widest uppercase text-sm mb-4 block">{subheading}</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight">{heading}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to {storeName}, Palghar&apos;s premier destination for fine jewellery. We blend traditional Indian craftsmanship with contemporary design to create pieces that tell your unique story.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden border-8 border-white shadow-2xl relative z-10">
                <img src={aboutImage} alt={`${storeName} showroom`} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#FFF8F0] rounded-full z-0"></div>
              <div className="absolute -top-8 -left-8 w-32 h-32 border-2 border-[#B8860B] rounded-full z-0 opacity-20"></div>
            </div>
            
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">A Heritage of Trust</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6 mt-10 border-t border-gray-100 pt-10">
                <div>
                  <h4 className="font-heading font-bold text-2xl text-[#B8860B] mb-2">100%</h4>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">BIS Hallmarked</p>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-2xl text-[#B8860B] mb-2">Purity</h4>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Guaranteed</p>
                </div>
              </div>
              
              <div className="mt-10">
                <Link href="/collections" className="btn-gold inline-block">Explore Our Collections</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
