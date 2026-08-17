import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { ordersApi } from '../services/ordersApi';
import { Order } from '../types';
import { formatCurrency } from '../utils/currency';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersApi.getOrders();
        // Sort by date descending
        setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'DELIVERED') return <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-200">Delivered</span>;
    if (status === 'CANCELLED') return <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200">Cancelled</span>;
    return <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200">In Progress</span>;
  };

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
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-3xl"></div>
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
            <Link key={order.id} to={`/orders/${order.id}`} className="block group">
              <div className="bg-white rounded-3xl border border-gray-100 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-between items-start md:items-center">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-bold text-gray-900 text-lg">Order #{order.id.slice(0,8)}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      <span className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-12 h-12 rounded-full border-2 border-white bg-gray-50 overflow-hidden shadow-sm">
                          <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm z-10">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors ml-4 border border-gray-100 group-hover:border-blue-100">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
