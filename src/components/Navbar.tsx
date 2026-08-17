import React from 'react';
import { Plane, ShoppingBag, Bell, User as UserIcon, Radio, ShieldCheck } from 'lucide-react';
import { User, CartItem, NotificationItem } from '../types';

interface NavbarProps {
  user: User | null;
  cart: CartItem[];
  notifications: NotificationItem[];
  onOpenCart: () => void;
  onOpenNotifications: () => void;
  onOpenAccount: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  cart,
  notifications,
  onOpenCart,
  onOpenNotifications,
  onOpenAccount,
  onOpenAuth,
}) => {
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black tracking-tighter text-xl rounded-sm shadow-md">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-white font-display-bold">
                SKYDROP<span className="text-neutral-500">.</span>
              </span>
              <span className="hidden xs:inline-flex items-center gap-1 px-1.5 py-0.5 border border-white/20 text-[9px] font-mono-tech tracking-widest text-neutral-300 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                UAV-V4
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.35em] font-bold text-neutral-500 hidden sm:block font-mono-tech">
              Autonomous Logistics Fleet
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Airspace status pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-white/10 text-xs font-mono-tech text-neutral-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="tracking-wider text-[11px]">AIRSPACE: OPEN</span>
          </div>

          {/* Notifications Button */}
          <button
            id="nav-notifications-btn"
            onClick={onOpenNotifications}
            className="relative p-2.5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/30 transition-colors rounded-sm"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black font-black text-[9px] flex items-center justify-center rounded-full">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            id="nav-cart-btn"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-2 border border-white/20 hover:border-white/50 text-white transition-colors rounded-sm bg-white/5"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono-tech font-bold text-xs">
              {totalCartCount > 0 ? `${totalCartCount}` : '0'}
            </span>
            {totalCartCount > 0 && (
              <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                BAG
              </span>
            )}
          </button>

          {/* User Account / Sign In */}
          {user ? (
            <button
              id="nav-user-profile-btn"
              onClick={onOpenAccount}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 border border-white/10 hover:border-white/30 transition-colors rounded-sm group"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-sm object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all"
                />
              ) : (
                <div className="w-7 h-7 bg-neutral-800 text-white flex items-center justify-center font-bold text-xs rounded-sm">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="hidden lg:block text-xs font-bold tracking-wide text-neutral-200">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              id="nav-signin-btn"
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-neutral-200 transition-colors rounded-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
