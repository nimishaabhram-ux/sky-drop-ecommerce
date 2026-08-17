import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, Zap, MapPin, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ordersApi } from '../services/ordersApi';
import { Order } from '../types';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/currency';
import { getOrderProgress, getEstimatedArrival } from '../utils/orderProgress';
import { OrderProgress } from '../components/orders/OrderProgress';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchOrder = async () => {
      try {
        const data = await ordersApi.getOrder(id);
        setOrder(data);
      } catch (err) {
        console.error("Failed to load order", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto w-full animate-pulse">
        <div className="h-8 bg-gray-200 rounded-xl w-1/4 mb-8"></div>
        <div className="h-64 bg-gray-100 rounded-3xl mb-6"></div>
        <div className="h-48 bg-gray-100 rounded-3xl"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-4 py-20 text-center max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
        <p className="text-gray-500 mb-6">We couldn't find the order you're looking for.</p>
        <Link to="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const isDrone = order.deliveryMethod === 'drone';
  const isActive = !['DELIVERED', 'CANCELLED', 'DELIVERY_FAILED'].includes(order.status);
  const progress = getOrderProgress(order);
  const eta = getEstimatedArrival(order);

  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 md:py-8 min-h-screen">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            Order #{order.id.slice(0,8)}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
          isDrone 
            ? 'bg-cyan-50 text-cyan-700 border-cyan-200' 
            : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {isDrone ? <Zap className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
          {isDrone ? 'Drone delivery' : 'Standard delivery'}
        </span>
      </div>

      {/* Status Banner */}
      {isActive ? (
        <div className="mb-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-20">
            {isDrone ? <Zap className="w-64 h-64" /> : <Truck className="w-64 h-64" />}
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">{progress.currentLabel}</h3>
              <p className="text-blue-100 font-medium">{eta || progress.description}</p>
            </div>
            {isDrone && (
              <Link to={`/orders/${order.id}/track`} className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-gray-50 font-bold shadow-md rounded-2xl h-14 px-8 text-lg transition-colors">
                Track live <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      ) : order.status === 'DELIVERED' ? (
        <div className="mb-8 bg-green-50 rounded-3xl p-6 border border-green-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-900">Delivered successfully</h3>
            <p className="text-green-700 text-sm font-medium">
              Delivered on {new Date(order.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
            </p>
          </div>
        </div>
      ) : order.status === 'CANCELLED' ? (
        <div className="mb-8 bg-red-50 rounded-3xl p-6 border border-red-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900">Order cancelled</h3>
            <p className="text-red-700 text-sm font-medium">
              Cancelled on {new Date(order.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      ) : null}

      {/* Order Progress Timeline */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="font-bold text-gray-900 text-lg mb-6">Order Progress</h3>
        <OrderProgress order={order} showTimestamps />
      </div>

      {/* Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-gray-600" />
            </div>
            Delivery Location
          </h3>
          {order.deliveryLocation ? (
            <div className="ml-10">
              <p className="font-bold text-gray-900">{order.deliveryLocation.name}</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {order.deliveryLocation.address || `${order.deliveryLocation.latitude.toFixed(4)}, ${order.deliveryLocation.longitude.toFixed(4)}`}
              </p>
            </div>
          ) : order.deliveryAddress ? (
            <div className="ml-10">
              <p className="font-bold text-gray-900">{order.deliveryAddress.recipientName}</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {order.deliveryAddress.addressLine1}
                {order.deliveryAddress.addressLine2 && <><br />{order.deliveryAddress.addressLine2}</>}
                <br />{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}
              </p>
            </div>
          ) : (
            <div className="ml-10">
              <p className="font-bold text-gray-900">Delivery Address</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">Standard delivery address</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDrone ? 'bg-cyan-50' : 'bg-blue-50'}`}>
              {isDrone ? <Zap className="w-4 h-4 text-cyan-600" /> : <Truck className="w-4 h-4 text-blue-600" />}
            </div>
            Delivery Method
          </h3>
          <div className="ml-10">
            <p className="font-bold text-gray-900">{isDrone ? 'Drone Priority' : 'Standard Delivery'}</p>
            <p className="text-sm text-gray-500 mt-1">
              {isDrone 
                ? `Est. ${order.estimatedDeliveryMinutes} min delivery` 
                : `Est. delivery in ${order.estimatedDeliveryMinutes >= 1440 ? '1-2 days' : `${order.estimatedDeliveryMinutes} min`}`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm mb-8 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-400" /> Order Items ({order.items.length})
          </h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <li key={idx} className="p-4 sm:p-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 line-clamp-2">{item.product.name}</h4>
                <p className="text-sm text-gray-500 font-medium mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-gray-900">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Summary */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-6 text-lg">Payment Summary</h3>
        <div className="space-y-4 font-medium mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span className="text-gray-900">{formatCurrency(order.deliveryFee)}</span>
          </div>
          {order.dronePriorityFee > 0 && (
            <div className="flex justify-between text-cyan-700 bg-cyan-50 px-3 py-2 rounded-lg -mx-3">
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4"/> Drone Priority Fee</span>
              <span className="font-bold">{formatCurrency(order.dronePriorityFee)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span className="text-gray-900">{formatCurrency(order.tax)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <span className="font-bold text-gray-900 text-lg">Total Paid</span>
          <span className="text-3xl font-black text-gray-900">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};
