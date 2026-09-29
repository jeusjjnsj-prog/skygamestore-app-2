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
    <div className="w-full bg-white rounded-[14px] p-2.5 sm:p-3.5 border border-[#38bdf8] shadow-[0_2px_10px_rgba(56,189,248,0.14)] hover:shadow-[0_8px_22px_rgba(56,189,248,0.22)] flex flex-col justify-between transition-all duration-200 font-['Kantumruy_Pro'] relative group select-none">
      
      {/* Product Image Box with aspect-ratio: 1/1 and min-height: 130px on mobile */}
      <div 
        onClick={handleOpenDetail}
        className="w-full aspect-square min-h-[130px] sm:aspect-[4/3] sm:min-h-[170px] lg:h-[185px] rounded-[10px] sm:rounded-xl overflow-hidden relative cursor-pointer shrink-0 bg-slate-50 transition-transform active:scale-[0.98]"
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

        <ProductImage 
          type={product.imageType} 
          customSrc={customImage} 
          timestamp={imageTimestamp}
        />
      </div>

      {/* Product Details Section */}
      <div className="pt-2 sm:pt-2.5 flex flex-col flex-1 justify-between min-h-0">
        <div>
          {/* Title with 2-line clamp */}
          <h3 
            onClick={handleOpenDetail}
            className="font-medium text-slate-800 text-[11.5px] sm:text-[14px] leading-snug line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors min-h-[28px] sm:min-h-[38px]"
            title={product.titleKhmer}
          >
            {product.titleKhmer}
          </h3>

          {/* Price & Sales Row */}
          <div className="mt-1 sm:mt-1.5 flex items-baseline justify-between">
            <span className="text-[14.5px] sm:text-[20px] font-bold text-[#2563eb] tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-0.5 text-[9px] sm:text-[11px] text-slate-500 font-normal">
              <span className="text-amber-500 text-[10px] sm:text-xs">🔥</span>
              <span>{product.salesCount}</span>
            </div>
          </div>
        </div>

        {/* Action Button - Royal Blue */}
        <button
          onClick={() => onBuyNow(product)}
          className="w-full h-[30px] sm:h-[38px] rounded-lg sm:rounded-xl bg-[#4344e6] hover:bg-[#3839d6] text-white font-medium text-[11.5px] sm:text-[13px] shadow-xs active:scale-[0.98] transition-all flex items-center justify-center font-['Kantumruy_Pro'] cursor-pointer mt-1.5 sm:mt-2"
        >
          ទិញឥឡូវ
        </button>
      </div>
    </div>
  );
};
