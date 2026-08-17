import React from 'react';
import { MapPin, Phone, User, Edit2, Trash2 } from 'lucide-react';
import { DeliveryAddress } from '../../types';

interface AddressCardProps {
  address: DeliveryAddress;
  onEdit?: (address: DeliveryAddress) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (address: DeliveryAddress) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({ 
  address, 
  onEdit, 
  onDelete, 
  onSetDefault,
  selectable = false,
  selected = false,
  onSelect
}) => {
  return (
    <div 
      className={`bg-white border rounded-2xl p-5 transition-all relative ${
        selectable && onSelect ? 'cursor-pointer hover:border-blue-300' : ''
      } ${
        selected ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/20' : 'border-gray-200'
      }`}
      onClick={() => {
        if (selectable && onSelect) onSelect(address);
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${selected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
            <MapPin className="w-4 h-4" />
          </div>
          <span className="font-bold text-gray-900">{address.label}</span>
          {address.isDefault && (
            <span className="text-[10px] font-bold tracking-wider uppercase bg-gray-900 text-white px-2 py-0.5 rounded">
              Default
            </span>
          )}
        </div>
        
        {!selectable && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(address); }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit address"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(address.id); }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1.5 text-sm text-gray-600 ml-9">
        <p className="flex items-center gap-2 text-gray-900 font-medium">
          <User className="w-3.5 h-3.5 text-gray-400" />
          {address.recipientName}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          {address.phone}
        </p>
        <div className="pt-2 text-gray-700 leading-relaxed">
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          {address.landmark && <p className="text-gray-500 italic">Landmark: {address.landmark}</p>}
          <p>{address.city}, {address.state} {address.postalCode}</p>
        </div>
      </div>

      {!selectable && !address.isDefault && onSetDefault && (
        <button 
          onClick={(e) => { e.stopPropagation(); onSetDefault(address.id); }}
          className="mt-4 ml-9 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Set as default
        </button>
      )}
    </div>
  );
};
