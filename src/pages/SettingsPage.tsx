import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 md:py-8 min-h-screen">
      <Link to="/account" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Settings</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your preferences and account details.</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} className="hidden sm:flex items-center gap-2 rounded-xl h-12 shadow-sm px-6">
          <Save className="w-4 h-4" /> Save changes
        </Button>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Email</label>
                <input type="email" defaultValue="alex.smith@example.com" disabled className="w-full px-5 py-4 border border-gray-200 bg-gray-50 rounded-2xl text-gray-500 font-medium opacity-70" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">First name</label>
                <input type="text" defaultValue="Alex" className="w-full px-5 py-4 border border-gray-200 bg-white rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-bold text-gray-900 transition-all" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Last name</label>
                <input type="text" defaultValue="Smith" className="w-full px-5 py-4 border border-gray-200 bg-white rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-bold text-gray-900 transition-all" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="space-y-6">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="pr-4">
                  <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">Order Updates</h4>
                  <p className="text-sm text-gray-500 font-medium">Receive SMS notifications about your order status.</p>
                </div>
                <div className="relative inline-block w-14 h-8 rounded-full bg-blue-600 shrink-0 shadow-inner">
                  <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform translate-x-6 shadow-sm"></div>
                </div>
              </label>
              
              <div className="border-t border-gray-100 pt-6">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="pr-4">
                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">Drone Flight Alerts</h4>
                    <p className="text-sm text-gray-500 font-medium">Get notified when a drone is arriving at your location.</p>
                  </div>
                  <div className="relative inline-block w-14 h-8 rounded-full bg-blue-600 shrink-0 shadow-inner">
                    <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform translate-x-6 shadow-sm"></div>
                  </div>
                </label>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="pr-4">
                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">Promotions</h4>
                    <p className="text-sm text-gray-500 font-medium">Receive emails about new products and offers.</p>
                  </div>
                  <div className="relative inline-block w-14 h-8 rounded-full bg-gray-200 shrink-0 shadow-inner border border-gray-300">
                    <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform shadow-sm"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </section>
        
        <div className="sm:hidden mt-8 pb-8">
          <Button fullWidth onClick={handleSave} isLoading={isSaving} className="flex items-center justify-center gap-2 h-14 rounded-2xl text-lg shadow-lg font-black">
            <Save className="w-5 h-5" /> Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};
