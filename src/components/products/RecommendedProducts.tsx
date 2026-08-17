import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { INITIAL_PRODUCTS } from '../../data/mockData';

interface RecommendedProductsProps {
  currentProductId: string;
  category: string;
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ currentProductId, category }) => {
  // In a real app, this would be an API call based on product relationships or AI recommendations.
  // For the demo, we filter by category or randomly select.
  const recommendations = INITIAL_PRODUCTS
    .filter(p => p.id !== currentProductId)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === category && b.category !== category) return -1;
      if (b.category === category && a.category !== category) return 1;
      // Then prioritize drone optimized
      if (a.isDroneOptimized && !b.isDroneOptimized) return -1;
      if (b.isDroneOptimized && !a.isDroneOptimized) return 1;
      return 0.5 - Math.random();
    })
    .slice(0, 4);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-100 pt-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You might also like</h2>
          <p className="text-gray-500">Customers who viewed this item also bought</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
