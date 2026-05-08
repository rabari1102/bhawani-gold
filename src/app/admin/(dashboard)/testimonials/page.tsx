'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/admin/Toast';
import Pagination from '@/components/admin/Pagination';

export default function AdminTestimonialsPage() {
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any>(null);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState<any>({
    customerName: '', location: '', reviewText: '', displayOrder: 0, isVisible: true
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    const res = await fetch(`/api/testimonials?page=${page}&limit=${limit}`);
    const data = await res.json();
    setTestimonials(data.testimonials || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, [page, limit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = formData.id ? `/api/testimonials/${formData.id}` : '/api/testimonials';
    const method = formData.id ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, displayOrder: parseInt(formData.displayOrder) })
    });
    
    if (res.ok) {
      showToast(formData.id ? 'Testimonial updated successfully' : 'Testimonial created successfully', 'success');
      setIsEditing(false);
      setFormData({ customerName: '', location: '', reviewText: '', displayOrder: 0, isVisible: true });
      fetchTestimonials();
    } else {
      const errData = await res.json();
      showToast(errData.error || 'Failed to save testimonial', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/testimonials/${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Testimonial deleted successfully', 'success');
    } else {
      showToast('Failed to delete testimonial', 'error');
    }
    setDeleteId(null);
    fetchTestimonials();
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsEditing(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
        <button onClick={() => { setFormData({ customerName: '', location: '', reviewText: '', displayOrder: 0, isVisible: true }); setIsEditing(true); }} className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors shadow-sm">
          + Add Testimonial
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this testimonial? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content max-w-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-900 text-2xl leading-none">×</button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                    <input required type="text" value={formData.customerName || ''} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all" placeholder="e.g. Priya M." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input required type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all" placeholder="e.g. Palghar" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Text *</label>
                    <textarea required value={formData.reviewText || ''} onChange={e => setFormData({...formData, reviewText: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all" rows={4} placeholder="Customer review..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input type="number" value={formData.displayOrder || 0} onChange={e => setFormData({...formData, displayOrder: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                    <input type="checkbox" checked={formData.isVisible ?? true} onChange={e => setFormData({...formData, isVisible: e.target.checked})} className="rounded text-black focus:ring-black" />
                    Visible on website
                  </label>
                </div>
                <div className="pt-5 flex justify-end gap-3 border-t border-gray-100 mt-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium">Cancel</button>
                  <button type="submit" className="bg-black text-white px-8 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium shadow-sm">Save Testimonial</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="modal-overlay z-[55]" onClick={() => setViewItem(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Testimonial Details</h3>
              <div className="flex gap-3 items-center">
                <button onClick={() => { handleEdit(viewItem); setViewItem(null); }} className="text-gray-500 hover:text-gray-700 text-lg" title="Edit">✏️</button>
                <button onClick={() => { setDeleteId(viewItem.id); setViewItem(null); }} className="text-red-500 hover:text-red-700 text-lg" title="Delete">🗑️</button>
                <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-900 text-xl ml-2">×</button>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong>Customer Name:</strong> {viewItem.customerName}</p>
              <p><strong>Location:</strong> {viewItem.location}</p>
              <p><strong>Display Order:</strong> {viewItem.displayOrder}</p>
              <p><strong>Visible:</strong> {viewItem.isVisible ? 'Yes' : 'No'}</p>
              <p><strong>Review:</strong> {viewItem.reviewText}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Order</th>
                <th className="p-4 font-semibold text-gray-600">Customer</th>
                <th className="p-4 font-semibold text-gray-600">Location</th>
                <th className="p-4 font-semibold text-gray-600">Review</th>
                <th className="p-4 font-semibold text-gray-600">Visible</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading testimonials...</td></tr>
              ) : testimonials.map(t => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setViewItem(t)}>
                  <td className="p-4 text-gray-700">{t.displayOrder}</td>
                  <td className="p-4 font-medium text-gray-900">{t.customerName}</td>
                  <td className="p-4 text-gray-600">{t.location}</td>
                  <td className="p-4 max-w-xs truncate text-gray-500">{t.reviewText}</td>
                  <td className="p-4">
                    <span className={`w-2.5 h-2.5 rounded-full inline-block shadow-sm ${t.isVisible ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  </td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setViewItem(t)} className="text-blue-500 hover:text-blue-700 mr-3 text-lg" title="View">👁️</button>
                    <button onClick={() => handleEdit(t)} className="text-gray-500 hover:text-gray-700 mr-3 text-lg" title="Edit">✏️</button>
                    <button onClick={() => setDeleteId(t.id)} className="text-red-500 hover:text-red-700 text-lg" title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
