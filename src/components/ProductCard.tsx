import React, { useRef } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  onBuyNow: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  customImage?: string | null;
  imageTimestamp?: number;
  onUpdateCustomImage?: (productId: string, dataUrl: string | null) => void;
  isAdmin?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuyNow,
  onSelectProduct,
  customImage,
  imageTimestamp,
  onUpdateCustomImage,
  isAdmin = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenDetail = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      onBuyNow(product);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateCustomImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onUpdateCustomImage(product.id, result);
        }
      };
      reader.readAsDataURL(file);
    }
    // Clear input so selecting the same file again triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateCustomImage) {
      onUpdateCustomImage(product.id, null);
    }
  };

  return (
    <div 
      onClick={handleOpenDetail}
      className="w-full h-full bg-white rounded-[18px] p-2.5 sm:p-3.5 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03)] hover:border-slate-300 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.975] active:translate-y-0 font-['Kantumruy_Pro'] relative group select-none cursor-pointer app-card-motion"
    >
      
      {/* Product Image Box with uniform 1:1 aspect-ratio */}
      <div 
        className="w-full aspect-square rounded-[14px] overflow-hidden relative shrink-0 bg-slate-50 transition-transform duration-300 ease-out border border-slate-100/60"
      >
        {/* Change Image Button - ONLY VISIBLE TO MASTER ADMIN (0969749477) */}
        {isAdmin && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="absolute top-1.5 left-1.5 z-20 flex items-center gap-1"
          >
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-[9px] sm:text-[11px] font-medium text-white bg-slate-900/85 hover:bg-slate-900 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm transition-colors cursor-pointer"
              title="ចុចដើម្បីប្ដូររូបភាពពិត (Admin)"
            >
              <Camera size={10} className="sm:w-3 sm:h-3" />
              <span>ប្ដូររូប</span>
            </button>

            {customImage && (
              <button
                onClick={handleResetImage}
                className="text-white hover:text-red-200 bg-red-600/85 hover:bg-red-600 p-0.5 sm:p-1 rounded-md sm:rounded-lg shadow-sm transition-colors cursor-pointer"
                title="ត្រឡប់ទៅរូបដើមវិញ"
              >
                <Trash2 size={10} className="sm:w-3 sm:h-3" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Product Tag Badge (e.g. AI កំពូលឆ្លាត ⚡, ស្តាប់ចម្រៀង VIP 🎵, ពេញនិយម 🔥, រៀនភាសា 📚) */}
        {product.tag && (
          <div className="absolute top-1.5 right-1.5 z-10 px-2 py-0.5 rounded-full bg-white/95 text-slate-800 text-[8.5px] sm:text-[9.5px] font-bold border border-slate-200/90 shadow-2xs backdrop-blur-xs flex items-center gap-1">
            <span>{product.tag}</span>
          </div>
        )}

        <ProductImage 
          type={product.imageType} 
          customSrc={customImage} 
          timestamp={imageTimestamp}
        />
      </div>

      {/* Product Details Section - Uniformly sized and aligned */}
      <div className="pt-2.5 flex flex-col flex-1 justify-between min-h-0">
        <div>
          {/* Title with standardized 2-line height */}
          <h3 
            onClick={handleOpenDetail}
            className="font-semibold text-slate-800 text-[12px] sm:text-[14px] leading-snug line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors h-[34px] sm:h-[40px] flex items-start"
            title={product.titleKhmer}
          >
            {product.titleKhmer}
          </h3>

          {/* Price & Sales Row */}
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[16px] sm:text-[21px] font-black text-[#2563eb] tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-[9.5px] sm:text-[11px] text-slate-500 font-medium bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
              <span className="text-amber-500 text-[10px]">🔥</span>
              <span>{product.salesCount}</span>
            </div>
          </div>
        </div>

        {/* Action Button - "ទិញភ្លាម ⚡" with Indigo to Sky Blue gradient matching Hero Banner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBuyNow(product);
          }}
          className="w-full h-[34px] sm:h-[40px] rounded-xl bg-gradient-to-r from-[#4f46e5] via-[#2563eb] to-[#0284c7] hover:from-[#4338ca] hover:to-[#0369a1] text-white font-bold text-[12px] sm:text-[13.5px] shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 font-['Kantumruy_Pro'] cursor-pointer mt-2 app-button-press"
        >
          <span>ទិញភ្លាម</span>
          <span className="text-amber-300 font-black">⚡</span>
        </button>
      </div>
    </div>
  );
};
