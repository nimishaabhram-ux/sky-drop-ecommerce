import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="px-4 py-20 max-w-3xl mx-auto w-full flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Browse our catalog to find what you need.
        </p>
        <Link to="/shop">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <ul className="divide-y divide-slate-200">
              {cart.map((item) => (
                <li key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Item Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">
                          <Link to={`/product/${item.product.id}`} className="hover:text-blue-600">
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-slate-500 capitalize">{item.product.category}</p>
                      </div>
                      <span className="font-bold text-slate-900 text-lg">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax</span>
                <span className="font-medium text-slate-900">${(cartSubtotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Delivery Fee</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-slate-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">
                    ${(cartSubtotal * 1.08).toFixed(2)}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Excluding delivery</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={() => navigate('/checkout')} className="w-full flex items-center justify-center gap-2">
                Continue to checkout <ArrowRight className="w-4 h-4" />
              </Button>
              <Link to="/shop">
                <Button size="lg" variant="ghost" fullWidth>
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
