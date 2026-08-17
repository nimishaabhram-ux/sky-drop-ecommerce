import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Plus, Check } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <Card noPadding className="h-full flex flex-col hover:border-blue-300 transition-colors duration-200 overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.originalPrice && (
            <div className="absolute top-2 left-2">
              <Badge variant="danger">Sale</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-slate-900 leading-tight line-clamp-2">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-slate-700">{product.rating}</span>
            <span className="text-xs text-slate-500">({product.reviewsCount})</span>
          </div>

          {/* Pricing */}
          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <Button 
              size="sm" 
              variant={added ? "success" : "primary"}
              onClick={handleAdd}
              className="rounded-full w-9 h-9 p-0 flex items-center justify-center shrink-0"
              aria-label="Add to cart"
            >
              {added ? <Check className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
            </Button>
          </div>
          
          {/* Drone Delivery Badge */}
          {product.isDroneOptimized && (
            <div className="mt-3">
              <Badge variant="drone" className="text-[10px] py-0">Drone delivery available</Badge>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
