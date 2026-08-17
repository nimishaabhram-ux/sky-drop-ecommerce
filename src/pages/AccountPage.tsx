import React from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Settings, MapPin, Bell, LogOut, ChevronRight } from 'lucide-react';
import { Card } from '../components/common/Card';

export const AccountPage: React.FC = () => {
  return (
    <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Account</h1>

      {/* Profile Summary */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
          A
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Alex Smith</h2>
          <p className="text-slate-600">alex.smith@example.com</p>
          <p className="text-slate-500 text-sm mt-1">+1 (555) 123-4567</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Navigation Links */}
        <Link to="/orders">
          <Card className="hover:border-blue-300 transition-colors flex items-center p-4 sm:p-5">
            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 mr-4">
              <Package className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">My Orders</h3>
              <p className="text-sm text-slate-500">View your order history and track deliveries</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Card>
        </Link>

        <Link to="/settings/drone">
          <Card className="hover:border-blue-300 transition-colors flex items-center p-4 sm:p-5">
            <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-600 mr-4">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">Drone Delivery Locations</h3>
              <p className="text-sm text-slate-500">Manage your verified drone landing zones</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Card>
        </Link>

        <Link to="/settings">
          <Card className="hover:border-blue-300 transition-colors flex items-center p-4 sm:p-5">
            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 mr-4">
              <Settings className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">Settings</h3>
              <p className="text-sm text-slate-500">Update your profile, notifications, and preferences</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Card>
        </Link>
        
        <Card className="hover:border-blue-300 transition-colors flex items-center p-4 sm:p-5 cursor-pointer mt-8">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 mr-4">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-600">Log out</h3>
          </div>
        </Card>
      </div>
    </div>
  );
};
