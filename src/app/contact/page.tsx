import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import prisma from '@/lib/prisma';
import ContactForm from './ContactForm';

export default async function ContactPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });

  const address = settings?.address || 'Shop No 3, Opposite Hutatma Chowk, Mahim Road, Palghar West - 401404.';
  const phone = settings?.phone || '+91 86989 09955';
  const email = settings?.email || 'info@bhawanijewellers.com';
  const hours = settings?.openingHours || 'Monday - Sunday: 9:00 AM - 8:30 PM';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-[#1a1a2e] text-white">
        <div className="container-custom text-center">
          <span className="text-[#D4A843] font-semibold tracking-widest uppercase text-sm mb-4 block">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Contact Us</h1>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We are here to assist you with any inquiries regarding our collections, bespoke services, or any other questions.
          </p>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8">Visit Our Showroom</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#FFF8F0] rounded-full flex items-center justify-center text-[#B8860B] text-xl shrink-0">📍</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Store Address</h4>
                    <p className="text-gray-600 leading-relaxed">{address}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#FFF8F0] rounded-full flex items-center justify-center text-[#B8860B] text-xl shrink-0">📞</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">{phone}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#FFF8F0] rounded-full flex items-center justify-center text-[#B8860B] text-xl shrink-0">✉️</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">{email}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#FFF8F0] rounded-full flex items-center justify-center text-[#B8860B] text-xl shrink-0">🕐</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Store Hours</h4>
                    <p className="text-gray-600">{hours}</p>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="mt-10 h-64 bg-gray-100 rounded-xl w-full border border-gray-200 overflow-hidden">
                 <iframe
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3753.7!2d72.7633!3d19.6969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPalghar%2C+Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
                   width="100%"
                   height="100%"
                   style={{ border: 0 }}
                   allowFullScreen
                   loading="lazy"
                   referrerPolicy="no-referrer-when-downgrade"
                   title="Bhawani Jewellers - Palghar Location"
                 />
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
            
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
