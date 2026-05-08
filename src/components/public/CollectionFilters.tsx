'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: { id: string; name: string; slug: string }[];
}

export default function CollectionFilters({
  categories,
  currentCategorySlug
}: {
  categories: Category[];
  currentCategorySlug?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedWeight, setSelectedWeight] = useState(searchParams.get('weight') || '');
  
  const weightRanges = [
    { label: '0g - 5g', value: '0-5' },
    { label: '5g - 10g', value: '5-10' },
    { label: '10g - 20g', value: '10-20' },
    { label: '20g - 50g', value: '20-50' },
    { label: '50g+', value: '50-plus' }
  ];

  const handleWeightChange = (value: string) => {
    const newVal = selectedWeight === value ? '' : value;
    setSelectedWeight(newVal);
    
    const params = new URLSearchParams(searchParams.toString());
    if (newVal) {
      params.set('weight', newVal);
    } else {
      params.delete('weight');
    }
    
    // Push the new URL without refreshing
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
      {/* Category Tree */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">Categories</h3>
        <ul className="space-y-3">
          <li>
            <Link 
              href="/collections" 
              className={`text-sm ${!currentCategorySlug ? 'font-bold text-black' : 'text-gray-500 hover:text-black transition-colors'}`}
            >
              All Products
            </Link>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <Link 
                href={`/collections/${cat.slug}`} 
                className={`text-sm ${currentCategorySlug === cat.slug ? 'font-bold text-black' : 'text-gray-500 hover:text-black transition-colors'}`}
              >
                {cat.name}
              </Link>
              {cat.children && cat.children.length > 0 && (
                <ul className="pl-4 mt-2 space-y-2 border-l border-gray-100 ml-2">
                  {cat.children.map(child => (
                    <li key={child.id}>
                      <Link 
                        href={`/collections/${child.slug}`} 
                        className={`text-sm ${currentCategorySlug === child.slug ? 'font-bold text-[#c5a059]' : 'text-gray-400 hover:text-[#c5a059] transition-colors'}`}
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Weight Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">Weight Range</h3>
        <div className="space-y-3">
          {weightRanges.map(range => (
            <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedWeight === range.value ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                {selectedWeight === range.value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
              </div>
              <span className={`text-sm ${selectedWeight === range.value ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black transition-colors'}`}>
                {range.label}
              </span>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={selectedWeight === range.value}
                onChange={() => handleWeightChange(range.value)}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
