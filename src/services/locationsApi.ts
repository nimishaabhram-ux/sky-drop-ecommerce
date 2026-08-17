import { fetchApi } from './api';
import { DeliveryLocation, LocationImage } from '../types';

export const locationsApi = {
  getLocations: async () => {
    const data = await fetchApi<{locations: DeliveryLocation[]}>('/delivery-locations');
    return data.locations;
  },
  
  getLocation: async (id: string) => {
    const data = await fetchApi<{location: DeliveryLocation}>(`/delivery-locations/${id}`);
    return data.location;
  },
  
  createLocation: async (data: Partial<DeliveryLocation>) => {
    const res = await fetchApi<{location: DeliveryLocation}>('/delivery-locations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.location;
  },
  
  updateLocation: async (id: string, data: Partial<DeliveryLocation>) => {
    const res = await fetchApi<{location: DeliveryLocation}>(`/delivery-locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.location;
  },
  
  deleteLocation: (id: string) => {
    return fetchApi<{success: boolean}>(`/delivery-locations/${id}`, {
      method: 'DELETE',
    });
  },
  
  setDefaultLocation: async (id: string) => {
    const res = await fetchApi<{locations: DeliveryLocation[]}>(`/delivery-locations/${id}/set-default`, {
      method: 'POST',
    });
    return res.locations.find(l => l.id === id) as DeliveryLocation;
  },
  
  uploadImage: (locationId: string, image: Partial<LocationImage>) => {
    return fetchApi<LocationImage>(`/delivery-locations/${locationId}/images`, {
      method: 'POST',
      body: JSON.stringify(image),
    });
  }
};
