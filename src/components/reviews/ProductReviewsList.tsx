import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Camera, CheckCircle2, User } from 'lucide-react';
import { ProductReview, Product } from '../../types';
import { reviewsApi } from '../../services/reviewsApi';
import { WriteReviewForm } from './WriteReviewForm';
import { ReviewImageViewer } from './ReviewImageViewer';

interface ProductReviewsListProps {
  product: Product;
}

export const ProductReviewsList: React.FC<ProductReviewsListProps> = ({ product }) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await reviewsApi.getForProduct(product.id);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const handleReviewSubmitted = () => {
    setIsWritingReview(false);
    fetchReviews();
  };

  const getRatingSummary = () => {
    if (reviews.length === 0) return { avg: 0, counts: [0, 0, 0, 0, 0] };
    const counts = [0, 0, 0, 0, 0];
    let sum = 0;
    reviews.forEach(r => {
      counts[5 - r.rating]++;
      sum += r.rating;
    });
    return { avg: (sum / reviews.length).toFixed(1), counts };
  };

  const summary = getRatingSummary();

  return (
    <div className="mt-12 md:mt-16 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl w-32">
              <span className="text-4xl font-black text-gray-900">{reviews.length > 0 ? summary.avg : product.rating}</span>
              <div className="flex text-yellow-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-500 mt-1">{reviews.length || product.reviewsCount} reviews</span>
            </div>
            
            <div className="flex-1 max-w-xs space-y-2 hidden sm:block">
              {summary.counts.map((count, i) => {
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : (5-i === 5 ? 75 : 5-i === 4 ? 20 : 0);
                return (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600 font-medium w-3">{5 - i}</span>
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsWritingReview(true)}
          className="bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
        >
          Write a review
        </button>
      </div>

      {isWritingReview && (
        <div className="mb-10">
          <WriteReviewForm 
            productId={product.id} 
            onCancel={() => setIsWritingReview(false)} 
            onSuccess={handleReviewSubmitted} 
          />
        </div>
      )}

      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full shrink-0"></div>
              <div className="flex-1 space-y-3 pt-2">
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4 sm:gap-6 pb-8 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full overflow-hidden shrink-0 flex items-center justify-center border border-gray-200">
                {review.userAvatarUrl ? (
                  <img src={review.userAvatarUrl} alt={review.userName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-gray-900">{review.userName}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  {review.verifiedPurchase && (
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4">{review.description}</p>
                
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.images.map((img, idx) => (
                      <button 
                        key={img.id} 
                        onClick={() => setActiveImage(img.url)}
                        className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 relative group"
                      >
                        <img src={img.url} alt={`Review ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                  <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
            <Camera className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Be the first to review this product and share your experience with other customers.</p>
          <button 
            onClick={() => setIsWritingReview(true)}
            className="bg-white border border-gray-200 text-gray-900 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Write the first review
          </button>
        </div>
      )}

      {activeImage && (
        <ReviewImageViewer imageUrl={activeImage} onClose={() => setActiveImage(null)} />
      )}
    </div>
  );
};
