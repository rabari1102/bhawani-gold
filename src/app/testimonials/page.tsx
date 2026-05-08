export const dynamic = 'force-dynamic';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import prisma from '@/lib/prisma';

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isVisible: true },
    orderBy: { displayOrder: 'asc' }
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-[#FFF8F0]">
        <div className="container-custom text-center">
          <span className="text-[#B8860B] font-semibold tracking-widest uppercase text-sm mb-4 block">Reviews</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">Client Testimonials</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Read what our cherished customers have to say about their experiences with Bhawani Jewellers.
          </p>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="flex gap-1 text-[#B8860B] mb-4 text-sm">
                  ★★★★★
                </div>
                <p className="text-gray-600 text-sm italic mb-8 relative z-10 leading-relaxed">
                  "{testimonial.reviewText}"
                </p>
                <div className="flex items-center gap-4 mt-auto border-t border-gray-50 pt-4">
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
