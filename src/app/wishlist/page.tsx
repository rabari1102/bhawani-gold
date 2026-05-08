export const dynamic = 'force-dynamic';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import WishlistClient from './WishlistClient';

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Navbar />
      <WishlistClient />
      <Footer />
    </div>
  );
}
