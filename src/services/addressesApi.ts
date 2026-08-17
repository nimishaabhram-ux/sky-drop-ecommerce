import { fetchApi } from './api';
import { DeliveryAddress } from '../types';

export const addressesApi = {
  getAll: async () => {
    const data = await fetchApi<{addresses: DeliveryAddress[]}>('/delivery-addresses');
    return data.addresses;
  },
  
  getById: async (id: string) => {
    const data = await fetchApi<{address: DeliveryAddress}>(`/delivery-addresses/${id}`);
    return data.address;
  },
  
  create: async (data: Partial<DeliveryAddress>) => {
    const res = await fetchApi<{address: DeliveryAddress}>('/delivery-addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.address;
  },
  
  update: async (id: string, data: Partial<DeliveryAddress>) => {
    const res = await fetchApi<{address: DeliveryAddress}>(`/delivery-addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.address;
  },
  
  remove: (id: string) => {
    return fetchApi<{success: boolean}>(`/delivery-addresses/${id}`, {
      method: 'DELETE',
    });
  },
  
  setDefault: async (id: string) => {
    const res = await fetchApi<{addresses: DeliveryAddress[]}>(`/delivery-addresses/${id}/set-default`, {
      method: 'POST',
    });
    return res.addresses.find(a => a.id === id) as DeliveryAddress;
  },
};
