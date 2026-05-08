'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '💎' },
    { href: '/admin/categories', label: 'Categories', icon: '📁' },
    { href: '/admin/metal-rates', label: 'Metal Rates', icon: '📈' },
    { href: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
    { href: '/admin/services', label: 'Services', icon: '🛠️' },
    { href: '/admin/blog', label: 'Blog Posts', icon: '📝' },
    { href: '/admin/enquiries', label: 'Enquiries', icon: '✉️' },
    { href: '/admin/settings', label: 'Store Settings', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-[#1a1a2e] text-gray-300 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto admin-sidebar z-20">
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A843] to-[#B8860B] flex items-center justify-center text-white font-heading font-bold">B</div>
          <div>
            <span className="text-white font-bold tracking-wide block leading-tight">Admin Panel</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Bhawani Jewellers</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 py-6 px-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</p>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors ${
                  isActive ? 'bg-[#D4A843]/10 text-[#D4A843] font-medium active' : 'hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full text-left"
        >
          <span>🚪</span>
          Logout
        </button>
        <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-[#D4A843] hover:bg-gray-800 transition-colors w-full mt-2">
          <span>↗️</span>
          View Live Site
        </Link>
      </div>
    </aside>
  );
}
