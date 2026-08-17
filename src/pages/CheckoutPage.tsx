import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { locationsApi } from '../services/locationsApi';
import { ordersApi } from '../services/ordersApi';
import { DeliveryLocation } from '../types';
import { DeliveryMethodSelector } from '../components/checkout/DeliveryMethodSelector';
import { DeliveryLocationSelector } from '../components/checkout/DeliveryLocationSelector';
import { Button } from '../components/common/Button';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [locations, setLocations] = useState<DeliveryLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'drone'>('standard');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if cart is eligible for drone delivery
  const isDroneEligible = cart.length > 0 && cart.every(item => item.product.isDroneOptimized);
  const deliveryFee = deliveryMethod === 'drone' ? 9.99 : 4.99;
  const tax = cartSubtotal * 0.08;
  const totalAmount = cartSubtotal + deliveryFee + tax;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    const fetchLocations = async () => {
      try {
        const data = await locationsApi.getLocations();
        setLocations(data);
        const defaultLoc = data.find(l => l.isDefault);
        if (defaultLoc) {
          setSelectedLocationId(defaultLoc.id);
        } else if (data.length > 0) {
          setSelectedLocationId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load locations", err);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [cart.length, navigate]);

  // If the cart suddenly becomes ineligible, force standard
  useEffect(() => {
    if (!isDroneEligible && deliveryMethod === 'drone') {
      setDeliveryMethod('standard');
    }
  }, [isDroneEligible, deliveryMethod]);

  const handlePlaceOrder = async () => {
    if (deliveryMethod === 'drone' && !selectedLocationId) {
      setError("Please select a drone delivery location.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Mock user info for the demo
      const order = await ordersApi.createOrder({
        userId: 'user1',
        items: cart,
        deliveryMethod,
        deliveryLocationId: deliveryMethod === 'drone' ? selectedLocationId || undefined : undefined,
        status: 'ORDER_PROCESSING',
        subtotal: cartSubtotal,
        deliveryFee,
        dronePriorityFee: deliveryMethod === 'drone' ? 5 : 0,
        tax,
        totalAmount,
        estimatedDeliveryMinutes: deliveryMethod === 'drone' ? 12 : 35,
        paymentMethod: 'card'
      });

      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link to="/cart" className="hover:text-slate-900">Cart</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-slate-900 font-medium">Checkout</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column - Checkout Flow */}
        <div className="flex-1 flex flex-col gap-8">
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* 1. Contact Information */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
              Contact Information
            </h2>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input type="email" defaultValue="customer@example.com" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                <input type="text" defaultValue="Alex" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                <input type="text" defaultValue="Smith" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone number</label>
                <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" />
              </div>
            </div>
          </section>

          {/* 2. Delivery Method */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
              Delivery Method
            </h2>
            
            {!isDroneEligible && (
              <div className="mb-4 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p><strong>Drone delivery isn't available for this order.</strong> One or more items exceed the supported delivery size or weight.</p>
              </div>
            )}
            
            <DeliveryMethodSelector 
              selectedMethod={deliveryMethod}
              onChange={setDeliveryMethod}
              isDroneAvailable={isDroneEligible}
            />
          </section>

          {/* 3. Delivery Location */}
          {deliveryMethod === 'drone' ? (
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
                Delivery Location
              </h2>
              {isLoadingLocations ? (
                <div className="animate-pulse bg-slate-100 h-32 rounded-xl"></div>
              ) : (
                <DeliveryLocationSelector 
                  locations={locations}
                  selectedLocationId={selectedLocationId}
                  onChange={setSelectedLocationId}
                />
              )}
            </section>
          ) : (
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
                Delivery Address
              </h2>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input type="text" defaultValue="123 Example Street" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input type="text" defaultValue="San Francisco" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" />
                </div>
              </div>
            </section>
          )}

          {/* 4. Payment */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">4</span>
              Payment
            </h2>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl">
              <div className="flex items-center gap-3 p-4 border border-blue-600 bg-blue-50/30 rounded-xl mb-4">
                <div className="w-5 h-5 rounded-full border-4 border-blue-600"></div>
                <div>
                  <p className="font-medium text-slate-900">Credit Card ending in 4242</p>
                  <p className="text-sm text-slate-500">Exp: 12/28</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                <ShieldCheck className="w-4 h-4" /> Payments are secure and encrypted.
              </p>
            </div>
          </section>

        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
            
            <div className="max-h-64 overflow-y-auto pr-2 mb-6 space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-900 line-clamp-2">{item.product.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pt-6 border-t border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax</span>
                <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-slate-900">${deliveryFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-slate-900 text-lg">Total</span>
                <span className="text-2xl font-bold text-slate-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <Button 
              size="lg" 
              fullWidth 
              onClick={handlePlaceOrder}
              isLoading={isSubmitting}
            >
              Place order
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
};
