import { fetchApi } from './api';
import { DeliveryLocation, LocationImage } from '../types';

export const locationsApi = {
  getLocations: () => {
    return fetchApi<DeliveryLocation[]>('/delivery-locations');
  },
  
  getLocation: (id: string) => {
    return fetchApi<DeliveryLocation>(`/delivery-locations/${id}`);
  },
  
  createLocation: (data: Partial<DeliveryLocation>) => {
    return fetchApi<DeliveryLocation>('/delivery-locations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateLocation: (id: string, data: Partial<DeliveryLocation>) => {
    return fetchApi<DeliveryLocation>(`/delivery-locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  deleteLocation: (id: string) => {
    return fetchApi<{success: boolean}>(`/delivery-locations/${id}`, {
      method: 'DELETE',
    });
  },
  
  setDefaultLocation: (id: string) => {
    return fetchApi<DeliveryLocation>(`/delivery-locations/${id}/set-default`, {
      method: 'POST',
    });
  },
  
  uploadImage: (locationId: string, image: Partial<LocationImage>) => {
    return fetchApi<LocationImage>(`/delivery-locations/${locationId}/images`, {
      method: 'POST',
      body: JSON.stringify(image),
    });
  }
};
