import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Plane, 
  Truck, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  CreditCard, 
  Check, 
  Zap,
  Weight
} from 'lucide-react';
import { CartItem, DeliveryLocation, Order, Product, User } from '../types';
import { sound } from '../services/audio';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  locations: DeliveryLocation[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onStartSetup: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  locations,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onStartSetup,
  onOrderPlaced,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'drone' | 'standard'>('drone');
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    locations.find((l) => l.isDefault)?.id || locations[0]?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'google_pay'>('apple_pay');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderNotes, setOrderNotes] = useState<string>('Autonomous precision descent to verified landing zone.');

  if (!isOpen) return null;

  const totalWeightGrams = cart.reduce((sum, item) => sum + item.product.weightGrams * item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const dronePriorityFee = deliveryMethod === 'drone' ? 3.99 : 0;
  const standardDeliveryFee = deliveryMethod === 'standard' ? 4.99 : 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const totalAmount = +(subtotal + dronePriorityFee + standardDeliveryFee + tax).toFixed(2);

  const selectedLocation = locations.find((l) => l.id === selectedLocationId) || locations[0];
  const isDroneLocationValid = Boolean(selectedLocation && selectedLocation.status === 'verified');

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (deliveryMethod === 'drone' && !isDroneLocationValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cart,
        deliveryMethod,
        deliveryLocationId: selectedLocation?.id,
        subtotal,
        totalWeightGrams,
        totalAmount,
        deliveryNotes: orderNotes,
        paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      sound.playOrderConfirmed();
      
      onClearCart();
      onClose();
      onOrderPlaced(data.order);
    } catch (e) {
      console.error('Failed to create order on server', e);
      // Fallback client order creation
      const localOrder: Order = {
        id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        userId: 'user-001',
        items: [...cart],
        deliveryMethod,
        deliveryLocationId: selectedLocation?.id,
        deliveryLocation: selectedLocation,
        totalWeightGrams,
        subtotal,
        deliveryFee: standardDeliveryFee,
        dronePriorityFee,
        tax,
        totalAmount,
        status: 'ORDER_PROCESSING',
        estimatedDeliveryMinutes: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        trackingNumber: `SKY-FLX-${Math.floor(1000 + Math.random() * 9000)}`,
        droneId: 'FALCON-X9',
        deliveryNotes: orderNotes,
        paymentMethod,
      };
      sound.playOrderConfirmed();
      onClearCart();
      onClose();
      onOrderPlaced(localOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0E0E11] border border-white/20 w-full max-w-2xl rounded-sm overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white"></span>
            <span className="text-xs font-mono-tech uppercase tracking-[0.3em] font-bold text-white">
              FLIGHT CHECKOUT // CARGO DISPATCH
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Cart items list */}
          {cart.length === 0 ? (
            <div className="p-8 border border-white/10 text-center space-y-3 rounded-sm">
              <Plane className="w-8 h-8 text-neutral-500 mx-auto" />
              <p className="text-sm text-neutral-300 font-bold uppercase tracking-wider">Flight cargo bay is empty</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white text-black text-xs font-black uppercase tracking-wider rounded-sm hover:bg-neutral-200"
              >
                Browse Payloads
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-tech text-neutral-400">
                <span>ITEMS ({cart.length})</span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <Weight className="w-3.5 h-3.5" />
                  TOTAL CARGO: {totalWeightGrams}g / 2500g MAX
                </span>
              </div>

              <div className="divide-y divide-white/10 border border-white/10 bg-white/5 rounded-sm">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-3 flex items-center justify-between gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-sm object-cover grayscale contrast-125 shrink-0 border border-white/10"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                      <div className="text-[11px] font-mono-tech text-neutral-400">
                        ${item.product.price.toFixed(2)} × {item.quantity} = ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-white/20 rounded-sm">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-neutral-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono-tech font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-neutral-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cart.length > 0 && (
            <>
              {/* Delivery Method Selection */}
              <div className="space-y-3">
                <div className="text-xs font-mono-tech uppercase tracking-wider text-neutral-400 font-bold">
                  SELECT DELIVERY METHOD
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Drone Delivery Option */}
                  <div
                    onClick={() => setDeliveryMethod('drone')}
                    className={`p-4 border rounded-sm cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                      deliveryMethod === 'drone'
                        ? 'border-cyan-400 bg-cyan-950/20 text-white shadow-lg'
                        : 'border-white/10 bg-[#0E0E11] text-neutral-400 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-cyan-400 text-black flex items-center justify-center rounded-sm font-bold">
                          <Plane className="w-4 h-4 -rotate-45" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-white">
                          AERO DRONE DROP
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-tech text-cyan-300 font-bold">
                        ~6-10 MINS
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Autonomous point-to-point flight directly to your verified landing zone.
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs font-mono-tech border-t border-white/10 pt-2">
                      <span className="text-cyan-400 font-bold">PRIORITY AIRDROPS</span>
                      <span className="text-white font-bold">+$3.99</span>
                    </div>
                  </div>

                  {/* Standard Delivery Option */}
                  <div
                    onClick={() => setDeliveryMethod('standard')}
                    className={`p-4 border rounded-sm cursor-pointer transition-all flex flex-col justify-between ${
                      deliveryMethod === 'standard'
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/10 bg-[#0E0E11] text-neutral-400 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-white/10 text-white flex items-center justify-center rounded-sm">
                          <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-white">
                          GROUND COURIER
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-tech text-neutral-400">
                        ~45 MINS
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Standard ground vehicle van transit to front curb.
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs font-mono-tech border-t border-white/10 pt-2">
                      <span className="text-neutral-400">STANDARD FEE</span>
                      <span className="text-white font-bold">+$4.99</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drone Delivery Location Section */}
              {deliveryMethod === 'drone' && (
                <div className="space-y-3 border border-white/10 p-4 bg-[#0A0A0B] rounded-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tech uppercase font-bold text-neutral-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      REGISTERED DRONE LANDING ZONE
                    </span>
                    <button
                      onClick={onStartSetup}
                      className="text-xs font-mono-tech uppercase text-cyan-400 hover:underline font-bold"
                    >
                      + Scan New LZ
                    </button>
                  </div>

                  {locations.length === 0 ? (
                    <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-sm space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase">
                        <AlertTriangle className="w-4 h-4" />
                        <span>No Drone Delivery Landing Zone Registered</span>
                      </div>
                      <p className="text-xs text-neutral-300">
                        Autonomous drone drops require a verified 3-meter GPS landing zone scan before placing orders.
                      </p>
                      <button
                        onClick={onStartSetup}
                        className="px-4 py-2 bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-sm hover:bg-amber-300 transition-colors"
                      >
                        Configure Drone Landing Location Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {locations.map((loc) => {
                        const isSelected = loc.id === selectedLocationId;
                        return (
                          <div
                            key={loc.id}
                            onClick={() => setSelectedLocationId(loc.id)}
                            className={`p-3 border rounded-sm cursor-pointer flex items-center justify-between gap-3 transition-all ${
                              isSelected
                                ? 'border-cyan-400 bg-cyan-950/20'
                                : 'border-white/10 hover:border-white/30 bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-neutral-500'
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white">{loc.name}</span>
                                  {loc.status === 'verified' && (
                                    <span className="text-[9px] font-mono-tech px-1 bg-emerald-500/20 text-emerald-300 uppercase">
                                      VERIFIED ({loc.clearanceScore}%)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] font-mono-tech text-neutral-400">
                                  GPS: {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)} (±{loc.gpsAccuracy}m) • {loc.groundSurface}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartSetup();
                              }}
                              className="text-[10px] font-mono-tech uppercase text-neutral-400 hover:text-white px-2 py-1 border border-white/10"
                            >
                              Edit / Rescan
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Order Cost Breakdown */}
              <div className="border-t border-white/10 pt-4 space-y-2 font-mono-tech text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>SUBTOTAL</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {deliveryMethod === 'drone' ? (
                  <div className="flex justify-between text-cyan-300">
                    <span>DRONE RAPID AIRDROP FEE</span>
                    <span>${dronePriorityFee.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-neutral-400">
                    <span>GROUND COURIER DELIVERY</span>
                    <span>${standardDeliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>ESTIMATED TAX</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white border-t border-white/10 pt-2">
                  <span className="font-display-bold uppercase">TOTAL PAYLOAD AMOUNT</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-[#0A0A0B] flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-white/20 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:border-white rounded-sm"
            >
              Cancel
            </button>

            <button
              id="confirm-place-order-btn"
              disabled={isSubmitting || (deliveryMethod === 'drone' && !isDroneLocationValid)}
              onClick={handlePlaceOrder}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all shadow-xl ${
                deliveryMethod === 'drone' && !isDroneLocationValid
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-white/10'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isSubmitting ? (
                <span>Transmitting Flight Data...</span>
              ) : (
                <>
                  <span>Confirm & Deploy Drop</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
