import { fetchApi } from './api';
import { Order } from '../types';

export const ordersApi = {
  getOrders: async () => {
    const data = await fetchApi<{orders: Order[]}>('/orders');
    return data.orders;
  },
  
  getOrder: async (id: string) => {
    const data = await fetchApi<{order: Order}>(`/orders/${id}`);
    return data.order;
  },
  
  createOrder: async (orderData: Partial<Order>) => {
    const data = await fetchApi<{order: Order}>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return data.order;
  },

  getOrderTracking: (id: string) => {
    return fetchApi<any>(`/orders/${id}/tracking`);
  }
};
