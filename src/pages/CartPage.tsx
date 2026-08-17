import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/currency';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="px-4 py-20 max-w-3xl mx-auto w-full flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Browse our catalog to find what you need.
        </p>
        <Link to="/shop">
          <Button size="lg" className="rounded-xl px-8">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <ul className="divide-y divide-gray-100">
              {cart.map((item) => (
                <li key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Item Image */}
                  <Link to={`/product/${item.product.id}`} className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </Link>
                  
                  {/* Item Details */}
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-2 pr-4">
                          <Link to={`/product/${item.product.id}`} className="hover:text-blue-600 transition-colors">
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 capitalize">{item.product.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-gray-900 text-lg block">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                        {item.product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(item.product.originalPrice * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="w-10 h-10 flex items-center justify-center font-bold text-gray-900 border-x border-gray-200 text-sm">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax (18%)</span>
                <span className="font-medium text-gray-900">{formatCurrency(Math.round(cartSubtotal * 0.18))}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Delivery Fee</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-gray-900 block leading-none">
                    {formatCurrency(cartSubtotal + Math.round(cartSubtotal * 0.18))}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Excluding delivery</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={() => navigate('/checkout')} className="w-full rounded-2xl h-14 text-lg shadow-md flex items-center justify-center gap-2">
                Checkout <ArrowRight className="w-5 h-5" />
              </Button>
              <Link to="/shop">
                <Button size="lg" variant="ghost" className="w-full rounded-2xl h-14 text-gray-600 hover:bg-gray-50">
                  Continue shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
