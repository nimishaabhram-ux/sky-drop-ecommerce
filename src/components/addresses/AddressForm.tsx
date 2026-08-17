import React, { useState } from 'react';
import { DeliveryAddress } from '../../types';
import { Button } from '../common/Button';

interface AddressFormProps {
  initialData?: Partial<DeliveryAddress>;
  onSubmit: (data: Partial<DeliveryAddress>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState<Partial<DeliveryAddress>>({
    label: 'Home',
    recipientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false,
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {initialData?.id ? 'Edit Address' : 'Add New Address'}
      </h3>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Save as</label>
          <div className="flex gap-4">
            {['Home', 'Work', 'Other'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="label" 
                  value={type} 
                  checked={formData.label === type}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Recipient Name *</label>
          <input 
            type="text" 
            name="recipientName" 
            value={formData.recipientName || ''} 
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
          />
        </div>

        <div className="col-span-1">
          <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Phone Number *</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone || ''} 
            onChange={handleChange}
            required
            placeholder="+91"
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Address Line 1 *</label>
          <input 
            type="text" 
            name="addressLine1" 
            value={formData.addressLine1 || ''} 
            onChange={handleChange}
            required
            placeholder="Flat, House no., Building, Company, Apartment"
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Address Line 2</label>
          <input 
            type="text" 
            name="addressLine2" 
            value={formData.addressLine2 || ''} 
            onChange={handleChange}
            placeholder="Area, Street, Sector, Village"
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Landmark</label>
          <input 
            type="text" 
            name="landmark" 
            value={formData.landmark || ''} 
            onChange={handleChange}
            placeholder="E.g. near Apollo Hospital"
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
          />
        </div>

        <div className="col-span-1">
          <label className="block text-[14px] font-medium text-gray-700 mb-1.5">PIN Code *</label>
          <input 
            type="text" 
            name="postalCode" 
            value={formData.postalCode || ''} 
            onChange={handleChange}
            required
            maxLength={6}
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
          />
        </div>

        <div className="col-span-1">
          <label className="block text-[14px] font-medium text-gray-700 mb-1.5">City *</label>
          <input 
            type="text" 
            name="city" 
            value={formData.city || ''} 
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
          />
        </div>

        <div className="col-span-1">
          <label className="block text-[14px] font-medium text-gray-700 mb-1.5">State *</label>
          <select 
            name="state" 
            value={formData.state || ''} 
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          >
            <option value="">Select State</option>
            <option value="Kerala">Kerala</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>
        
        <div className="col-span-1 sm:col-span-2 mt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="isDefault"
              checked={formData.isDefault || false}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">Make this my default delivery address</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </Button>
        <Button 
          variant="secondary"
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
