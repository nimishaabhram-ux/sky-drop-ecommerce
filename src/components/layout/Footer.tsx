import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Twitter, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 pb-20 md:pb-0">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">SkyDrop</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6">
              Get everyday essentials delivered faster. Standard or drone delivery straight to your location.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/settings/drone" className="hover:text-blue-600 transition-colors">Drone Delivery</Link></li>
              <li><Link to="/orders" className="hover:text-blue-600 transition-colors">Track Order</Link></li>
              <li><Link to="/settings/drone" className="hover:text-blue-600 transition-colors">Locations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/account" className="hover:text-blue-600 transition-colors">Profile</Link></li>
              <li><Link to="/settings" className="hover:text-blue-600 transition-colors">Settings</Link></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Help & Support</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200 text-sm text-slate-500 flex flex-col sm:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} SkyDrop Delivery. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
