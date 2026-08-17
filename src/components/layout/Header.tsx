import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, MapPin, User, ChevronDown, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Header: React.FC = () => {
  const { cartTotalCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isSettingsOrAccount = location.pathname.startsWith('/settings') || location.pathname.startsWith('/account');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-20 gap-8">
          {/* Logo & Location */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Abay</span>
            </Link>

            <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-gray-200">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <p className="text-xs text-gray-500 font-medium leading-none">Deliver to</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1 leading-tight mt-1">
                  Home, Kochi <ChevronDown className="w-4 h-4 text-gray-400" />
                </p>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl flex justify-center">
            {!isSettingsOrAccount && (
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Search for groceries, medicines, snacks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            )}
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/orders" className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium transition-colors rounded-lg hover:bg-gray-50">
              Orders
            </Link>
            
            <Link to="/cart" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 font-medium transition-colors rounded-lg hover:bg-gray-50">
              <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              Cart
            </Link>

            <Link to="/account" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 font-medium transition-colors rounded-lg hover:bg-gray-50">
              <User className="w-6 h-6" />
              Account
            </Link>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden py-3 space-y-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Package className="w-7 h-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">Abay</span>
            </Link>
            <Link to="/account" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
              <User className="w-5 h-5" />
            </Link>
          </div>

          {!isSettingsOrAccount && (
            <>
              <button className="flex items-center gap-1.5 w-full text-left">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-900 truncate">Home, Kochi</span>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              </button>

              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  placeholder="Search for products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
