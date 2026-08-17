import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus, MapPin } from 'lucide-react';
import { addressesApi } from '../services/addressesApi';
import { DeliveryAddress } from '../types';
import { AddressCard } from '../components/addresses/AddressCard';
import { AddressForm } from '../components/addresses/AddressForm';
import { Button } from '../components/common/Button';

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
      <div className="mb-8">
        <button onClick={() => window.history.back()} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
          Back to Account
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-[28px] font-semibold text-gray-900 mb-1">Delivery addresses</h1>
            <p className="text-[15px] text-gray-500">Manage your standard delivery addresses.</p>
          </div>
          
          {!isAdding && !editingAddress && (
            <Button onClick={() => setIsAdding(true)} className="hidden sm:flex items-center">
              Add address
            </Button>
          )}
        </div>
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
          <div className="text-center py-16 px-4 md:bg-white md:border md:border-gray-200 md:rounded-xl md:shadow-sm">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-[16px] font-medium text-gray-900 mb-1">No addresses saved</h3>
            <p className="text-[14px] text-gray-500 mb-6">Add an address for faster checkout on standard deliveries.</p>
            <Button onClick={() => setIsAdding(true)}>
              Add delivery address
            </Button>
          </div>
        )
      )}

      {!isAdding && !editingAddress && (
        <div className="mt-6 sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-10">
          <Button fullWidth onClick={() => setIsAdding(true)} className="shadow-none">
            Add address
          </Button>
        </div>
      )}
    </div>
  );
};
