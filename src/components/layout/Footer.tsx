import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
              SkyDrop
            </Link>
            <p className="mt-2 text-sm text-slate-500">
              Everyday essentials, delivered faster.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/shop" className="hover:text-blue-600 transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=medical" className="hover:text-blue-600 transition-colors">Medical</Link></li>
              <li><Link to="/shop?category=food" className="hover:text-blue-600 transition-colors">Food & Bakery</Link></li>
              <li><Link to="/shop?category=tech" className="hover:text-blue-600 transition-colors">Tech</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Delivery</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/settings/drone" className="hover:text-blue-600 transition-colors">Drone Delivery</Link></li>
              <li><Link to="/orders" className="hover:text-blue-600 transition-colors">Track Order</Link></li>
              <li><Link to="/settings/delivery" className="hover:text-blue-600 transition-colors">Locations</Link></li>
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
