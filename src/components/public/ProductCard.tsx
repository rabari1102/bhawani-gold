'use client';
import { useState } from 'react';
import Link from 'next/link';
import AuthGuardModal from './AuthGuardModal';

interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  weight: number | null;
  price: number | null;
  primaryImage: string | null;
  metalType: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [wishlisted, setWishlisted] = useState(() => {
    if (typeof window !== 'undefined') {
      const wl = JSON.parse(localStorage.getItem('wishlist') || '[]');
      return wl.includes(product.id);
    }
    return false;
  });

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/user-auth/me');
      const data = await res.json();
      
      if (!data.user) {
        setShowAuthModal(true);
        setIsProcessing(false);
        return;
      }

      // Proceed with wishlist logic
      const wl = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (wishlisted) {
        localStorage.setItem('wishlist', JSON.stringify(wl.filter((id: string) => id !== product.id)));
      } else {
        wl.push(product.id);
        localStorage.setItem('wishlist', JSON.stringify(wl));
      }
      setWishlisted(!wishlisted);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <AuthGuardModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        title="Sign In to Wishlist" 
        message="Save your favorite pieces by creating an account or signing in."
      />
      <Link href={`/products/${product.slug}`} className="block group relative">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-sm mb-4">
          {product.primaryImage ? (
            <img src={product.primaryImage} alt={product.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl opacity-50">✦</div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            disabled={isProcessing}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-all z-10 ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
            aria-label="Add to wishlist"
          >
            <span className={`text-lg leading-none mt-0.5 ${wishlisted ? 'text-[#c5a059]' : 'text-gray-400'}`}>
              {wishlisted ? '♥' : '♡'}
            </span>
          </button>

          {/* Hover Contact Us Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
             <div className="bg-black/90 backdrop-blur text-white text-xs font-medium tracking-widest uppercase py-3 text-center rounded-sm w-full shadow-lg flex items-center justify-center gap-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
               Contact Us
             </div>
          </div>
        </div>
      
      <div className="text-center px-2">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1 group-hover:text-[#c5a059] transition-colors">{product.name}</h3>
        <p className="text-[11px] font-semibold text-gray-400 mb-2 tracking-wider uppercase">SKU: {product.sku}</p>
        
        <div className="flex items-center justify-center gap-2 mt-1">
          {product.weight && (
            <span className="text-sm font-bold text-gray-800 bg-gray-50 px-2 py-0.5 rounded">{product.weight}g</span>
          )}
          {product.price ? (
            <span className="text-sm font-bold text-[#c5a059]">₹{product.price.toLocaleString('en-IN')}</span>
          ) : (
            <span className="text-xs text-gray-500 font-medium py-1">Price on request</span>
          )}
        </div>
      </div>
    </Link>
    </>
  );
}
