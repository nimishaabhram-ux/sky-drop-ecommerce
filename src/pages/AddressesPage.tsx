import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus, MapPin } from 'lucide-react';
import { addressesApi } from '../services/addressesApi';
import { DeliveryAddress } from '../types';
import { AddressCard } from '../components/addresses/AddressCard';
import { AddressForm } from '../components/addresses/AddressForm';

export const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await addressesApi.getAll();
      setAddresses(data);
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreate = async (data: Partial<DeliveryAddress>) => {
    setIsSubmitting(true);
    try {
      await addressesApi.create(data);
      setIsAdding(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: Partial<DeliveryAddress>) => {
    if (!editingAddress) return;
    setIsSubmitting(true);
    try {
      await addressesApi.update(editingAddress.id, data);
      setEditingAddress(null);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressesApi.remove(id);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressesApi.setDefault(id);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-6 md:py-10">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/account" className="hover:text-gray-900">Account</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-gray-900 font-medium">Saved Addresses</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Addresses</h1>
          <p className="text-gray-600">Manage your standard delivery addresses</p>
        </div>
        
        {!isAdding && !editingAddress && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-10">
          <AddressForm 
            onSubmit={handleCreate} 
            onCancel={() => setIsAdding(false)} 
            isSubmitting={isSubmitting} 
          />
        </div>
      )}

      {editingAddress && (
        <div className="mb-10">
          <AddressForm 
            initialData={editingAddress} 
            onSubmit={handleUpdate} 
            onCancel={() => setEditingAddress(null)} 
            isSubmitting={isSubmitting} 
          />
        </div>
      )}

      {!isAdding && !editingAddress && (
        isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse bg-gray-100 h-48 rounded-2xl"></div>
            ))}
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map(address => (
              <AddressCard 
                key={address.id} 
                address={address} 
                onEdit={setEditingAddress}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
              <MapPin className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-gray-500 mb-6">Add an address for faster checkout on standard deliveries.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-white border border-gray-200 text-gray-900 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Add your first address
            </button>
          </div>
        )
      )}
    </div>
  );
};
