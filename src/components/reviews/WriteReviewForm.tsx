import React, { useState, useRef, useEffect } from 'react';
import { Star, Upload, X, AlertCircle } from 'lucide-react';
import { reviewsApi } from '../../services/reviewsApi';

interface WriteReviewFormProps {
  productId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const WriteReviewForm: React.FC<WriteReviewFormProps> = ({ productId, onCancel, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<{file: File, url: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const remainingSlots = 5 - images.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      
      const newImages = filesToAdd.map((file: File) => ({
        file,
        url: URL.createObjectURL(file)
      }));
      
      setImages(prev => [...prev, ...newImages]);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].url);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    
    if (description.trim().length < 10) {
      setError("Please write a review with at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app we'd upload images to S3/CDN first. Here we just use Data URLs or mock URLs
      const mockImageUrls = images.map((img, i) => ({
        id: `img-${Date.now()}-${i}`,
        url: img.url // using object URL for demo, real backend would return an S3 url
      }));

      await reviewsApi.create(productId, {
        rating,
        description,
        images: mockImageUrls,
        verifiedPurchase: true
      });
      
      onSuccess();
    } catch (err) {
      setError("Failed to submit review. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
      
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-3">Overall rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300 hover:text-gray-400'
                  } transition-colors`} 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-3">Add a written review</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you like or dislike? What did you use this product for?"
            rows={4}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors resize-none"
          ></textarea>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-900 mb-1">Add photos</label>
          <p className="text-xs text-gray-500 mb-3">Show others what the product looks like (Max 5 images)</p>
          
          <div className="flex flex-wrap gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                <img src={img.url} alt="Upload preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center gap-1 transition-colors text-gray-500 hover:text-blue-600"
              >
                <Upload className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg,image/png,image/webp" 
              multiple 
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-gray-600 font-bold px-6 py-3 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
