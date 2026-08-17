import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Edit } from 'lucide-react';
import { DeliveryLocation } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface DeliveryLocationSelectorProps {
  locations: DeliveryLocation[];
  selectedLocationId: string | null;
  onChange: (locationId: string) => void;
}

export const DeliveryLocationSelector: React.FC<DeliveryLocationSelectorProps> = ({
  locations,
  selectedLocationId,
  onChange,
}) => {
  if (locations.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <MapPin className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-slate-900 mb-2">No delivery locations saved</h4>
        <p className="text-sm text-slate-600 mb-4 max-w-sm mx-auto">
          Drone delivery requires a saved delivery location so we know where the drone can safely deliver your order.
        </p>
        <Link to="/settings/drone/location/new?checkout=true">
          <Button>Set up drone delivery</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {locations.map((loc) => (
        <Card 
          key={loc.id}
          className={`cursor-pointer transition-all border-2 ${
            selectedLocationId === loc.id 
              ? 'border-blue-600 shadow-sm ring-1 ring-blue-600 bg-white' 
              : 'border-slate-200 hover:border-blue-300 bg-white'
          }`}
          onClick={() => onChange(loc.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`mt-1 ${selectedLocationId === loc.id ? 'text-blue-600' : 'text-slate-400'}`}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900">{loc.name}</h4>
                  {loc.isDefault && (
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">Drone delivery location verified</p>
                <p className="text-xs text-slate-400 mt-1">Last checked: {new Date(loc.lastScannedAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            {selectedLocationId === loc.id && (
              <div className="flex items-center">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}

      <Link to="/settings/drone/location/new?checkout=true" className="block">
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors font-medium">
          <Plus className="w-4 h-4" /> Add delivery location
        </button>
      </Link>
    </div>
  );
};
