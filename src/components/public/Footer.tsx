import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function Footer() {
  const settings = await prisma.storeSettings.findFirst();

  const storeName = settings?.storeName || 'Bhawani Jewellers';
  const address = settings?.address || "Shop No 3, Opposite Hutatma Chowk, Mahim Road, Palghar West - 401404.";
  const phone = settings?.phone || "+91 86989 09955";
  const email = settings?.email || "info@bhawanijewellers.com";
  const facebook = settings?.socialFacebook || "";
  const instagram = settings?.socialInstagram || "";
  const youtube = settings?.socialYoutube || "";
  const footerText = settings?.footerText || "Palghar's trusted destination for premium handcrafted gold, platinum, and diamond jewellery.";

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container-custom py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-heading font-bold text-black mb-6 tracking-tight">{storeName}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-sm">
              {footerText}
            </p>
            <div className="flex gap-4 mb-8">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-sm text-black hover:bg-black hover:text-white transition-colors">FB</a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-sm text-black hover:bg-black hover:text-white transition-colors">IG</a>
              )}
              {youtube && (
                <a href={youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-sm text-black hover:bg-black hover:text-white transition-colors">YT</a>
              )}
            </div>
            
            <h4 className="text-xs font-bold text-black uppercase tracking-widest mb-4">Download Our App</h4>
            <div className="flex gap-3">
              <a href="#" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341c-.027-2.613 2.133-3.878 2.228-3.935-1.21-1.77-3.092-2.01-3.763-2.046-1.597-.16-3.118.943-3.934.943-.815 0-2.062-.924-3.376-.898-1.705.027-3.277.994-4.156 2.527-1.782 3.091-.456 7.671 1.285 10.187.854 1.226 1.868 2.6 3.167 2.548 1.25-.054 1.73-.815 3.245-.815 1.516 0 1.956.815 3.264.789 1.334-.027 2.213-1.25 3.061-2.468.983-1.433 1.388-2.822 1.411-2.894-.03-.013-2.705-1.04-2.732-3.938zM14.938 6.132c.683-.827 1.144-1.977 1.018-3.132-.998.04-2.203.664-2.91 1.492-.562.656-1.114 1.834-.962 2.964 1.116.086 2.17-.597 2.854-1.324z"/></svg>
                App Store
              </a>
              <a href="#" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a1.986 1.986 0 01-.585-1.418V3.232c0-.528.21-.103.584-1.418zM14.73 12.94l3.113 3.113-12.784 7.382 9.671-10.495zM4.032 1.378l12.783 7.382L13.7 11.87 4.032 1.378zM18.898 10.534l-1.096-.632-3.116 3.116 3.116 3.116 1.096-.633c.895-.516.895-1.35 0-1.867v-3.1z"/></svg>
                Google Play
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-black uppercase tracking-widest mb-6">Explore</h4>
            <div className="flex flex-col gap-4">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/collections', label: 'All Products' },
                { href: '/category', label: 'Categories' },
                { href: '/services', label: 'Services' },
                { href: '/testimonials', label: 'Testimonials' },
                { href: '/blog', label: 'Journal' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-sm text-gray-500 hover:text-black transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Customer Area */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-black uppercase tracking-widest mb-6">Assistance</h4>
            <div className="flex flex-col gap-4">
              {[
                { href: '/contact', label: 'Contact Us' },
                { href: '/login', label: 'My Account' },
                { href: '/wishlist', label: 'Wishlist' },
                { href: '/cart', label: 'Shopping Cart' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/shipping', label: 'Shipping Policy' },
                { href: '/refund', label: 'Cancellation & Refund' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-sm text-gray-500 hover:text-black transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-black uppercase tracking-widest mb-6">Visit Us</h4>
            <div className="flex flex-col gap-4 text-sm text-gray-500">
              <p className="leading-relaxed">
                {address}
              </p>
              <p className="pt-2">
                <a href={`tel:${phone}`} className="hover:text-black text-black font-medium">{phone}</a>
              </p>
              <p>
                <a href={`mailto:${email}`} className="hover:text-black">{email}</a>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <div className="flex gap-4">
             <Link href="/privacy" className="text-xs text-gray-400 hover:text-black transition-colors">Privacy</Link>
             <Link href="/terms" className="text-xs text-gray-400 hover:text-black transition-colors">Terms</Link>
             <Link href="/shipping" className="text-xs text-gray-400 hover:text-black transition-colors">Shipping</Link>
             <Link href="/refund" className="text-xs text-gray-400 hover:text-black transition-colors">Refund</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
