import { fetchApi } from './api';
import { Order } from '../types';

export const ordersApi = {
  getOrders: () => {
    return fetchApi<Order[]>('/orders');
  },
  
  getOrder: (id: string) => {
    return fetchApi<Order>(`/orders/${id}`);
  },
  
  createOrder: (orderData: Partial<Order>) => {
    return fetchApi<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getOrderTracking: (id: string) => {
    return fetchApi<any>(`/orders/${id}/tracking`);
  }
};
