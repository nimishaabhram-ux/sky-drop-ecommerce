import React from 'react';
import { Plane, ShoppingBag, Bell, User as UserIcon } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const Header: React.FC = () => {
  const { cartTotalCount } = useCart();
  const unreadNotifications = 0; // Will be connected to state later

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            SkyDrop
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
            Home
          </NavLink>
          <NavLink to="/shop" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
            Shop
          </NavLink>
          <NavLink to="/orders" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
            Orders
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100">
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          <Link to="/cart" className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100 flex items-center gap-1">
            <ShoppingBag className="w-5 h-5" />
            {cartTotalCount > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white transform translate-x-1/4 -translate-y-1/4">
                {cartTotalCount}
              </span>
            )}
          </Link>

          <Link to="/account" className="p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100">
            <UserIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
