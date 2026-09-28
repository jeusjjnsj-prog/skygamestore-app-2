import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';
import { ProductImage } from './ProductImage';

interface CartScreenProps {
  items: CartItem[];
  onContinueShopping: () => void;
  onUpdateQty: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onProceedCheckout: () => void;
  customImages?: Record<string, string>;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  items,
  onContinueShopping,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
  customImages = {},
}) => {
  const totalUsd = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-4 font-['Kantumruy_Pro',sans-serif] px-4 py-3 pb-28">
      {/* Title matching IMG_1190.png */}
      <h1 className="text-[20px] sm:text-[22px] font-bold text-slate-900 tracking-tight pt-1">
        កន្ត្រកទំនិញ
      </h1>

      {items.length === 0 ? (
        /* Empty Cart Card - Matching IMG_1186.png */
        <div className="bg-white rounded-[28px] border border-dashed border-slate-200/90 p-8 sm:p-14 text-center shadow-xs flex flex-col items-center justify-center my-3">
          {/* Cart Icon in Circle */}
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-3.5 shadow-2xs">
            <ShoppingCart size={22} className="stroke-[1.8]" />
          </div>

          <h2 className="text-base font-bold text-slate-900 mb-1">
            កន្ត្រកទទេ
          </h2>

          <p className="text-xs text-slate-500 mb-5 font-normal">
            បន្ថែមផលិតផលដើម្បីបន្ត
          </p>

          <button
            onClick={onContinueShopping}
            className="px-6 py-2 rounded-xl bg-[#4344e6] hover:bg-[#3839d6] text-white text-xs font-medium shadow-xs transition-all active:scale-95"
          >
            បន្តទិញ
          </button>
        </div>
      ) : (
        /* Cart List - Matching IMG_1190.png */
        <div className="space-y-3.5">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.cartId}
                className="bg-white rounded-[24px] p-3.5 sm:p-4 border border-slate-100 shadow-xs flex items-center gap-3.5"
              >
                {/* Product Logo / Image */}
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <ProductImage 
                    type={item.product.imageType} 
                    customSrc={customImages[item.product.id]}
                    className="w-full h-full rounded-xl object-contain" 
                  />
                </div>

                {/* Info & Quantity & Price */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                      {item.product.titleKhmer}
                    </h3>

                    {/* Trash Delete Icon */}
                    <button
                      onClick={() => onRemoveItem(item.cartId)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="លុបចេញ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    {/* Quantity Selector Pill [ - 1 + ] */}
                    <div className="flex items-center gap-2.5 px-3 py-1 rounded-full border border-slate-200 bg-slate-50/70 text-slate-700 text-xs font-medium shadow-2xs">
                      <button
                        onClick={() => onUpdateQty(item.cartId, -1)}
                        className="text-slate-500 hover:text-slate-900 active:scale-90 transition-transform"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="font-bold text-xs min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.cartId, 1)}
                        className="text-slate-500 hover:text-slate-900 active:scale-90 transition-transform"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Price on right */}
                    <div className="text-base sm:text-lg font-bold text-[#2563eb]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping button matching IMG_1190.png */}
          <button
            onClick={onContinueShopping}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs sm:text-sm font-medium shadow-2xs flex items-center justify-center transition-all active:scale-[0.99]"
          >
            បន្តទិញ
          </button>
        </div>
      )}

      {/* Sticky Bottom Checkout Bar (Above Bottom Nav) matching IMG_1190.png */}
      {items.length > 0 && (
        <div className="fixed bottom-14 sm:bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
          <div className="max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex items-center justify-between">
            {/* Total Section */}
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-medium">សរុប</span>
              <span className="text-2xl font-black text-[#2563eb] leading-tight">
                ${totalUsd.toFixed(2)}
              </span>
            </div>

            {/* "គិតលុយ" Button -> Triggers QR Code Screen */}
            <button
              onClick={onProceedCheckout}
              className="py-2.5 px-7 rounded-full bg-[#4344e6] hover:bg-[#3839d4] text-white font-semibold text-xs sm:text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center tracking-normal"
            >
              គិតលុយ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
