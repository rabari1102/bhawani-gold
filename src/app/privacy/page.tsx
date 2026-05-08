import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-[#FFF8F0]">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">1. Information We Collect</h3>
              <p>We collect personal information that you voluntarily provide to us when you register on the website, place an order, subscribe to a newsletter, or contact us. This information may include your name, email address, phone number, mailing address, and payment information.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">2. How We Use Your Information</h3>
              <p>We use the information we collect to process transactions, send periodic emails regarding your order or other products and services, improve our website, and provide customer support. Your information will not be sold, exchanged, transferred, or given to any third party without your consent.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">3. Data Security</h3>
              <p>We implement a variety of security measures to maintain the safety of your personal information. All sensitive information is transmitted via Secure Socket Layer (SSL) technology and encrypted into our database only to be accessed by authorized persons.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">4. Cookies</h3>
              <p>We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">5. Third-Party Disclosure</h3>
              <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">6. Contact Us</h3>
              <p>If you have any questions regarding this privacy policy, you may contact us at our showroom or via our contact page.</p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
