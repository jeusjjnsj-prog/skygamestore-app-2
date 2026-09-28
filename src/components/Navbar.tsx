import React from 'react';
import { ShoppingCart, Menu, Sparkles, User } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenDrawer: () => void;
  onOpenAccount?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenDrawer,
  onOpenAccount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:py-3.5 flex items-center justify-between shadow-xs">
      {/* Brand: Skypro store */}
      <div className="flex items-center gap-2.5">
        {/* Skypro Store Logo Mark */}
        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3b82f6] via-[#6366f1] to-[#a855f7] p-0.5 shadow-md flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
            <span className="font-black text-sm bg-gradient-to-tr from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent font-sans">
              S
            </span>
          </div>
          <div className="absolute -top-1 -right-1 text-amber-400">
            <Sparkles size={11} className="fill-amber-400" />
          </div>
        </div>

        {/* Shop Name: Skypro store */}
        <div className="flex flex-col">
          <span className="text-[17px] sm:text-[18px] font-black tracking-tight text-slate-900 font-sans leading-none">
            Skypro store
          </span>
          <span className="text-[9px] font-semibold text-indigo-600 tracking-wider uppercase mt-0.5">
            Digital Store
          </span>
        </div>
      </div>

      {/* Right Action Icons: Cart, User profile & Menu (Matches IMG_1188.png) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Cart Icon */}
        <button
          onClick={onOpenCart}
          className="relative p-2 rounded-full hover:bg-slate-100 text-slate-800 transition-colors"
          title="កន្ត្រកទំនិញ"
        >
          <ShoppingCart size={20} className="stroke-[2.1]" />
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#ef4444] text-white text-[10px] font-black flex items-center justify-center shadow-sm animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Account Circle Outline Icon (Matches IMG_1188.png) */}
        {onOpenAccount && (
          <button
            onClick={onOpenAccount}
            className="p-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
            title="គណនី"
          >
            <User size={18} className="stroke-[2.1]" />
          </button>
        )}

        {/* Menu Hamburger Icon */}
        <button
          onClick={onOpenDrawer}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-800 transition-colors"
          title="ម៉ឺនុយ"
        >
          <Menu size={21} className="stroke-[2.1]" />
        </button>
      </div>
    </header>
  );
};

