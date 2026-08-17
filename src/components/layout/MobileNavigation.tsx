import React from 'react';
import { Home, Compass, Package, User as UserIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const MobileNavigation: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around">
        <NavLink 
          to="/" 
          end
          className={({isActive}) => `flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>
        
        <NavLink 
          to="/shop" 
          className={({isActive}) => `flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">Shop</span>
        </NavLink>
        
        <NavLink 
          to="/orders" 
          className={({isActive}) => `flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-medium">Orders</span>
        </NavLink>
        
        <NavLink 
          to="/account" 
          className={({isActive}) => `flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium">Account</span>
        </NavLink>
      </div>
    </nav>
  );
};
