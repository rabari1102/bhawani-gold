'use client';
import { useState, useEffect } from 'react';

export default function AppDownloadBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const wasDismissed = sessionStorage.getItem('app_banner_dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }
    // Show after a short delay
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('app_banner_dismissed', 'true');
  };

  if (dismissed || !show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-black to-gray-900 text-white px-4 py-3 shadow-2xl animate-fade-in-up">
      <div className="container-custom flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 bg-[#c5a059] rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">Download Our App</p>
            <p className="text-xs text-gray-400 truncate hidden sm:block">Enjoy faster access and better experience on our mobile app</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a href="#" className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors hidden sm:inline-block">
            Play Store
          </a>
          <a href="#" className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors hidden sm:inline-block">
            App Store
          </a>
          <a href="#" className="bg-[#c5a059] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#b08d4b] transition-colors sm:hidden">
            Download
          </a>
          <button onClick={handleDismiss} className="text-gray-400 hover:text-white transition-colors ml-2 p-1" aria-label="Dismiss">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
