import React from 'react';
import { Home, LayoutGrid, ShoppingCart, Headphones } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  cartCount: number;
  isLoggedIn?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  cartCount,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'ទំព័រដើម', icon: Home },
    { id: 'products' as TabType, label: 'ទំនិញ', icon: LayoutGrid },
    { id: 'cart' as TabType, label: 'កន្ត្រក', icon: ShoppingCart, badge: cartCount },
    { id: 'help' as TabType, label: 'ជំនួយ', icon: Headphones },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-bottom-nav px-2 sm:px-4 py-1.5 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl font-['Kantumruy_Pro'] transition-all">
      <div className="grid grid-cols-4 w-full items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`w-full flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-2xl relative transition-all duration-200 active:scale-90 cursor-pointer ${
                isActive 
                  ? 'text-[#2563eb] bg-blue-50/70 font-bold' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <div className="relative">
                <Icon size={21} className={isActive ? 'stroke-[2.5] scale-105 transition-transform' : 'stroke-[1.8]'} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] sm:text-xs mt-1 font-['Kantumruy_Pro'] tracking-tight transition-colors ${
                isActive ? 'font-bold text-[#2563eb]' : 'font-medium'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
