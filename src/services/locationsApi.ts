import { DeliveryLocation, LocationImage } from '../types';
import { INITIAL_LOCATIONS } from '../data/mockData';

const STORAGE_KEY = 'abay_locations';

// Helper to get locations from local storage
const getStoredLocations = (): DeliveryLocation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse stored locations', e);
  }
  
  // Seed with initial locations if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOCATIONS));
  return INITIAL_LOCATIONS;
};

// Helper to save locations to local storage
const saveLocations = (locations: DeliveryLocation[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
};

export const locationsApi = {
  getLocations: async () => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 400));
    return getStoredLocations();
  },
  
  getLocation: async (id: string) => {
    await new Promise(r => setTimeout(r, 200));
    const locations = getStoredLocations();
    return locations.find(l => l.id === id) || null;
  },
  
  createLocation: async (data: Partial<DeliveryLocation>) => {
    await new Promise(r => setTimeout(r, 600));
    const locations = getStoredLocations();
    const newLoc = {
      id: `loc-${Date.now()}`,
      userId: 'user-001',
      status: data.status || 'verified',
      isDefault: locations.length === 0,
      clearanceScore: data.clearanceScore || 96,
      imagesCount: data.imagesCount || 0,
      groundSurface: data.groundSurface || 'grass',
      overheadHazards: data.overheadHazards || [],
      lastScannedAt: new Date().toISOString(),
      ...data,
    } as DeliveryLocation;
    
    locations.unshift(newLoc);
    saveLocations(locations);
    return newLoc;
  },
  
  updateLocation: async (id: string, data: Partial<DeliveryLocation>) => {
    await new Promise(r => setTimeout(r, 400));
    const locations = getStoredLocations();
    const idx = locations.findIndex(l => l.id === id);
    if (idx === -1) throw new Error('Location not found');
    
    locations[idx] = { ...locations[idx], ...data, updatedAt: new Date().toISOString() };
    saveLocations(locations);
    return locations[idx];
  },
  
  deleteLocation: async (id: string) => {
    await new Promise(r => setTimeout(r, 400));
    let locations = getStoredLocations();
    locations = locations.filter(l => l.id !== id);
    saveLocations(locations);
    return { success: true };
  },
  
  setDefaultLocation: async (id: string) => {
    await new Promise(r => setTimeout(r, 300));
    const locations = getStoredLocations().map(l => ({
      ...l,
      isDefault: l.id === id,
    }));
    saveLocations(locations);
    return locations.find(l => l.id === id) as DeliveryLocation;
  },
  
  uploadImage: async (locationId: string, image: Partial<LocationImage>) => {
    await new Promise(r => setTimeout(r, 800));
    // Since images are large base64 strings, we don't store them in localStorage
    // to avoid QuotaExceeded errors. We just simulate success and update the count.
    const locations = getStoredLocations();
    const loc = locations.find(l => l.id === locationId);
    if (loc) {
      loc.imagesCount = (loc.imagesCount || 0) + 1;
      saveLocations(locations);
    }
    return { success: true } as unknown as LocationImage;
  }
};
