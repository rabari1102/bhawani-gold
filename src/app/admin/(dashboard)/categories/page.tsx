'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/admin/Toast';
import Pagination from '@/components/admin/Pagination';

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any>(null);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState<any>({
    name: '', slug: '', description: '', image: '', displayOrder: 0, parentId: ''
  });

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch(`/api/categories?page=${page}&limit=${limit}`);
    const data = await res.json();
    setCategories(data.categories || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    
    // Also fetch all categories for the parent dropdown
    const allRes = await fetch(`/api/categories?limit=1000`);
    const allData = await allRes.json();
    // Only allow selecting categories that don't have a parent (1 level deep) as per Pravesh Gold
    setParentCategories((allData.categories || []).filter((c: any) => !c.parentId));
    
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing && formData.id ? `/api/categories/${formData.id}` : '/api/categories';
    const method = isEditing && formData.id ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, displayOrder: parseInt(formData.displayOrder) })
    });
    
    if (res.ok) {
      showToast(formData.id ? 'Category updated successfully' : 'Category created successfully', 'success');
      setIsEditing(false);
      setFormData({ name: '', slug: '', description: '', image: '', displayOrder: 0, parentId: '' });
      fetchCategories();
    } else {
      const errData = await res.json();
      showToast(errData.error || 'Failed to save category', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/categories/${deleteId}`, { method: 'DELETE' });
    if (!res.ok) {
      showToast('Cannot delete category with existing products. Reassign them first.', 'error');
    } else {
      showToast('Category deleted successfully', 'success');
    }
    setDeleteId(null);
    fetchCategories();
  };

  const handleEdit = (cat: any) => {
    setFormData({ ...cat, parentId: cat.parentId || '' });
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setFormData({ ...formData, image: data.url });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button onClick={() => { setFormData({ name: '', slug: '', description: '', image: '', displayOrder: 0, parentId: '' }); setIsEditing(true); }} className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors shadow-sm">
          + Add Category
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this category? This might fail if products are linked to it.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="modal-overlay z-[55]" onClick={() => setViewItem(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Category Details</h3>
              <div className="flex gap-3 items-center">
                <button onClick={() => { handleEdit(viewItem); setViewItem(null); }} className="text-gray-500 hover:text-gray-700 text-lg" title="Edit">✏️</button>
                <button onClick={() => { setDeleteId(viewItem.id); setViewItem(null); }} className="text-red-500 hover:text-red-700 text-lg" title="Delete">🗑️</button>
                <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-900 text-xl ml-2">×</button>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong>Name:</strong> {viewItem.name}</p>
              <p><strong>Slug:</strong> {viewItem.slug}</p>
              {viewItem.parent && <p><strong>Parent Category:</strong> {viewItem.parent.name}</p>}
              <p><strong>Display Order:</strong> {viewItem.displayOrder}</p>
              <p><strong>Products Count:</strong> {viewItem._count?.products || 0}</p>
              <p><strong>Description:</strong> {viewItem.description}</p>
              {viewItem.image && (
                <div className="mt-4">
                  <p className="mb-2 font-semibold">Image:</p>
                  <img src={viewItem.image} alt="" className="w-full h-48 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content max-w-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-900 text-2xl leading-none">×</button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value, slug: formData.id ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input required type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded bg-gray-50 outline-none" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                    <select value={formData.parentId || ''} onChange={e => setFormData({...formData, parentId: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all">
                      <option value="">None (Top Level Category)</option>
                      {parentCategories.filter(c => c.id !== formData.id).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input type="number" value={formData.displayOrder || 0} onChange={e => setFormData({...formData, displayOrder: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border border-gray-300 p-2 rounded text-sm bg-white" />
                    {formData.image && <img src={formData.image} alt="" className="mt-3 w-24 h-24 object-cover rounded shadow-sm border border-gray-100" />}
                  </div>
                </div>
                <div className="pt-5 flex justify-end gap-3 border-t border-gray-100 mt-6">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium">Cancel</button>
                  <button type="submit" className="bg-black text-white px-8 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium shadow-sm">Save Category</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Image</th>
                <th className="p-4 font-semibold text-gray-600">Order</th>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Parent</th>
                <th className="p-4 font-semibold text-gray-600">Products</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading categories...</td></tr>
              ) : categories.map(cat => (
                <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setViewItem(cat)}>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded shadow-sm border border-gray-100" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200"></div>
                    )}
                  </td>
                  <td className="p-4 text-gray-700">{cat.displayOrder}</td>
                  <td className="p-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="p-4 text-gray-500">{cat.parent?.name || '-'}</td>
                  <td className="p-4 text-gray-700">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-full text-xs font-semibold text-gray-600">{cat._count?.products || 0}</span>
                  </td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setViewItem(cat)} className="text-blue-500 hover:text-blue-700 mr-3 text-lg" title="View">👁️</button>
                    <button onClick={() => handleEdit(cat)} className="text-gray-500 hover:text-gray-700 mr-3 text-lg" title="Edit">✏️</button>
                    <button onClick={() => setDeleteId(cat.id)} className="text-red-500 hover:text-red-700 text-lg" title="Delete">🗑️</button>
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
