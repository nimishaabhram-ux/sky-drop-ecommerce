import React from 'react';
import { Home, Compass, Radio, MapPin, User as UserIcon } from 'lucide-react';

export type ActiveTab = 'home' | 'catalog' | 'track' | 'drone-setup' | 'account';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activeOrderCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  activeOrderCount = 0,
}) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'HUB', icon: Home },
    { id: 'catalog' as ActiveTab, label: 'ORDER', icon: Compass },
    {
      id: 'track' as ActiveTab,
      label: 'LIVE TRACK',
      icon: Radio,
      badge: activeOrderCount > 0 ? activeOrderCount : undefined,
      pulse: activeOrderCount > 0,
    },
    { id: 'drone-setup' as ActiveTab, label: 'LZ SCAN', icon: MapPin, highlight: true },
    { id: 'account' as ActiveTab, label: 'PROFILE', icon: UserIcon },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative transition-all min-h-[48px] rounded-sm group ${
                isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {/* Active top line */}
              {isActive && (
                <div className="absolute -top-1.5 w-6 h-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'group-hover:scale-105'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 w-4 h-4 bg-emerald-500 text-black font-black text-[9px] flex items-center justify-center rounded-full ${
                      tab.pulse ? 'animate-bounce' : ''
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[9px] font-mono-tech uppercase font-bold tracking-wider mt-1 transition-colors ${
                  isActive ? 'text-white font-extrabold' : 'text-neutral-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
