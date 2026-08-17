import React, { useState } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
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
            <h1 className="text-2xl md:text-[28px] font-semibold text-gray-900 mb-1">Profile</h1>
            <p className="text-[15px] text-gray-500">Manage your personal information.</p>
          </div>
          <Button onClick={handleSave} isLoading={isSaving} className="hidden sm:flex items-center">
            Save changes
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="md:bg-white md:border md:border-gray-200 md:rounded-xl md:shadow-sm md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" defaultValue="ajith.abhram@gmail.com" disabled className="w-full h-11 px-4 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed" />
            </div>
            <div className="col-span-1">
              <label className="block text-[14px] font-medium text-gray-700 mb-1.5">First name</label>
              <input type="text" defaultValue="Ajith" className="w-full h-11 px-4 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" />
            </div>
            <div className="col-span-1">
              <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Last name</label>
              <input type="text" defaultValue="Santhosh" className="w-full h-11 px-4 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Phone number</label>
              <input type="tel" defaultValue="+91 9656239528" className="w-full h-11 px-4 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="sm:hidden mt-8">
          <Button fullWidth onClick={handleSave} isLoading={isSaving}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};
