export const dynamic = 'force-dynamic';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import CartClient from './CartClient';
import prisma from '@/lib/prisma';

export default async function CartPage() {
  const settings = await prisma.storeSettings.findFirst();
  const storePhone = settings?.phone || '+91 86989 09955';

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Navbar />
      <CartClient storePhone={storePhone} />
      <Footer />
    </div>
  );
}
