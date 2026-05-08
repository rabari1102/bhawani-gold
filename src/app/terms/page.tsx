export const dynamic = 'force-dynamic';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-[#FFF8F0]">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-600">
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4 mt-8">1. Introduction</h3>
            <p className="mb-6">Welcome to Bhawani Jewellers. By accessing our website and utilizing our services, you agree to comply with and be bound by the following terms and conditions.</p>
            
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4 mt-8">2. Product Information</h3>
            <p className="mb-6">We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.</p>
            
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4 mt-8">3. Pricing</h3>
            <p className="mb-6">All prices are subject to change without notice. The price charged for a product will be the price in effect at the time the order is placed. Metal rates fluctuate daily and the final price will be calculated based on the metal rate at the time of final billing.</p>
            
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4 mt-8">4. Return & Exchange Policy</h3>
            <p className="mb-6">We accept returns and exchanges within 14 days of purchase, provided the jewellery is in its original condition, unworn, and accompanied by the original receipt and certification. Custom-made or altered pieces are non-refundable and non-exchangeable.</p>
            
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4 mt-8">5. Privacy</h3>
            <p className="mb-6">Your privacy is important to us. Any personal information you provide to us is subject to our Privacy Policy, which governs our collection and use of your information.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
