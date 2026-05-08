'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', interestedIn: '', message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', interestedIn: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFF8F0] rounded-bl-full z-0 opacity-50"></div>
      
      <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6 relative z-10">Send us a Message</h2>
      
      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-6 text-center relative z-10">
          <span className="text-4xl block mb-2">✓</span>
          <h3 className="font-bold mb-1">Thank You!</h3>
          <p className="text-sm">Your message has been received. Our team will contact you shortly.</p>
          <button onClick={() => setStatus('idle')} className="mt-4 text-sm font-medium text-green-700 underline">Send another message</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Name *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8860B] focus:bg-white transition-colors text-sm" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Phone</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8860B] focus:bg-white transition-colors text-sm" placeholder="Your Phone Number" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Email Address *</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8860B] focus:bg-white transition-colors text-sm" placeholder="Your Email Address" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Interested In</label>
            <select value={formData.interestedIn} onChange={e => setFormData({...formData, interestedIn: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8860B] focus:bg-white transition-colors text-sm appearance-none">
              <option value="">Select an option</option>
              <option value="Bridal Jewellery">Bridal Jewellery</option>
              <option value="Bespoke Design">Bespoke Design</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Message *</label>
            <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8860B] focus:bg-white transition-colors text-sm resize-none" placeholder="How can we help you?"></textarea>
          </div>

          {status === 'error' && (
            <p className="text-red-500 text-sm">There was an error sending your message. Please try again.</p>
          )}

          <button disabled={status === 'loading'} type="submit" className="w-full btn-gold mt-4 disabled:opacity-70">
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
