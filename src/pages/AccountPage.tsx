import React from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, Bell, LogOut, ChevronRight, CreditCard, Shield, Navigation } from 'lucide-react';

export const AccountPage: React.FC = () => {
  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-6 md:py-10 min-h-screen bg-white md:bg-transparent">
      <h1 className="text-2xl md:text-[28px] font-semibold text-gray-900 mb-8 px-2 md:px-0">Account</h1>

      {/* Profile Summary */}
      <Link to="/settings/profile" className="flex items-center gap-4 mb-8 md:mb-10 p-4 md:px-6 hover:bg-slate-50 transition-colors rounded-xl group">
        <div className="w-14 h-14 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xl font-semibold shrink-0">
          A
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 leading-tight">Ajith Santhosh</h2>
          <p className="text-sm text-gray-600 leading-tight mt-0.5">ajith.abhram@gmail.com</p>
          <p className="text-sm text-gray-600 leading-tight mt-0.5">+91 9656239528</p>
        </div>
        <span className="hidden sm:block text-sm font-medium text-blue-600 group-hover:text-blue-700 px-2 py-1">
          Edit profile
        </span>
        <ChevronRight className="sm:hidden w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0" />
      </Link>

      <div className="space-y-8 overflow-hidden">
        
        {/* Orders & delivery */}
        <div>
          <h3 className="text-[17px] font-semibold text-gray-900 mb-2 px-2 md:px-6 md:pt-6">Orders & delivery</h3>
          <div className="md:px-2">
            <Link to="/orders" className="flex items-center p-4 hover:bg-slate-50 transition-colors group border-b border-gray-100">
              <Package className="w-5 h-5 text-slate-500 mr-4" />
              <div className="flex-1">
                <h4 className="text-[15px] font-medium text-gray-900 leading-tight">My orders</h4>
                <p className="text-[13px] text-gray-500 mt-0.5">View and track your orders</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </Link>
            
            <Link to="/settings/addresses" className="flex items-center p-4 hover:bg-slate-50 transition-colors group border-b border-gray-100">
              <MapPin className="w-5 h-5 text-slate-500 mr-4" />
              <div className="flex-1">
                <h4 className="text-[15px] font-medium text-gray-900 leading-tight">Delivery addresses</h4>
                <p className="text-[13px] text-gray-500 mt-0.5">Manage standard delivery addresses</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </Link>

            <Link to="/settings/drone" className="flex items-center p-4 hover:bg-slate-50 transition-colors group border-b border-gray-100">
              <Navigation className="w-5 h-5 text-slate-500 mr-4" />
              <div className="flex-1">
                <h4 className="text-[15px] font-medium text-gray-900 leading-tight">Drone delivery</h4>
                <p className="text-[13px] text-gray-500 mt-0.5">Manage locations for drone delivery</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Payments & preferences */}
        <div>
          <h3 className="text-[17px] font-semibold text-gray-900 mb-2 px-2 md:px-6">Payments & preferences</h3>
          <div className="md:px-2">
            <Link to="/settings/payments" className="flex items-center p-4 hover:bg-slate-50 transition-colors group border-b border-gray-100">
              <CreditCard className="w-5 h-5 text-slate-500 mr-4" />
              <div className="flex-1">
                <h4 className="text-[15px] font-medium text-gray-900 leading-tight">Payment methods</h4>
                <p className="text-[13px] text-gray-500 mt-0.5">Manage saved cards and UPI</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </Link>

            <Link to="/settings/notifications" className="flex items-center p-4 hover:bg-slate-50 transition-colors group border-b border-gray-100">
              <Bell className="w-5 h-5 text-slate-500 mr-4" />
              <div className="flex-1">
                <h4 className="text-[15px] font-medium text-gray-900 leading-tight">Notifications</h4>
                <p className="text-[13px] text-gray-500 mt-0.5">Order updates and alerts</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-[17px] font-semibold text-gray-900 mb-2 px-2 md:px-6">Account</h3>
          <div className="md:px-2">
            <Link to="/settings/profile" className="flex items-center p-4 hover:bg-slate-50 transition-colors group border-b border-gray-100">
              <User className="w-5 h-5 text-slate-500 mr-4" />
              <div className="flex-1">
                <h4 className="text-[15px] font-medium text-gray-900 leading-tight">Profile</h4>
                <p className="text-[13px] text-gray-500 mt-0.5">Personal information</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </Link>

            <Link to="/settings/security" className="flex items-center p-4 hover:bg-slate-50 transition-colors group border-b border-gray-100">
              <Shield className="w-5 h-5 text-slate-500 mr-4" />
              <div className="flex-1">
                <h4 className="text-[15px] font-medium text-gray-900 leading-tight">Security & privacy</h4>
                <p className="text-[13px] text-gray-500 mt-0.5">Password and data</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </Link>
            
            <button className="w-full flex items-center p-4 hover:bg-slate-50 transition-colors group md:pb-6 text-left">
              <LogOut className="w-5 h-5 text-red-500 mr-4" />
              <div className="flex-1">
                <h4 className="text-[15px] font-medium text-red-600 leading-tight">Sign out</h4>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
