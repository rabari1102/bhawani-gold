import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { displayOrder: 'asc' }
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-[#1a1a2e] text-white">
        <div className="container-custom text-center">
          <span className="text-[#D4A843] font-semibold tracking-widest uppercase text-sm mb-4 block">What We Offer</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Premium Services</h1>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Beyond our exquisite jewellery collection, we offer a range of specialized services to ensure your precious pieces remain beautiful for generations to come.
          </p>
        </div>
      </div>

      <div className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-[#FFF8F0] rounded-xl flex items-center justify-center text-[#B8860B] text-2xl mb-6 group-hover:scale-110 group-hover:bg-[#B8860B] group-hover:text-white transition-all">
                  ✦
                </div>
                <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">{service.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {service.detailedDescription || service.shortDescription}
                </p>
                <div className="h-0.5 w-12 bg-gray-100 group-hover:w-full group-hover:bg-[#B8860B] transition-all duration-300"></div>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-white rounded-2xl p-10 md:p-16 border border-gray-100 shadow-lg text-center max-w-4xl mx-auto relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFF8F0] rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFF8F0] rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>
             
             <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4 relative z-10">Need a Custom Service?</h3>
             <p className="text-gray-600 mb-8 max-w-xl mx-auto relative z-10">
               Have a specific requirement that isn't listed here? Contact our expert team, and we will do our best to accommodate your jewellery needs.
             </p>
             <Link href="/contact" className="btn-gold inline-block relative z-10">Get in Touch</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
