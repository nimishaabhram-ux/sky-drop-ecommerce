import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ReviewImageViewerProps {
  imageUrl: string;
  onClose: () => void;
}

export const ReviewImageViewer: React.FC<ReviewImageViewerProps> = ({ imageUrl, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <button 
        className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
        onClick={onClose}
        aria-label="Close viewer"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div 
        className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={imageUrl} 
          alt="Review full size" 
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};
