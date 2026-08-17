import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Zap, Truck, ArrowRight } from 'lucide-react';
import { ordersApi } from '../services/ordersApi';
import { Order } from '../types';
import { formatCurrency } from '../utils/currency';
import { getEstimatedArrival } from '../utils/orderProgress';
import { OrderProgress } from '../components/orders/OrderProgress';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersApi.getOrders();
        setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const currentOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const pastOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED');
  const displayOrders = activeTab === 'current' ? currentOrders : pastOrders;

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-6 md:py-8 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
      <p className="text-gray-500 mb-8">View and track your recent orders.</p>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('current')}
          className={`pb-4 px-6 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'current' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Current Orders ({currentOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-4 px-6 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'past' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Past Orders ({pastOrders.length})
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} orders</h3>
          <p className="text-gray-500 mb-8">
            {activeTab === 'current' 
              ? "You don't have any active orders right now." 
              : "You haven't completed any orders yet."}
          </p>
          <Link to="/shop" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-md">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {displayOrders.map(order => (
            <CurrentOrderCard key={order.id} order={order} isPast={activeTab === 'past'} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Current / Past Order Card ──
const CurrentOrderCard: React.FC<{ order: Order; isPast: boolean }> = ({ order, isPast }) => {
  const isDrone = order.deliveryMethod === 'drone';
  const isActive = !['DELIVERED', 'CANCELLED', 'DELIVERY_FAILED'].includes(order.status);
  const eta = getEstimatedArrival(order);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 text-lg">Order #{order.id.slice(0, 8)}</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
              isDrone 
                ? 'bg-cyan-50 text-cyan-700 border-cyan-200' 
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {isDrone ? <Zap className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
              {isDrone ? 'Drone delivery' : 'Standard delivery'}
            </span>
          </div>
          {isPast && order.status === 'DELIVERED' && (
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
              Delivered
            </span>
          )}
          {isPast && order.status === 'CANCELLED' && (
            <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
              Cancelled
            </span>
          )}
        </div>

        {/* Date */}
        <p className="text-sm text-gray-500 font-medium mb-4">
          {isPast && order.status === 'DELIVERED' 
            ? `Delivered on ${new Date(order.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
            : `Placed ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
          }
        </p>

        {/* Product Thumbnails */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex -space-x-3">
            {order.items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="w-12 h-12 rounded-xl border-2 border-white bg-gray-50 overflow-hidden shadow-sm">
                <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover mix-blend-multiply" />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-12 h-12 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* ETA */}
        {isActive && eta && (
          <div className="mb-5 bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-xl">
            <p className="text-sm font-bold text-blue-800">{eta}</p>
          </div>
        )}

        {/* Order Progress (compact for list view) */}
        {!isPast && (
          <div className="mb-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order progress</p>
            <OrderProgress order={order} compact />
          </div>
        )}

        {/* Total + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <span className="text-lg font-black text-gray-900">{formatCurrency(order.totalAmount)}</span>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link 
              to={`/orders/${order.id}`}
              className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
            >
              View details
            </Link>
            {isActive && (
              <Link
                to={isDrone ? `/orders/${order.id}/track` : `/orders/${order.id}`}
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm ml-auto sm:ml-0"
              >
                Track order <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {isPast && order.status === 'DELIVERED' && (
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm ml-auto sm:ml-0"
              >
                Order again
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
