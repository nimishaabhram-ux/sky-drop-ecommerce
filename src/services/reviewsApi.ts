import { fetchApi } from './api';
import { ProductReview } from '../types';

export const reviewsApi = {
  getForProduct: async (productId: string) => {
    const data = await fetchApi<{reviews: ProductReview[]}>(`/products/${productId}/reviews`);
    return data.reviews;
  },
  
  create: async (productId: string, data: Partial<ProductReview>) => {
    const res = await fetchApi<{review: ProductReview}>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.review;
  },
};
