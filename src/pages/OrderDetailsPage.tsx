import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, Zap, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { ordersApi } from '../services/ordersApi';
import { Order } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

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
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-slate-100 rounded-xl mb-6"></div>
        <div className="h-48 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-4 py-20 text-center max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order not found</h2>
        <p className="text-slate-600 mb-6">We couldn't find the order you're looking for.</p>
        <Link to="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const isDrone = order.deliveryMethod === 'drone';
  const isTrackingAvailable = !['DELIVERED', 'CANCELLED', 'DELIVERY_FAILED'].includes(order.status);

  return (
    <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto w-full">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            Order {order.id}
          </h1>
          <p className="text-slate-500 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'} className="text-sm px-3 py-1">
          {order.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      {/* Tracking Call to action */}
      {isTrackingAvailable && (
        <Card className="mb-8 border-blue-200 bg-blue-50/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            {isDrone ? <Zap className="w-32 h-32 text-blue-600" /> : <Truck className="w-32 h-32 text-blue-600" />}
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {isDrone ? 'Drone is preparing for flight' : 'Order is on the way'}
              </h3>
              <p className="text-slate-600">Track your delivery in real-time on the map.</p>
            </div>
            <Link to={`/orders/${order.id}/track`}>
              <Button className="shrink-0 flex items-center gap-2 shadow-md">
                Track order <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Delivery Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-400" /> Delivery Address
          </h3>
          {order.deliveryLocation ? (
            <div>
              <p className="font-medium text-slate-900">{order.deliveryLocation.name}</p>
              <p className="text-sm text-slate-600 mt-1">
                {order.deliveryLocation.latitude.toFixed(6)}, {order.deliveryLocation.longitude.toFixed(6)}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-medium text-slate-900">Standard Address</p>
              <p className="text-sm text-slate-600 mt-1">123 Example Street<br/>San Francisco, CA</p>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            {isDrone ? <Zap className="w-5 h-5 text-slate-400" /> : <Truck className="w-5 h-5 text-slate-400" />}
            Delivery Method
          </h3>
          <div>
            <p className="font-medium text-slate-900">{isDrone ? 'Drone Delivery' : 'Standard Delivery'}</p>
            <p className="text-sm text-slate-600 mt-1">
              Estimated time: {order.estimatedDeliveryMinutes} minutes
            </p>
          </div>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="mb-8" noPadding>
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-400" /> Order Items
          </h3>
        </div>
        <ul className="divide-y divide-slate-100">
          {order.items.map((item, idx) => (
            <li key={idx} className="p-4 sm:p-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 truncate">{item.product.name}</h4>
                <p className="text-sm text-slate-500 mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-medium text-slate-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Receipt */}
      <Card>
        <h3 className="font-semibold text-slate-900 mb-4">Payment Summary</h3>
        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="text-slate-900">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee</span>
            <span className="text-slate-900">${order.deliveryFee.toFixed(2)}</span>
          </div>
          {order.dronePriorityFee > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Drone Priority Fee</span>
              <span className="text-slate-900">${order.dronePriorityFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Tax</span>
            <span className="text-slate-900">${order.tax.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="font-bold text-slate-900">Total</span>
          <span className="text-xl font-bold text-slate-900">${order.totalAmount.toFixed(2)}</span>
        </div>
      </Card>
    </div>
  );
};
