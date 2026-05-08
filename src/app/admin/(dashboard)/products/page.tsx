'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/admin/Toast';
import Pagination from '@/components/admin/Pagination';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState<any>({
    sku: '', name: '', slug: '', categoryId: '', description: '', weight: '', metalType: 'GOLD_22K', price: '',
    purity: '22K 916', availabilityStatus: 'In Stock', isHallmarked: true,
    isTopTrending: false, isNewArrival: false, isSpecialSelection: false, isVisible: true, primaryImage: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      fetch(`/api/products?page=${page}&limit=${limit}`),
      fetch('/api/categories')
    ]);
    const prodData = await prodRes.json();
    const catData = await catRes.json();
    setProducts(prodData.products || []);
    setTotal(prodData.total || 0);
    setTotalPages(prodData.totalPages || 1);
    setCategories(catData.categories || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing && formData.id ? `/api/products/${formData.id}` : '/api/products';
    const method = isEditing && formData.id ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      showToast(formData.id ? 'Product updated successfully' : 'Product created successfully', 'success');
      setIsEditing(false);
      setFormData({ sku: '', name: '', slug: '', categoryId: '', description: '', weight: '', metalType: 'GOLD_22K', price: '', purity: '22K 916', availabilityStatus: 'In Stock', isHallmarked: true, isTopTrending: false, isNewArrival: false, isSpecialSelection: false, isVisible: true, primaryImage: '' });
      fetchProducts();
    } else {
      const errData = await res.json();
      showToast(errData.error || 'Failed to save product', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/products/${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Product deleted successfully', 'success');
    } else {
      showToast('Failed to delete product', 'error');
    }
    setDeleteId(null);
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setFormData({ ...product, weight: product.weight || '', price: product.price || '' });
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setFormData({ ...formData, primaryImage: data.url });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <button onClick={() => { setFormData({ sku: '', name: '', slug: '', categoryId: '', description: '', weight: '', metalType: 'GOLD_22K', price: '', purity: '22K 916', availabilityStatus: 'In Stock', isHallmarked: true, isTopTrending: false, isNewArrival: false, isSpecialSelection: false, isVisible: true, primaryImage: '' }); setIsEditing(true); }} className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors shadow-sm">
          + Add New Product
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
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
              <h3 className="text-lg font-bold text-gray-900">Product Details</h3>
              <div className="flex gap-3 items-center">
                <button onClick={() => { handleEdit(viewItem); setViewItem(null); }} className="text-gray-500 hover:text-gray-700 text-lg" title="Edit">✏️</button>
                <button onClick={() => { setDeleteId(viewItem.id); setViewItem(null); }} className="text-red-500 hover:text-red-700 text-lg" title="Delete">🗑️</button>
                <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-900 text-xl ml-2">×</button>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong>Name:</strong> {viewItem.name}</p>
              <p><strong>SKU:</strong> {viewItem.sku}</p>
              <p><strong>Category:</strong> {viewItem.category?.name}</p>
              <p><strong>Price:</strong> ₹{viewItem.price}</p>
              <p><strong>Weight:</strong> {viewItem.weight}g</p>
              <p><strong>Metal:</strong> {viewItem.metalType}</p>
              <p><strong>Purity:</strong> {viewItem.purity}</p>
              <p><strong>Availability:</strong> {viewItem.availabilityStatus}</p>
              <p><strong>Hallmarked:</strong> {viewItem.isHallmarked ? 'Yes' : 'No'}</p>
              <p><strong>Description:</strong> {viewItem.description}</p>
              {viewItem.primaryImage && (
                <div className="mt-4">
                  <p className="mb-2 font-semibold">Image:</p>
                  <img src={viewItem.primaryImage} alt="" className="w-full h-48 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => { setIsEditing(false); setFormData({}); }} className="text-gray-400 hover:text-gray-900 text-2xl leading-none">×</button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                    <input required type="text" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value, slug: formData.id ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input required type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded bg-gray-50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select required value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
                    <input type="number" step="0.001" min="0" value={formData.weight || ''} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input type="number" min="0" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type</label>
                    <select value={formData.metalType || 'GOLD_22K'} onChange={e => setFormData({...formData, metalType: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white">
                      <option value="GOLD_24K">24K Gold (999)</option>
                      <option value="GOLD_22K">22K Gold (916)</option>
                      <option value="GOLD_18K">18K Gold (750)</option>
                      <option value="PLATINUM">Platinum</option>
                      <option value="SILVER">Silver</option>
                      <option value="DIAMOND">Diamond</option>
                      <option value="GEMSTONE">Gemstone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purity</label>
                    <input type="text" value={formData.purity || ''} onChange={e => setFormData({...formData, purity: e.target.value})} placeholder="e.g. 22K 916" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
                    <select value={formData.availabilityStatus || 'In Stock'} onChange={e => setFormData({...formData, availabilityStatus: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white">
                      <option value="In Stock">In Stock</option>
                      <option value="Made to Order">Made to Order</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border border-gray-300 p-2 rounded text-sm bg-white" />
                    {formData.primaryImage && <img src={formData.primaryImage} alt="" className="mt-3 w-24 h-24 object-cover rounded shadow-sm" />}
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" rows={3} />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-6 bg-gray-50 p-4 rounded border border-gray-200">
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"><input type="checkbox" checked={formData.isTopTrending || false} onChange={e => setFormData({...formData, isTopTrending: e.target.checked})} className="rounded text-black focus:ring-black" /> Top Trending</label>
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"><input type="checkbox" checked={formData.isNewArrival || false} onChange={e => setFormData({...formData, isNewArrival: e.target.checked})} className="rounded text-black focus:ring-black" /> New Arrival</label>
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"><input type="checkbox" checked={formData.isSpecialSelection || false} onChange={e => setFormData({...formData, isSpecialSelection: e.target.checked})} className="rounded text-black focus:ring-black" /> Special Selection</label>
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"><input type="checkbox" checked={formData.isHallmarked ?? true} onChange={e => setFormData({...formData, isHallmarked: e.target.checked})} className="rounded text-black focus:ring-black" /> BIS Hallmarked</label>
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"><input type="checkbox" checked={formData.isVisible ?? true} onChange={e => setFormData({...formData, isVisible: e.target.checked})} className="rounded text-black focus:ring-black" /> Visible</label>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium">Cancel</button>
                  <button type="submit" className="bg-black text-white px-8 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium shadow-sm">Save Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Image</th>
                <th className="p-4 font-semibold text-gray-600">SKU</th>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Category</th>
                <th className="p-4 font-semibold text-gray-600">Flags</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading products...</td></tr>
              ) : products.map(product => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setViewItem(product)}>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {product.primaryImage ? (
                      <img src={product.primaryImage} alt={product.name} className="w-12 h-12 object-cover rounded shadow-sm border border-gray-100" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs border border-gray-200">✦</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{product.sku}</td>
                  <td className="p-4 text-gray-800">{product.name}</td>
                  <td className="p-4 text-gray-600">{product.category?.name}</td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      {product.isTopTrending && <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm" title="Trending"></span>}
                      {product.isNewArrival && <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm" title="New"></span>}
                      {product.isSpecialSelection && <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm" title="Special"></span>}
                      {!product.isVisible && <span className="w-2.5 h-2.5 rounded-full bg-gray-300 shadow-sm" title="Hidden"></span>}
                    </div>
                  </td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setViewItem(product)} className="text-blue-500 hover:text-blue-700 mr-3 text-lg" title="View">👁️</button>
                    <button onClick={() => handleEdit(product)} className="text-gray-500 hover:text-gray-700 mr-3 text-lg" title="Edit">✏️</button>
                    <button onClick={() => setDeleteId(product.id)} className="text-red-500 hover:text-red-700 text-lg" title="Delete">🗑️</button>
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
