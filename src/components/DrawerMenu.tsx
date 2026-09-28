import React from 'react';
import { 
  X, 
  Home, 
  LayoutGrid, 
  ShoppingBag, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  User, 
  ChevronRight,
  Headphones
} from 'lucide-react';
import { TabType } from '../types';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
  onSelectCategory?: (category: string) => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-['Kantumruy_Pro']">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fadeIn"
      />

      {/* Panel */}
      <div className="relative w-72 max-w-[85vw] h-full bg-white flex flex-col justify-between p-5 z-10 shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white font-black text-xs shadow-sm">
                S
              </div>
              <span className="font-black text-slate-900 text-base font-sans">
                Skypro store
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => {
                onNavigateTab('home');
                onClose();
              }}
              className="w-full p-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Home size={16} className="text-blue-600" />
                <span>ទំព័រដើម (Home)</span>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => {
                onNavigateTab('products');
                onClose();
              }}
              className="w-full p-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid size={16} className="text-indigo-600" />
                <span>ទំនិញទាំងអស់ (Catalog)</span>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => {
                onNavigateTab('account');
                onClose();
              }}
              className="w-full p-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={16} className="text-emerald-600" />
                <span>ប្រវត្តិបញ្ជាទិញ & កូដគណនី</span>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </button>
          </nav>

          {/* Telegram Support Channel Card */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2">
              <Send size={15} className="text-[#229ed9]" />
              <span className="text-xs font-bold text-slate-900">Telegram Admin Support</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              មានបញ្ហាទាក់ទងនឹងការបញ្ជាទិញ ឬត្រូវការជំនួយ អាចទាក់ទងមកកាន់ Admin បានគ្រប់ពេល ២៤/៧
            </p>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2 text-center text-xs font-bold text-white bg-[#229ed9] hover:bg-[#1e8bc0] rounded-xl shadow-xs transition-colors"
            >
              ឆាតទៅកាន់ Telegram
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
          Skypro store • Premium Digital Accounts 2026
        </div>
      </div>
    </div>
  );
};
