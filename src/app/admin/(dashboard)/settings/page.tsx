'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/admin/Toast';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data.settings || {});
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        showToast('Settings saved successfully', 'success');
      } else {
        showToast('Failed to save settings', 'error');
      }
    } catch {
      showToast('Failed to save settings', 'error');
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setSettings({ ...settings, [field]: data.url });
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Store Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* General Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">General Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <input type="text" value={settings.storeName || ''} onChange={e => setSettings({...settings, storeName: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tagline</label>
              <input type="text" value={settings.tagline || ''} onChange={e => setSettings({...settings, tagline: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="text" value={settings.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={settings.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea value={settings.address || ''} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full border p-2 rounded" rows={2} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Opening Hours</label>
              <input type="text" value={settings.openingHours || ''} onChange={e => setSettings({...settings, openingHours: e.target.value})} className="w-full border p-2 rounded" />
            </div>
          </div>
        </div>

        {/* Home Page Hero Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Home Page Hero Section</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hero Heading</label>
              <input type="text" value={settings.heroHeading || ''} onChange={e => setSettings({...settings, heroHeading: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hero Subheading</label>
              <textarea value={settings.heroSubheading || ''} onChange={e => setSettings({...settings, heroSubheading: e.target.value})} className="w-full border p-2 rounded" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hero Background Image</label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'heroImage')} className="border p-2 rounded text-sm flex-1" />
                {settings.heroImage && <img src={settings.heroImage} alt="Hero" className="w-32 h-20 object-cover rounded border" />}
              </div>
              {settings.heroImage && <p className="text-xs text-gray-400 mt-1">{settings.heroImage}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">CTA 1 Text</label>
                <input type="text" value={settings.heroCTA1Text || ''} onChange={e => setSettings({...settings, heroCTA1Text: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CTA 1 Link</label>
                <input type="text" value={settings.heroCTA1Link || ''} onChange={e => setSettings({...settings, heroCTA1Link: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CTA 2 Text</label>
                <input type="text" value={settings.heroCTA2Text || ''} onChange={e => setSettings({...settings, heroCTA2Text: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CTA 2 Link</label>
                <input type="text" value={settings.heroCTA2Link || ''} onChange={e => setSettings({...settings, heroCTA2Link: e.target.value})} className="w-full border p-2 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* About Page */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">About Page Content</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Section Label</label>
                <input type="text" value={settings.aboutSubheading || ''} onChange={e => setSettings({...settings, aboutSubheading: e.target.value})} className="w-full border p-2 rounded" placeholder="e.g. Our Story" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Heading</label>
                <input type="text" value={settings.aboutHeading || ''} onChange={e => setSettings({...settings, aboutHeading: e.target.value})} className="w-full border p-2 rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">About Content (separate paragraphs with blank lines)</label>
              <textarea value={settings.aboutContent || ''} onChange={e => setSettings({...settings, aboutContent: e.target.value})} className="w-full border p-2 rounded" rows={8} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">About Page Image</label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'aboutImage')} className="border p-2 rounded text-sm flex-1" />
                {settings.aboutImage && <img src={settings.aboutImage} alt="About" className="w-24 h-24 object-cover rounded border" />}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Social Media & Footer</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Instagram URL</label>
                <input type="url" value={settings.socialInstagram || ''} onChange={e => setSettings({...settings, socialInstagram: e.target.value})} className="w-full border p-2 rounded" placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Facebook URL</label>
                <input type="url" value={settings.socialFacebook || ''} onChange={e => setSettings({...settings, socialFacebook: e.target.value})} className="w-full border p-2 rounded" placeholder="https://facebook.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">YouTube URL</label>
                <input type="url" value={settings.socialYoutube || ''} onChange={e => setSettings({...settings, socialYoutube: e.target.value})} className="w-full border p-2 rounded" placeholder="https://youtube.com/..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Footer Text</label>
              <textarea value={settings.footerText || ''} onChange={e => setSettings({...settings, footerText: e.target.value})} className="w-full border p-2 rounded" rows={3} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="bg-black text-white px-8 py-3 rounded font-bold w-full disabled:bg-gray-400">
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>

      </form>
    </div>
  );
}
