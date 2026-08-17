import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, AlertCircle, Zap, Truck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { locationsApi } from '../services/locationsApi';
import { ordersApi } from '../services/ordersApi';
import { DeliveryLocation } from '../types';
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
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/cart" className="hover:text-gray-900">Cart</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-gray-900 font-medium">Checkout</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column - Checkout Flow */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8">
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* 1. Contact Information */}
          <section className="bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
              Contact Details
            </h2>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input type="email" defaultValue="customer@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                <input type="text" defaultValue="Alex" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                <input type="text" defaultValue="Smith" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors" />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
                <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors" />
              </div>
            </div>
          </section>

          {/* 2. Delivery Method */}
          <section className="bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
              Delivery Method
            </h2>
            
            {!isDroneEligible && (
              <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p><strong>Drone delivery isn't available for this order.</strong> One or more items exceed the supported delivery size or weight.</p>
              </div>
            )}
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div 
                className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                  deliveryMethod === 'standard' 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => setDeliveryMethod('standard')}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className={`w-5 h-5 ${deliveryMethod === 'standard' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-bold ${deliveryMethod === 'standard' ? 'text-blue-900' : 'text-gray-700'}`}>Standard</span>
                  </div>
                  <span className={`font-bold ${deliveryMethod === 'standard' ? 'text-blue-900' : 'text-gray-700'}`}>$4.99</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Delivery in 30-45 minutes. Delivered by courier to your door.</p>
              </div>

              <div 
                className={`border-2 rounded-2xl p-5 transition-all ${
                  !isDroneEligible 
                    ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50' 
                    : deliveryMethod === 'drone'
                      ? 'border-cyan-500 bg-cyan-50/50 cursor-pointer'
                      : 'border-gray-200 hover:border-cyan-300 cursor-pointer bg-white'
                }`}
                onClick={() => isDroneEligible && setDeliveryMethod('drone')}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-5 h-5 ${deliveryMethod === 'drone' ? 'text-cyan-600' : 'text-gray-400'}`} />
                    <span className={`font-bold ${deliveryMethod === 'drone' ? 'text-cyan-900' : 'text-gray-700'}`}>Drone Drop</span>
                  </div>
                  <span className={`font-bold ${deliveryMethod === 'drone' ? 'text-cyan-900' : 'text-gray-700'}`}>$9.99</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Delivery in 10-15 minutes. Delivered by drone to your saved location.</p>
              </div>
            </div>
          </section>

          {/* 3. Delivery Location */}
          <section className="bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">3</span>
              {deliveryMethod === 'drone' ? 'Delivery Location' : 'Delivery Address'}
            </h2>
            
            {deliveryMethod === 'drone' ? (
              isLoadingLocations ? (
                <div className="animate-pulse bg-gray-100 h-32 rounded-2xl"></div>
              ) : locations.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {locations.map(loc => (
                    <div 
                      key={loc.id}
                      className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                        selectedLocationId === loc.id 
                          ? 'border-cyan-500 bg-cyan-50/50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedLocationId(loc.id)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className={`w-5 h-5 ${selectedLocationId === loc.id ? 'text-cyan-600' : 'text-gray-400'}`} />
                        <span className={`font-bold ${selectedLocationId === loc.id ? 'text-cyan-900' : 'text-gray-900'}`}>
                          {loc.name}
                        </span>
                        {loc.isDefault && (
                          <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 ml-8">{loc.address}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">You don't have any saved drone delivery locations.</p>
                  <Link to="/settings/drone/location/new" className="text-cyan-600 font-medium hover:underline">
                    Add a location now
                  </Link>
                </div>
              )
            ) : (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                  <input type="text" defaultValue="123 Example Street" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input type="text" defaultValue="San Francisco" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors" />
                </div>
              </div>
            )}
          </section>

          {/* 4. Payment */}
          <section className="bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">4</span>
              Payment
            </h2>
            <div className="flex items-center gap-4 p-5 border-2 border-blue-600 bg-blue-50/30 rounded-2xl mb-4">
              <div className="w-5 h-5 rounded-full border-[5px] border-blue-600"></div>
              <div>
                <p className="font-bold text-gray-900">Credit Card ending in 4242</p>
                <p className="text-sm text-gray-500 mt-0.5">Exp: 12/28</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-4 justify-center md:justify-start">
              <ShieldCheck className="w-4 h-4 text-green-500" /> Payments are secure and encrypted.
            </p>
          </section>

        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="max-h-64 overflow-y-auto pr-2 mb-6 space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2">{item.product.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax</span>
                <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-900">${deliveryFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="text-3xl font-black text-gray-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full rounded-2xl h-14 text-lg shadow-md"
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
