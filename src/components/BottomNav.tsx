import React from 'react';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
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
  isLoggedIn = false,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'ទំព័រដើម', icon: Home },
    { id: 'products' as TabType, label: 'ទំនិញ', icon: LayoutGrid },
    { id: 'cart' as TabType, label: 'កន្ត្រកទំនិញ', icon: ShoppingCart, badge: cartCount },
    { id: 'account' as TabType, label: isLoggedIn ? 'ផ្ទាំងគ្រប់គ្រង' : 'ចូលគណនី', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.04)] max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center py-1 px-3 relative transition-all active:scale-95 ${
              isActive ? 'text-[#3b82f6]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon size={21} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-[11px] mt-1 font-['Kantumruy_Pro'] tracking-tight ${
              isActive ? 'font-bold text-[#3b82f6]' : 'font-medium'
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
