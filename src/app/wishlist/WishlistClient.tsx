'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/public/ProductCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WishlistClient() {
  const [products, setProducts] = useState<any[]>([]);
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
        
        // Fetch wishlist items
        const wl = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (wl.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/products?ids=${wl.join(',')}&limit=50`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, []);

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
        <p className="text-gray-500 mb-8 max-w-md">Please sign in or create an account to view and manage your Wishlist.</p>
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

  return (
    <main className="flex-1 container-custom pt-32 pb-24">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-heading font-bold text-gray-900">Your Wishlist</h1>
        <span className="text-gray-500 font-medium">{products.length} Items</span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4 text-gray-300">♡</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Discover our collections and add your favorite pieces.</p>
          <Link href="/collections" className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-medium inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
