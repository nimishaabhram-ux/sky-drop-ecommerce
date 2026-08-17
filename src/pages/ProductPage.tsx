import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Minus, Plus, Truck, Zap, AlertCircle } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = INITIAL_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className="px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
        <p className="text-gray-600 mb-6">The product you are looking for does not exist.</p>
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
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8 min-h-screen">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        
        {/* Product Image */}
        <div className="bg-gray-50 rounded-3xl aspect-[4/3] md:aspect-square relative flex items-center justify-center p-8 border border-gray-100 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl"
          />
          {product.isDroneOptimized && (
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-white/50 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Drone delivery</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col pt-2 md:pt-6">
          <div className="mb-2">
            <Link to={`/shop?category=${product.category}`} className="text-sm font-semibold uppercase tracking-wider text-blue-600 hover:text-blue-700">
              {product.category}
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-sm font-medium border border-yellow-200/50">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {product.rating || "4.5"}
            </div>
            <span className="text-gray-500 text-sm">{product.reviewsCount || "120"} ratings</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-extrabold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-400 line-through mb-1">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Delivery Options */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 mb-2">Delivery Options</h3>
            
            {product.isDroneOptimized ? (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Drone Delivery</h4>
                  <p className="text-sm text-gray-500">
                    10-15 mins • Available to saved locations
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Standard Delivery</h4>
                <p className="text-sm text-gray-500">
                  30-45 mins • Delivered to your door
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-6 mb-8">
              <span className="font-medium text-gray-900">Quantity</span>
              <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="w-12 h-12 flex items-center justify-center font-bold text-gray-900 border-x border-gray-200">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={!product.inStock}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {!product.inStock && (
                <span className="text-sm font-medium text-red-600 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4" /> Out of stock
                </span>
              )}
            </div>

            <Button 
              size="lg" 
              className="w-full text-lg h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-md" 
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              Add to cart - ${(product.price * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
