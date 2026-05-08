'use client';
import { useState, useEffect } from 'react';
import AuthGuardModal from './AuthGuardModal';

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    sku: string;
    price: number | null;
  };
  phone: string;
}

export default function ProductActions({ product, phone }: ProductActionsProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState('');
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const wl = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlisted(wl.includes(product.id));
  }, [product.id]);

  const handleWishlist = async () => {
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

  const getWaLink = () => {
    let msg = `Hi Bhawani Jewellers! I'm interested in the product: ${product.name} (SKU: ${product.sku}).`;
    if (notes) {
      msg += `\n\nCustomisation Request: ${notes}`;
    }
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      <AuthGuardModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        title="Sign In to Wishlist"
        message="Please sign in or create an account to save your favorite pieces."
      />
      
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <label htmlFor="customise" className="block text-sm font-medium text-gray-700 mb-2">Customise your product (Optional)</label>
          <textarea 
            id="customise"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., I want this in size 12, or I want it in Rose Gold."
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-black outline-none transition-all text-sm"
            rows={2}
          ></textarea>
        </div>

        <div className="flex gap-4">
          <a 
            href={getWaLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366] text-white py-4 rounded font-medium hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="text-xl leading-none">💬</span> Enquire on WhatsApp
          </a>
          <button 
            onClick={handleWishlist}
            disabled={isProcessing}
            className={`w-14 flex flex-shrink-0 items-center justify-center border rounded transition-colors disabled:opacity-70 ${wishlisted ? 'border-[#c5a059] bg-[#fdfaf5]' : 'border-gray-200 hover:bg-gray-50'}`}
            aria-label="Wishlist"
          >
            <span className={`text-2xl ${wishlisted ? 'text-[#c5a059]' : 'text-gray-400'}`}>{wishlisted ? '♥' : '♡'}</span>
          </button>
        </div>
      </div>
    </>
  );
}
