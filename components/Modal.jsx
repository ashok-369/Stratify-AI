
import React, { useEffect } from 'react';
import { Icon } from './Icon.jsx';

export const Modal = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-modal-enter ring-1 ring-black/5 dark:ring-white/10">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-navy dark:text-white tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-navy dark:text-gray-500 dark:hover:text-white"
          >
            <Icon name="x" size={24} />
          </button>
        </div>
        <div className="p-6 md:p-8 bg-white dark:bg-gray-900">
            {children}
        </div>
      </div>
    </div>
  );
};
