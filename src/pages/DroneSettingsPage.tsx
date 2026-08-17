import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { locationsApi } from '../services/locationsApi';
import { DeliveryLocation } from '../types';
import { Button } from '../components/common/Button';

export const DroneSettingsPage: React.FC = () => {
  const [locations, setLocations] = useState<DeliveryLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const data = await locationsApi.getLocations();
      setLocations(data);
    } catch (err) {
      console.error('Failed to load locations', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this delivery location?')) return;
    try {
      await locationsApi.deleteLocation(id);
      fetchLocations();
    } catch (err) {
      console.error('Failed to delete location', err);
      alert('Failed to delete location. Please try again.');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await locationsApi.setDefaultLocation(id);
      fetchLocations();
    } catch (err) {
      console.error('Failed to set default location', err);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-6 md:py-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Saved Locations</h1>
          <p className="text-gray-500">Manage locations where you want to receive drone deliveries.</p>
        </div>
        <Link to="/settings/drone/location/new">
          <Button className="hidden sm:flex items-center gap-2 rounded-2xl h-12 shadow-md">
            <Plus className="w-5 h-5" /> Add location
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-5 mb-8 flex items-start gap-4 shadow-sm">
        {locations.length > 0 ? (
          <>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Ready for drone delivery</h3>
              <p className="text-sm text-gray-500 mt-1">You have verified locations ready to receive orders.</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Setup required</h3>
              <p className="text-sm text-gray-500 mt-1">You need to add a delivery location before you can use drone delivery.</p>
            </div>
          </>
        )}
      </div>

      <div className="space-y-5">
        {isLoading ? (
          <div className="animate-pulse space-y-5">
            <div className="h-40 bg-gray-100 rounded-3xl"></div>
            <div className="h-40 bg-gray-100 rounded-3xl"></div>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
              <MapPin className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No locations saved</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Set up a delivery location before choosing drone delivery at checkout.</p>
            <Link to="/settings/drone/location/new">
              <Button className="rounded-2xl h-12 shadow-md px-6">Add delivery location</Button>
            </Link>
          </div>
        ) : (
          locations.map(loc => (
            <div key={loc.id} className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-full md:w-48 h-36 bg-gray-100 rounded-2xl overflow-hidden shrink-0 relative border border-gray-200">
                <img src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${loc.longitude},${loc.latitude},18,0/400x400?access_token=pk.eyJ1IjoiZHVtbXkiLCJhIjoiY2R1bW15In0.dummy`} alt="Map thumbnail" className="w-full h-full object-cover" onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f8fafc'/%3E%3Cpath d='M50%25 50%25 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0' fill='%23e2e8f0'/%3E%3C/svg%3E";
                }}/>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-[3px] border-white shadow-md"></div>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">{loc.name}</h3>
                    {loc.isDefault && (
                      <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Default</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-500 mb-3">{loc.address || `GPS: ${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`}</p>
                <div className="flex items-center gap-2 text-sm font-bold text-green-600 mb-6 bg-green-50 w-max px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4" /> Verified Location
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-3">
                  <Button variant="outline" className="rounded-xl font-bold text-sm h-10 px-4">Edit</Button>
                  {!loc.isDefault && (
                    <Button variant="ghost" onClick={() => handleSetDefault(loc.id)} className="rounded-xl font-bold text-sm h-10 px-4 hover:bg-gray-50 text-gray-600">Set default</Button>
                  )}
                  <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto rounded-xl font-bold text-sm h-10 px-4 flex items-center gap-1.5" onClick={() => handleDelete(loc.id)}>
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6 sm:hidden fixed bottom-6 left-4 right-4 z-10">
        <Link to="/settings/drone/location/new">
          <Button className="w-full flex items-center justify-center gap-2 rounded-2xl h-14 text-lg shadow-lg">
            <Plus className="w-5 h-5" /> Add location
          </Button>
        </Link>
      </div>
    </div>
  );
};
