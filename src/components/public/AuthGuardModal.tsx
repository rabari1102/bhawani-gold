'use client';
import { useState } from 'react';
import Link from 'next/link';

interface AuthGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function AuthGuardModal({ isOpen, onClose, title = "Sign In Required", message = "Please sign in or create an account to use this feature." }: AuthGuardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay z-[100]" onClick={onClose}>
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center" onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-[#c5a059]">🔒</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-8">{message}</p>
        
        <div className="flex flex-col gap-3">
          <Link 
            href="/login" 
            onClick={onClose}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
          >
            Sign In to Account
          </Link>
          <Link 
            href="/login" 
            onClick={onClose}
            className="w-full bg-white text-black border border-gray-200 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Create New Account
          </Link>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-6 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
