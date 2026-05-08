import Sidebar from '@/components/admin/Sidebar';
import { ToastProvider } from '@/components/admin/Toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm h-16 flex items-center px-8 border-b border-gray-200 z-10 sticky top-0">
            <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
          </header>
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
