import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { locationsApi } from '../services/locationsApi';
import { DeliveryLocation } from '../types';
import { Card } from '../components/common/Card';
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
    <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Drone delivery</h1>
          <p className="text-slate-600">Manage locations where you want to receive drone deliveries.</p>
        </div>
        <Link to="/settings/drone/location/new">
          <Button className="hidden sm:flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add location
          </Button>
        </Link>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        {locations.length > 0 ? (
          <>
            <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-slate-900">Ready for drone delivery</h3>
              <p className="text-sm text-slate-600">You have verified locations ready to receive orders.</p>
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-slate-900">Setup required</h3>
              <p className="text-sm text-slate-600">You need to add a delivery location before you can use drone delivery.</p>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-slate-100 rounded-xl"></div>
            <div className="h-32 bg-slate-100 rounded-xl"></div>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No locations saved</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Set up a delivery location before choosing drone delivery at checkout.</p>
            <Link to="/settings/drone/location/new">
              <Button>Add delivery location</Button>
            </Link>
          </div>
        ) : (
          locations.map(loc => (
            <Card key={loc.id} className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-32 h-32 bg-slate-100 rounded-lg overflow-hidden shrink-0 relative">
                {/* Mock map thumbnail */}
                <img src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${loc.longitude},${loc.latitude},18,0/400x400?access_token=pk.eyJ1IjoiZHVtbXkiLCJhIjoiY2R1bW15In0.dummy`} alt="Map thumbnail" className="w-full h-full object-cover" onError={(e) => {
                  // Fallback if mapbox fails
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Cpath d='M50%25 50%25 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0' fill='%23cbd5e1'/%3E%3C/svg%3E";
                }}/>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{loc.name}</h3>
                    {loc.isDefault && (
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Default</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-2">{loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}</p>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600 mb-4">
                  <ShieldCheck className="w-4 h-4" /> Verified for drone delivery
                </div>
                <div className="mt-auto flex flex-wrap gap-3">
                  <Button variant="outline" size="sm">Edit</Button>
                  {!loc.isDefault && (
                    <Button variant="ghost" size="sm" onClick={() => handleSetDefault(loc.id)}>Set default</Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto" onClick={() => handleDelete(loc.id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {/* Mobile add button */}
      <div className="mt-6 sm:hidden">
        <Link to="/settings/drone/location/new">
          <Button fullWidth className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add delivery location
          </Button>
        </Link>
      </div>
    </div>
  );
};
