'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/admin/Toast';
import Pagination from '@/components/admin/Pagination';

export default function AdminBlogPage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any>(null);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState<any>({
    title: '', slug: '', excerpt: '', content: '', coverImage: '', isPublished: false, publishDate: new Date().toISOString().split('T')[0]
  });

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch(`/api/blog?all=true&page=${page}&limit=${limit}`);
    const data = await res.json();
    setPosts(data.posts || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page, limit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = formData.id ? `/api/blog/${formData.id}` : '/api/blog';
    const method = formData.id ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      showToast(formData.id ? 'Post updated successfully' : 'Post created successfully', 'success');
      setIsEditing(false);
      setFormData({ title: '', slug: '', excerpt: '', content: '', coverImage: '', isPublished: false, publishDate: new Date().toISOString().split('T')[0] });
      fetchPosts();
    } else {
      const errData = await res.json();
      showToast(errData.error || 'Failed to save post', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/blog/${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Post deleted successfully', 'success');
    } else {
      showToast('Failed to delete post', 'error');
    }
    setDeleteId(null);
    fetchPosts();
  };

  const handleEdit = (item: any) => {
    setFormData({
      ...item,
      publishDate: new Date(item.publishDate).toISOString().split('T')[0]
    });
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setFormData({ ...formData, coverImage: data.url });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
        <button onClick={() => { setFormData({ title: '', slug: '', excerpt: '', content: '', coverImage: '', isPublished: false, publishDate: new Date().toISOString().split('T')[0] }); setIsEditing(true); }} className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors shadow-sm">
          + Add Blog Post
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>
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
          <div className="modal-content max-w-3xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Post' : 'Add Post'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-900 text-2xl leading-none">×</button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input required type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value, slug: formData.id ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded bg-gray-50 outline-none" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
                    <textarea required value={formData.excerpt || ''} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all" rows={2} />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                    <textarea required value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all" rows={8} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border border-gray-300 p-2 rounded text-sm bg-white" />
                    {formData.coverImage && <img src={formData.coverImage} alt="" className="mt-3 w-32 h-20 object-cover rounded shadow-sm border border-gray-100" />}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                    <input type="date" value={formData.publishDate || ''} onChange={e => setFormData({...formData, publishDate: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-black outline-none transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2 pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                    <input type="checkbox" checked={formData.isPublished || false} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="rounded text-black focus:ring-black" />
                    Published
                  </label>
                </div>
                <div className="pt-5 flex justify-end gap-3 border-t border-gray-100 mt-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium">Cancel</button>
                  <button type="submit" className="bg-black text-white px-8 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium shadow-sm">Save Post</button>
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
              <h3 className="text-lg font-bold text-gray-900">Blog Post Details</h3>
              <div className="flex gap-3 items-center">
                <button onClick={() => { handleEdit(viewItem); setViewItem(null); }} className="text-gray-500 hover:text-gray-700 text-lg" title="Edit">✏️</button>
                <button onClick={() => { setDeleteId(viewItem.id); setViewItem(null); }} className="text-red-500 hover:text-red-700 text-lg" title="Delete">🗑️</button>
                <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-900 text-xl ml-2">×</button>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong>Title:</strong> {viewItem.title}</p>
              <p><strong>Slug:</strong> {viewItem.slug}</p>
              <p><strong>Status:</strong> {viewItem.isPublished ? 'Published' : 'Draft'}</p>
              <p><strong>Publish Date:</strong> {new Date(viewItem.publishDate).toLocaleDateString()}</p>
              <p><strong>Excerpt:</strong> {viewItem.excerpt}</p>
              {viewItem.coverImage && (
                <div className="mt-4">
                  <p className="mb-2 font-semibold">Cover Image:</p>
                  <img src={viewItem.coverImage} alt="" className="w-full h-48 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Cover</th>
                <th className="p-4 font-semibold text-gray-600">Title</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading blog posts...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No blog posts found</td></tr>
              ) : posts.map(post => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setViewItem(post)}>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {post.coverImage ? (
                      <img src={post.coverImage} alt="" className="w-16 h-10 object-cover rounded shadow-sm border border-gray-100" />
                    ) : (
                      <div className="w-16 h-10 bg-gray-100 rounded border border-gray-200"></div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{post.title}</td>
                  <td className="p-4 text-gray-600">{new Date(post.publishDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setViewItem(post)} className="text-blue-500 hover:text-blue-700 mr-3 text-lg" title="View">👁️</button>
                    <button onClick={() => handleEdit(post)} className="text-gray-500 hover:text-gray-700 mr-3 text-lg" title="Edit">✏️</button>
                    <button onClick={() => setDeleteId(post.id)} className="text-red-500 hover:text-red-700 text-lg" title="Delete">🗑️</button>
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
