import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { ordersApi } from '../services/ordersApi';
import { Order } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (status === 'DELIVERED') return <Badge variant="success">Delivered</Badge>;
    if (status === 'CANCELLED') return <Badge variant="danger">Cancelled</Badge>;
    return <Badge variant="warning">In Progress</Badge>;
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Orders</h1>
      <p className="text-slate-600 mb-8">View and track your recent orders.</p>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-500 mb-6">Looks like you haven't placed any orders.</p>
          <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} to={`/orders/${order.id}`} className="block group">
              <Card className="hover:border-blue-300 transition-colors">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-start sm:items-center">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-slate-900">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-900">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                          <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 z-10">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors ml-auto sm:ml-2">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>

                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
