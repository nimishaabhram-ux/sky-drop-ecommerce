import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-6 md:py-10 min-h-screen bg-white md:bg-transparent">
      <div className="mb-8">
        <button onClick={() => navigate('/account')} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Account
        </button>
        <div>
          <h1 className="text-2xl md:text-[28px] font-semibold text-gray-900 mb-1">Payment Methods</h1>
          <p className="text-[15px] text-gray-500">Manage your saved payment options.</p>
        </div>
      </div>
      <div className="md:bg-white md:border md:border-gray-200 md:rounded-xl md:shadow-sm p-6 text-center">
        <p className="text-gray-500 py-10">This is a mock page for Payment Methods.</p>
      </div>
    </div>
  );
};

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-6 md:py-10 min-h-screen bg-white md:bg-transparent">
      <div className="mb-8">
        <button onClick={() => navigate('/account')} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Account
        </button>
        <div>
          <h1 className="text-2xl md:text-[28px] font-semibold text-gray-900 mb-1">Notifications</h1>
          <p className="text-[15px] text-gray-500">Manage your alert preferences.</p>
        </div>
      </div>
      <div className="md:bg-white md:border md:border-gray-200 md:rounded-xl md:shadow-sm p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="pr-4">
              <h4 className="font-semibold text-gray-900 text-[16px]">Order updates</h4>
              <p className="text-[14px] text-gray-500 mt-0.5">Updates about your orders</p>
            </div>
            <div className="relative inline-block w-12 h-6 rounded-full bg-blue-600 shrink-0 cursor-pointer">
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full translate-x-6 transition-transform"></div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <h4 className="font-semibold text-gray-900 text-[16px]">Drone approaching</h4>
                <p className="text-[14px] text-gray-500 mt-0.5">Alert when your drone delivery is near</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-blue-600 shrink-0 cursor-pointer">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full translate-x-6 transition-transform"></div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <h4 className="font-semibold text-gray-900 text-[16px]">Offers</h4>
                <p className="text-[14px] text-gray-500 mt-0.5">Promotions and recommendations</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 shrink-0 cursor-pointer">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SecurityPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-6 md:py-10 min-h-screen bg-white md:bg-transparent">
      <div className="mb-8">
        <button onClick={() => navigate('/account')} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Account
        </button>
        <div>
          <h1 className="text-2xl md:text-[28px] font-semibold text-gray-900 mb-1">Security & privacy</h1>
          <p className="text-[15px] text-gray-500">Protect your account data.</p>
        </div>
      </div>
      <div className="md:bg-white md:border md:border-gray-200 md:rounded-xl md:shadow-sm p-6 text-center">
        <p className="text-gray-500 py-10">This is a mock page for Security Settings.</p>
      </div>
    </div>
  );
};
