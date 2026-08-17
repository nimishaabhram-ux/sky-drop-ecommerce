import React from 'react';
import { Truck, Zap } from 'lucide-react';
import { Card } from '../common/Card';

interface DeliveryMethodSelectorProps {
  selectedMethod: 'standard' | 'drone';
  onChange: (method: 'standard' | 'drone') => void;
  isDroneAvailable: boolean;
}

export const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({ 
  selectedMethod, 
  onChange, 
  isDroneAvailable 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Standard Delivery */}
      <Card 
        className={`cursor-pointer transition-all border-2 ${
          selectedMethod === 'standard' 
            ? 'border-blue-600 bg-blue-50/30 shadow-md ring-1 ring-blue-600' 
            : 'border-slate-200 hover:border-blue-300'
        }`}
        onClick={() => onChange('standard')}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full mt-1 ${selectedMethod === 'standard' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
            <Truck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold text-slate-900">Standard Delivery</h4>
              <span className="font-medium text-slate-900">$4.99</span>
            </div>
            <p className="text-sm text-slate-500">Arrives in 30–45 minutes.</p>
          </div>
        </div>
      </Card>

      {/* Drone Delivery */}
      <Card 
        className={`transition-all border-2 ${
          !isDroneAvailable 
            ? 'opacity-60 cursor-not-allowed border-slate-200 bg-slate-50' 
            : selectedMethod === 'drone'
              ? 'border-cyan-600 bg-cyan-50/30 shadow-md ring-1 ring-cyan-600 cursor-pointer'
              : 'border-slate-200 hover:border-cyan-300 cursor-pointer'
        }`}
        onClick={() => isDroneAvailable && onChange('drone')}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full mt-1 ${selectedMethod === 'drone' ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-500'}`}>
            <Zap className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold text-slate-900">Drone Delivery</h4>
              <span className="font-medium text-slate-900">$9.99</span>
            </div>
            {isDroneAvailable ? (
              <p className="text-sm text-slate-500">Arrives in 8–15 minutes.</p>
            ) : (
              <p className="text-sm text-amber-600">Unavailable for this order.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
