import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Minus, Plus, Truck, Zap, AlertCircle } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useCart } from '../context/CartContext';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product not found</h2>
        <p className="text-slate-600 mb-6">The product you are looking for does not exist.</p>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Product Image */}
          <div className="bg-slate-100 aspect-square md:aspect-auto md:h-full relative flex items-center justify-center p-8">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="max-w-full max-h-full object-contain drop-shadow-xl"
            />
            {product.originalPrice && (
              <div className="absolute top-6 left-6">
                <Badge variant="danger" className="text-sm px-3 py-1">Sale</Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-10 flex flex-col">
            <div className="mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="ml-1 font-medium text-slate-900">{product.rating}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{product.reviewsCount} reviews</span>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-extrabold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-slate-400 line-through mb-1">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-auto">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium text-slate-900">Quantity</span>
                <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-slate-600 hover:text-slate-900 hover:shadow-sm transition-all disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-slate-600 hover:text-slate-900 hover:shadow-sm transition-all disabled:opacity-50"
                    disabled={!product.inStock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {!product.inStock && (
                  <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Out of stock
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button 
                  size="lg" 
                  className="flex-1 text-base h-12" 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  Add to cart
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="flex-1 text-base h-12"
                  disabled={!product.inStock}
                >
                  Buy now
                </Button>
              </div>

              {/* Delivery Options */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h3 className="font-semibold text-slate-900 mb-2">Delivery Options</h3>
                
                {product.isDroneOptimized ? (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-50/50 border border-cyan-100">
                    <Zap className="w-6 h-6 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-slate-900">Drone Delivery</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Available for this product. Estimated arrival: <span className="font-medium text-slate-900">{product.prepTimeMinutes + 8}–{product.prepTimeMinutes + 12} minutes</span> after preparation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 opacity-75">
                    <Zap className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-slate-700">Drone Delivery</h4>
                      <p className="text-sm text-slate-500 mt-1">
                        Not available due to size or weight constraints.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <Truck className="w-6 h-6 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-900">Standard Delivery</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Estimated arrival: <span className="font-medium text-slate-900">30–45 minutes</span>.
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
