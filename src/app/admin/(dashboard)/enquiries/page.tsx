'use client';
import { useState, useEffect } from 'react';
import Pagination from '@/components/admin/Pagination';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [viewItem, setViewItem] = useState<any>(null);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEnquiries = async () => {
    setLoading(true);
    const res = await fetch(`/api/contact?page=${page}&limit=${limit}`);
    const data = await res.json();
    setEnquiries(data.enquiries || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, [page, limit]);

  const handleMarkRead = async (id: string) => {
    await fetch(`/api/contact/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead: true })
    });
    fetchEnquiries();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      fetchEnquiries();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Enquiries</h1>
          <p className="text-sm text-gray-500 mt-1">Total: {total} enquiries</p>
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="modal-overlay z-[55]" onClick={() => setViewItem(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Enquiry Details</h3>
              <div className="flex gap-3 items-center">
                {!viewItem.isRead && (
                  <button onClick={() => { handleMarkRead(viewItem.id); setViewItem(null); }} className="text-[#B8860B] hover:text-[#8B6508] text-lg" title="Mark Read">✓</button>
                )}
                <button onClick={() => { handleDelete(viewItem.id); setViewItem(null); }} className="text-red-500 hover:text-red-700 text-lg" title="Delete">🗑️</button>
                <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-900 text-xl ml-2">×</button>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong>Name:</strong> {viewItem.name}</p>
              <p><strong>Email:</strong> {viewItem.email}</p>
              <p><strong>Phone:</strong> {viewItem.phone || 'N/A'}</p>
              <p><strong>Interested In:</strong> {viewItem.interestedIn || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(viewItem.createdAt).toLocaleDateString()} {new Date(viewItem.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              <p><strong>Message:</strong></p>
              <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-700">
                {viewItem.message}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No enquiries found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${!enquiry.isRead ? 'bg-blue-50/30 border-l-4 border-l-[#B8860B]' : ''}`} onClick={() => setViewItem(enquiry)}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{enquiry.name}</h4>
                    {!enquiry.isRead && (
                      <span className="bg-[#B8860B] text-white text-xs px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{new Date(enquiry.createdAt).toLocaleDateString()} {new Date(enquiry.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
                
                <div className="flex gap-4 text-sm text-gray-500 mb-3">
                  <span>📧 {enquiry.email}</span>
                  {enquiry.phone && <span>📞 {enquiry.phone}</span>}
                </div>

                {enquiry.interestedIn && (
                  <span className="inline-block px-2 py-1 bg-[#FFF8F0] text-[#B8860B] text-xs font-medium rounded mb-3">
                    Interested in: {enquiry.interestedIn}
                  </span>
                )}
                
                <p className="text-sm text-gray-700 bg-gray-50 p-3 border border-gray-100 rounded mt-1">&quot;{enquiry.message}&quot;</p>

                <div className="flex gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setViewItem(enquiry)} className="text-blue-500 hover:text-blue-700 text-lg mr-2" title="View">👁️</button>
                  {!enquiry.isRead && (
                    <button onClick={() => handleMarkRead(enquiry.id)} className="text-[#B8860B] hover:text-[#8B6508] text-lg mr-2" title="Mark Read">
                      ✓
                    </button>
                  )}
                  <button onClick={() => handleDelete(enquiry.id)} className="text-red-500 hover:text-red-700 text-lg" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          limit={limit} 
          totalItems={total} 
          onPageChange={setPage} 
          onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }} 
        />
      </div>
    </div>
  );
}
