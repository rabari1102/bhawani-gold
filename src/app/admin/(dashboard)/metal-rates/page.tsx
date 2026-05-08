'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/admin/Toast';
import Pagination from '@/components/admin/Pagination';

export default function AdminMetalRatesPage() {
  const { showToast } = useToast();
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRates = async () => {
    setLoading(true);
    const res = await fetch(`/api/metal-rates?page=${page}&limit=${limit}`);
    const data = await res.json();
    setRates(data.rates || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, [page, limit]);

  const handleChange = (id: string, value: string) => {
    setRates(rates.map(r => r.id === id ? { ...r, ratePerGram: value } : r));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/metal-rates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rates })
      });
      if (response.ok) {
        await fetchRates();
        showToast('Rates updated successfully!', 'success');
      } else {
        showToast('Failed to update rates', 'error');
      }
    } catch {
      showToast('An error occurred', 'error');
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Metal Rates Management</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
        <p className="text-sm text-gray-500 mb-6">Update the daily metal rates. These are displayed directly on the homepage widget.</p>
        
        {loading ? <p>Loading...</p> : (
          <div className="space-y-6">
            {rates.map(rate => (
              <div key={rate.id} className="flex items-center gap-6 p-4 border rounded-lg bg-gray-50">
                <div className="w-32">
                  <h3 className="font-bold text-lg">{rate.type} Gold</h3>
                  <p className="text-xs text-gray-500">Purity: {rate.purity}</p>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Rate per gram (₹)</label>
                  <input 
                    type="number" 
                    value={rate.ratePerGram} 
                    onChange={e => handleChange(rate.id, e.target.value)}
                    className="w-full border p-2 rounded font-bold text-[#B8860B]" 
                  />
                </div>
                <div className="text-xs text-gray-400 w-32 text-right">
                  Last updated:<br/>
                  {new Date(rate.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              <button onClick={handleSave} className="bg-[#B8860B] text-white px-6 py-3 rounded font-medium hover:bg-[#8B6508] transition-colors w-full">
                Save Metal Rates
              </button>
            </div>
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              limit={limit} 
              totalItems={total} 
              onPageChange={setPage} 
              onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
