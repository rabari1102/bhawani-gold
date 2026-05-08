'use client';
import { useState } from 'react';

export default function ProductGallery({ images, productName, badges }: { images: string[], productName: string, badges?: React.ReactNode }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-[#FFF8F0] border border-gray-100 rounded-xl overflow-hidden relative">
        {activeImage ? (
          <img src={activeImage} alt={productName} className="w-full h-full object-cover transition-opacity duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#B8860B] text-8xl font-heading opacity-50">✦</div>
        )}
        
        {/* Badges */}
        {badges && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {badges}
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x">
          {images.map((img, i) => (
            <div 
              key={i} 
              onClick={() => setActiveImage(img)}
              className={`flex-shrink-0 w-20 h-20 bg-[#FFF8F0] border rounded-lg cursor-pointer transition-colors overflow-hidden snap-start ${activeImage === img ? 'border-[#B8860B] ring-1 ring-[#B8860B]' : 'border-gray-200 hover:border-[#c5a059]'}`}
            >
              {img ? (
                <img src={img} alt={`${productName} view ${i + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full img-placeholder"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
