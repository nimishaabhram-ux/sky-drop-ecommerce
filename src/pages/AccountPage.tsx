import React from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Settings, MapPin, Bell, LogOut, ChevronRight, CreditCard, Shield } from 'lucide-react';

export const AccountPage: React.FC = () => {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 md:py-8 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Account</h1>

      {/* Profile Summary */}
      <div className="flex items-center gap-5 mb-10 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-inner">
          A
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Alex Smith</h2>
          <p className="text-gray-500 font-medium">alex.smith@example.com</p>
          <p className="text-gray-500 text-sm mt-1 font-bold">+1 (555) 123-4567</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Navigation Links */}
        <Link to="/orders" className="block">
          <div className="bg-white border border-gray-100 hover:border-blue-200 transition-colors flex items-center p-5 rounded-3xl shadow-sm group">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 mr-5 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Package className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">My Orders</h3>
              <p className="text-sm text-gray-500 font-medium">View your order history and track deliveries</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </Link>

        <Link to="/settings/drone" className="block">
          <div className="bg-white border border-gray-100 hover:border-cyan-200 transition-colors flex items-center p-5 rounded-3xl shadow-sm group">
            <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 mr-5 group-hover:bg-cyan-100 transition-colors">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">Drone Delivery Locations</h3>
              <p className="text-sm text-gray-500 font-medium">Manage your verified drone landing zones</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition-colors" />
          </div>
        </Link>

        <Link to="/settings/addresses" className="block">
          <div className="bg-white border border-gray-100 hover:border-blue-200 transition-colors flex items-center p-5 rounded-3xl shadow-sm group">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mr-5 group-hover:bg-blue-100 transition-colors">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">Standard Delivery Addresses</h3>
              <p className="text-sm text-gray-500 font-medium">Manage your saved addresses for standard delivery</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </Link>

        <Link to="/settings/payments" className="block">
          <div className="bg-white border border-gray-100 hover:border-blue-200 transition-colors flex items-center p-5 rounded-3xl shadow-sm group">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mr-5 group-hover:bg-blue-100 transition-colors">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">Payment Methods</h3>
              <p className="text-sm text-gray-500 font-medium">Manage your saved credit cards and UPI options</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </Link>

        <Link to="/settings/notifications" className="block">
          <div className="bg-white border border-gray-100 hover:border-purple-200 transition-colors flex items-center p-5 rounded-3xl shadow-sm group">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mr-5 group-hover:bg-purple-100 transition-colors">
              <Bell className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
              <p className="text-sm text-gray-500 font-medium">Manage order updates and promotional alerts</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
        </Link>

        <Link to="/settings/security" className="block">
          <div className="bg-white border border-gray-100 hover:border-green-200 transition-colors flex items-center p-5 rounded-3xl shadow-sm group">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mr-5 group-hover:bg-green-100 transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">Security & Privacy</h3>
              <p className="text-sm text-gray-500 font-medium">Password, two-factor authentication, and data</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
        </Link>

        <Link to="/settings" className="block">
          <div className="bg-white border border-gray-100 hover:border-gray-300 transition-colors flex items-center p-5 rounded-3xl shadow-sm group">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 mr-5 group-hover:bg-gray-100 transition-colors">
              <Settings className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">Profile Settings</h3>
              <p className="text-sm text-gray-500 font-medium">Update your personal information</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </Link>
        
        <div className="bg-white border border-gray-100 hover:border-red-200 transition-colors flex items-center p-5 rounded-3xl shadow-sm cursor-pointer mt-8 group">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mr-5 group-hover:bg-red-100 transition-colors">
            <LogOut className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-600 text-lg">Log out</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
