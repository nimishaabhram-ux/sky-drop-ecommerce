import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Plus, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-[16px] border border-gray-100 overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all group flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isDroneOptimized && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-white/50 flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-600" />
            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Drone</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/product/${product.id}`} className="flex-1">
            <h3 className="font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded ml-2 shrink-0">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            {product.rating || "4.5"}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3 line-clamp-1">{product.category}</p>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
            className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors border border-blue-100"
            aria-label="Add to cart"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
