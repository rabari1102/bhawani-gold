import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-[#FFF8F0]">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Cancellation &amp; Refund Policy</h1>
          <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">1. Cancellation Policy</h3>
              <p>Orders can be cancelled within 24 hours of placement by contacting our customer support team. Once the order has been shipped, cancellation is not possible. Custom-made or personalized jewellery orders cannot be cancelled once production has begun.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">2. Return Policy</h3>
              <p>We accept returns within 14 days of delivery, provided the jewellery is in its original condition, unworn, with all tags and certification intact. The product must be returned in its original packaging along with the invoice.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">3. Exchange Policy</h3>
              <p>Exchanges are accepted within 14 days of purchase. The exchanged product must be of equal or greater value. Any price difference will need to be paid by the customer. Metal rates at the time of exchange will apply.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">4. Refund Process</h3>
              <p>Once we receive and inspect the returned item, we will process the refund within 7-10 business days. Refunds will be credited back to the original payment method. Making charges and GST on making charges are non-refundable.</p>
            </section>

            <section>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">5. Non-Returnable Items</h3>
              <p>Custom-made or personalized jewellery, items with engraving, and altered pieces are non-returnable and non-refundable. Gold coins and bars are also non-returnable due to fluctuating metal prices.</p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
