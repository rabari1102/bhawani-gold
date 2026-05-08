import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-[#FFF8F0]">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Shipping Policy</h1>
          <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">1. Delivery Areas</h3>
              <p>We currently deliver jewellery to select cities across India. Please contact us to confirm delivery availability in your area before placing an order.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">2. Shipping Charges</h3>
              <p>Shipping charges may vary depending on the order value, weight, and delivery location. For high-value orders, we offer complimentary insured shipping. Details will be confirmed during the order process.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">3. Delivery Timeline</h3>
              <p>Standard delivery takes 5-7 business days after order confirmation. Custom-made or personalized jewellery may take 15-20 business days. You will receive tracking information via SMS and email once your order is shipped.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">4. Insurance</h3>
              <p>All shipments are fully insured against loss, theft, and damage during transit. In the unlikely event of any issue during delivery, please contact us immediately.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">5. Store Pickup</h3>
              <p>You can also choose to pick up your order from our showroom in Palghar. We will notify you when your order is ready for collection.</p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
