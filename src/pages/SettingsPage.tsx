import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const SettingsPage: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto w-full">
      <Link to="/account" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your preferences and account details.</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} className="hidden sm:flex items-center gap-2">
          <Save className="w-4 h-4" /> Save changes
        </Button>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h2>
          <Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" defaultValue="alex.smith@example.com" disabled className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                <input type="text" defaultValue="Alex" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                <input type="text" defaultValue="Smith" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" />
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Notifications</h2>
          <Card>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <h4 className="font-medium text-slate-900">Order Updates</h4>
                  <p className="text-sm text-slate-500">Receive SMS notifications about your order status.</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-blue-600">
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-6"></div>
                </div>
              </label>
              
              <div className="border-t border-slate-100 pt-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <h4 className="font-medium text-slate-900">Drone Flight Alerts</h4>
                    <p className="text-sm text-slate-500">Get notified when a drone is arriving at your location.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-blue-600">
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-6"></div>
                  </div>
                </label>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <h4 className="font-medium text-slate-900">Promotions</h4>
                    <p className="text-sm text-slate-500">Receive emails about new products and offers.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200">
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                  </div>
                </label>
              </div>
            </div>
          </Card>
        </section>
        
        <div className="sm:hidden mt-8">
          <Button fullWidth onClick={handleSave} isLoading={isSaving} className="flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};
