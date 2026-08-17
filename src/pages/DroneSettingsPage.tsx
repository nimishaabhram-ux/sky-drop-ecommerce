import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Plus, MoreVertical, CheckCircle2, ChevronLeft } from 'lucide-react';
import { locationsApi } from '../services/locationsApi';
import { DeliveryLocation } from '../types';
import { Button } from '../components/common/Button';

export const DroneSettingsPage: React.FC = () => {
  const [locations, setLocations] = useState<DeliveryLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
    
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this delivery location?')) return;
    try {
      await locationsApi.deleteLocation(id);
      fetchLocations();
    } catch (err) {
      console.error('Failed to delete location', err);
      alert('Failed to delete location. Please try again.');
    }
  };

  const handleSetDefault = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await locationsApi.setDefaultLocation(id);
      fetchLocations();
    } catch (err) {
      console.error('Failed to set default location', err);
    }
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-6 md:py-10 min-h-screen bg-white md:bg-transparent">
      
      <div className="mb-8">
        <button onClick={() => navigate('/account')} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Account
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-[28px] font-semibold text-gray-900 mb-1">Drone delivery</h1>
            <p className="text-[15px] text-gray-500">Manage locations where you receive drone deliveries.</p>
          </div>
          <Link to="/settings/drone/location/new" className="w-full sm:w-auto mt-2 sm:mt-0">
            <Button className="w-full sm:w-auto flex justify-center items-center">
              Add location
            </Button>
          </Link>
        </div>
      </div>

      <div className="md:bg-white">
        
        {isLoading ? (
          <div className="animate-pulse p-6">
            <div className="h-20 bg-gray-100 rounded-lg mb-4"></div>
            <div className="h-20 bg-gray-100 rounded-lg"></div>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-[16px] font-medium text-gray-900 mb-1">No locations saved</h3>
            <p className="text-[14px] text-gray-500 mb-6">Add a location to use drone delivery at checkout.</p>
            <Link to="/settings/drone/location/new">
              <Button>Add delivery location</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {locations.map(loc => (
              <div key={loc.id} className="p-4 md:p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-[16px] font-semibold text-gray-900">{loc.name}</h3>
                    {loc.isDefault && (
                      <span className="text-[12px] font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">Default</span>
                    )}
                  </div>
                  
                  <p className="text-[14px] text-gray-600 mb-3">{loc.address || `GPS: ${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-[13px]">
                    <div className="flex items-center gap-1.5 text-green-700 whitespace-nowrap">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="font-medium">Ready for drone delivery</span>
                    </div>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <div className="flex items-center gap-1.5 text-gray-500 whitespace-nowrap">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 sm:hidden"></div>
                      <span>{loc.images ? loc.images.length : 0} surroundings photos</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 md:mt-0 justify-start md:justify-end relative">
                  <Button variant="outline" onClick={() => navigate('/settings/drone/location/new')} className="h-9 px-3 text-[13px] bg-white">Edit</Button>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => toggleMenu(loc.id, e)}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {openMenuId === loc.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 overflow-hidden">
                        {!loc.isDefault && (
                          <button 
                            onClick={(e) => handleSetDefault(loc.id, e)}
                            className="w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Set as default
                          </button>
                        )}
                        <button 
                          onClick={(e) => handleDelete(loc.id, e)}
                          className="w-full text-left px-4 py-2 text-[14px] text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Removed fixed mobile Add Location button. It is now part of the normal header flow. */}
    </div>
  );
};
