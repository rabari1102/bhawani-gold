'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartClient({ storePhone }: { storePhone: string }) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const authRes = await fetch('/api/user-auth/me');
        const authData = await authRes.json();
        
        if (!authData.user) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Fetch cart items — prices come from the server (DB), never from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        const ids = cart.map((item: any) => item.id).join(',');
        const res = await fetch(`/api/products?ids=${ids}&limit=50`);
        const data = await res.json();
        
        // Merge quantity from localStorage with server-authoritative product data
        const productsWithQuantity = (data.products || []).map((p: any) => {
          const cartItem = cart.find((item: any) => item.id === p.id);
          return { ...p, quantity: cartItem ? cartItem.quantity : 1 };
        });

        setCartItems(productsWithQuantity);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, []);

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    const cartStorage = JSON.parse(localStorage.getItem('cart') || '[]');
    localStorage.setItem('cart', JSON.stringify(cartStorage.filter((item: any) => item.id !== id)));
  };

  const buildWhatsAppMessage = () => {
    const lines = cartItems.map(item => {
      const priceStr = item.price ? `₹${item.price.toLocaleString('en-IN')}` : 'Price on request';
      return `• ${item.name} (${item.sku}) x${item.quantity} — ${priceStr}`;
    });
    return `Hi! I'd like to enquire about the following items:\n\n${lines.join('\n')}\n\nPlease share the final pricing and availability. Thank you!`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center pt-32 pb-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c5a059]"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="flex-1 container-custom pt-32 pb-24 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <span className="text-4xl text-[#c5a059]">🔒</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">Sign In Required</h1>
        <p className="text-gray-500 mb-8 max-w-md">Please sign in or create an account to view and manage your Shopping Bag.</p>
        <div className="flex gap-4">
          <Link href="/login" className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-medium">
            Sign In
          </Link>
          <Link href="/collections" className="bg-white border border-gray-200 text-black px-8 py-3 rounded hover:bg-gray-50 transition-colors font-medium">
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  // Separate priced items and "Price on Request" items
  const pricedItems = cartItems.filter(item => item.price && item.price > 0);
  const porItems = cartItems.filter(item => !item.price || item.price === 0);
  const subtotal = pricedItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

  const cleanPhone = storePhone.replace(/[^0-9]/g, '');
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(buildWhatsAppMessage())}`;

  return (
    <main className="flex-1 container-custom pt-32 pb-24">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-heading font-bold text-gray-900">Your Shopping Bag</h1>
        <span className="text-gray-500 font-medium">{cartItems.length} Items</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4 text-gray-300">🛍️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your bag is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your bag yet.</p>
          <Link href="/collections" className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-medium inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                  {item.primaryImage ? (
                    <img src={item.primaryImage} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">✦</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Link href={`/products/${item.slug}`} className="text-lg font-bold text-gray-900 hover:text-[#c5a059] transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 text-sm ml-4 shrink-0">
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">SKU: {item.sku}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-sm font-medium text-gray-600">Qty: {item.quantity}</div>
                    <div className="text-lg font-bold text-black">
                      {item.price ? `₹${item.price.toLocaleString('en-IN')}` : (
                        <span className="text-sm font-medium text-[#c5a059] bg-[#fdfaf5] px-3 py-1 rounded-full">Price on Request</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-32">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
              
              {pricedItems.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({pricedItems.length} items)</span>
                    <span className="font-medium text-black">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>
              )}

              {porItems.length > 0 && (
                <div className="bg-[#fdfaf5] border border-[#e8d5b7] rounded-lg p-4 mb-6 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">{porItems.length} item(s)</span> require a price quote. 
                    Please enquire via WhatsApp for the final price.
                  </p>
                </div>
              )}

              {pricedItems.length > 0 && (
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-100 pt-6 mb-6">
                  <span>Estimated Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2"
              >
                <span className="text-lg">💬</span> Enquire on WhatsApp
              </a>
              <p className="text-xs text-center text-gray-400 mt-4">Our team will confirm pricing, availability &amp; delivery options.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
