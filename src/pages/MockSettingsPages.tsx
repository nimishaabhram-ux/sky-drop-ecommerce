import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Bell, Shield } from 'lucide-react';

export const PaymentsPage: React.FC = () => (
  <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 md:py-8 min-h-screen">
    <Link to="/account" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 mb-6">
      <ArrowLeft className="w-4 h-4" /> Back to Account
    </Link>
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
        <CreditCard className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Payment Methods</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your saved payment options</p>
      </div>
    </div>
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center">
      <p className="text-gray-500 py-10">This is a mock page for Payment Methods.</p>
    </div>
  </div>
);

export const NotificationsPage: React.FC = () => (
  <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 md:py-8 min-h-screen">
    <Link to="/account" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 mb-6">
      <ArrowLeft className="w-4 h-4" /> Back to Account
    </Link>
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
        <Bell className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Notifications</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your alert preferences</p>
      </div>
    </div>
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center">
      <p className="text-gray-500 py-10">This is a mock page for Notification Settings.</p>
    </div>
  </div>
);

export const SecurityPage: React.FC = () => (
  <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 md:py-8 min-h-screen">
    <Link to="/account" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 mb-6">
      <ArrowLeft className="w-4 h-4" /> Back to Account
    </Link>
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
        <Shield className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Security & Privacy</h1>
        <p className="text-gray-500 font-medium mt-1">Protect your account data</p>
      </div>
    </div>
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center">
      <p className="text-gray-500 py-10">This is a mock page for Security Settings.</p>
    </div>
  </div>
);
