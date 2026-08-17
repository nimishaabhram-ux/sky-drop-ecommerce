import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, Package, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MobileNavigation: React.FC = () => {
  const { cartTotalCount } = useCart();
  const totalItems = cartTotalCount;

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/shop', icon: Search, label: 'Search' },
    { to: '/orders', icon: Package, label: 'Orders' },
    { to: '/cart', icon: ShoppingBag, label: 'Cart', badge: totalItems },
    { to: '/account', icon: User, label: 'Account' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {item.badge ? (
                    <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
