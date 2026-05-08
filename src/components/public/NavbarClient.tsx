'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface StoreSettings {
  storeName: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function NavbarClient({ categories, settings, user }: { categories: Category[], settings: StoreSettings | null, user?: User | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        setSearchResults(data.products || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    await fetch('/api/user-auth/logout', { method: 'POST' });
    setUserDropdownOpen(false);
    router.refresh();
  };

  const storeName = settings?.storeName || 'Bhawani Jewellers';

  return (
    <>
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm py-2' : 'bg-[#fafafa] border-b border-gray-100 py-3'}`}>
        <div className="px-4 md:px-8 w-full flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden text-2xl text-black mr-4">
            {mobileOpen ? '✕' : '☰'}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded bg-black flex items-center justify-center text-white font-heading text-xl font-bold">
              {storeName.charAt(0)}
            </div>
            <span className="text-xl font-heading font-bold text-black tracking-tight leading-tight hidden sm:block">
              Bhawani<br />Jewellers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex flex-1 items-center justify-center gap-7 text-[14px] font-medium text-gray-800 px-4 whitespace-nowrap overflow-x-auto no-scrollbar relative">
            <Link href="/collections" className="hover:text-[#c5a059] transition-colors shrink-0">All Products</Link>
            
            <div className="group relative py-4 cursor-pointer">
              <Link href="/category" className="hover:text-[#c5a059] transition-colors shrink-0 flex items-center gap-1">
                Categories
                <svg className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-xl border border-gray-100 rounded-b-md p-6 w-max max-w-[90vw] grid grid-cols-4 gap-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {categories.map(cat => (
                  <div key={cat.id} className="min-w-[150px]">
                    <Link href={`/collections/${cat.slug}`} className="block font-bold text-black border-b border-gray-100 pb-2 mb-3 hover:text-[#c5a059] transition-colors">
                      {cat.name}
                    </Link>
                    <div className="flex flex-col gap-2">
                      {(cat.children || []).map(child => (
                        <Link key={child.id} href={`/collections/${child.slug}`} className="text-gray-600 hover:text-[#c5a059] text-sm transition-colors block">
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/collections?newArrival=true" className="hover:text-[#c5a059] transition-colors shrink-0">New Arrivals</Link>
            <Link href="/about" className="hover:text-[#c5a059] transition-colors shrink-0">About</Link>
            <Link href="/contact" className="hover:text-[#c5a059] transition-colors shrink-0">Contact</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-5 text-gray-800 shrink-0 ml-auto xl:ml-0">
            {/* Search Icon */}
            <button onClick={() => setSearchOpen(true)} className="hover:text-black transition-colors" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>

            <div className="hidden xl:block h-8 w-px bg-gray-200"></div>
            
            {/* User Account */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)} 
                  className="flex items-center gap-2 hover:text-[#c5a059] transition-colors text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  <span className="hidden xl:inline">Hi, {user.name.split(' ')[0]}</span>
                  <svg className={`w-3 h-3 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                
                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white shadow-xl border border-gray-100 rounded-lg py-2 w-48 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/wishlist" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#c5a059] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                      Wishlist
                    </Link>
                    <Link href="/cart" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#c5a059] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                      My Cart
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors w-full text-left">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hover:text-[#c5a059] transition-colors hidden xl:flex items-center gap-2 text-sm font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Sign In
              </Link>
            )}

            <Link href="/wishlist" className="hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </Link>
            <Link href="/cart" className="hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div className={`lg:hidden fixed inset-0 top-[60px] bg-white z-40 transition-transform duration-300 overflow-y-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex flex-col gap-6 text-lg font-medium">
            {user ? (
              <div className="pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500">Hi, {user.name}</span>
                  <button onClick={handleLogout} className="text-sm text-black">Logout</button>
                </div>
                <div className="flex gap-3">
                  <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded">Wishlist</Link>
                  <Link href="/cart" onClick={() => setMobileOpen(false)} className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded">Cart</Link>
                </div>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="pb-4 border-b border-gray-100 block">Sign In / Register</Link>
            )}
            <Link href="/collections" onClick={() => setMobileOpen(false)} className="block">All Products</Link>
            <Link href="/collections?newArrival=true" onClick={() => setMobileOpen(false)} className="block text-[#c5a059]">New Arrivals</Link>
            <div className="flex flex-col gap-2 pl-2 border-l border-gray-200 ml-2">
              {categories.map(cat => (
                <div key={cat.id} className="mb-2">
                  <Link href={`/collections/${cat.slug}`} onClick={() => setMobileOpen(false)} className="block font-semibold text-gray-800">
                    {cat.name}
                  </Link>
                  <div className="flex flex-col gap-2 pl-4 mt-2">
                    {(cat.children || []).map(child => (
                      <Link key={child.id} href={`/collections/${child.slug}`} onClick={() => setMobileOpen(false)} className="block text-gray-500 text-sm">
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/category" onClick={() => setMobileOpen(false)} className="block pt-4 border-t border-gray-100">Browse Categories</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block">About Us</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block">Contact Support</Link>
          </div>
        </div>
      </header>

      {/* Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            {/* Search Input */}
            <div className="flex items-center gap-3 p-5 border-b border-gray-100">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery by name, SKU..."
                className="flex-1 text-lg outline-none placeholder:text-gray-400"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }} className="text-gray-400 hover:text-black text-sm font-medium">
                ESC
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searching && (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c5a059] mx-auto mb-3"></div>
                  Searching...
                </div>
              )}

              {!searching && searchQuery.trim() && searchResults.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-3">✧</div>
                  <p>No products found for &quot;{searchQuery}&quot;</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="divide-y divide-gray-50">
                  {searchResults.map((product: any) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {product.primaryImage ? (
                          <img src={product.primaryImage} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">✦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h4>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <div className="text-sm font-bold text-[#c5a059] shrink-0">
                        {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on request'}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!searchQuery.trim() && (
                <div className="p-8 text-center text-gray-400 text-sm">
                  Start typing to search products...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
