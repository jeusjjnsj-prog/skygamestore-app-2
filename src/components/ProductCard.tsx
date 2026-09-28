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
  onUpdateCustomImage?: (productId: string, dataUrl: string | null) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuyNow,
  onSelectProduct,
  customImage,
  onUpdateCustomImage,
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
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateCustomImage) {
      onUpdateCustomImage(product.id, null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-3 shadow-xs border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md font-['Kantumruy_Pro'] relative group">
      {/* Change Image Button above the product image */}
      <div className="flex items-center justify-between pb-1.5 px-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
          title="ចុចដើម្បីប្ដូររូបភាពផលិតផលពិត"
        >
          <Camera size={11} />
          <span>ប្ដូររូបភាព</span>
        </button>

        {customImage && (
          <button
            onClick={handleResetImage}
            className="text-[10px] text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-50 transition-colors"
            title="ត្រឡប់ទៅរូបដើមវិញ"
          >
            <Trash2 size={11} />
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

      {/* Product Image Box */}
      <div 
        onClick={handleOpenDetail}
        className="cursor-pointer overflow-hidden rounded-2xl transition-transform active:scale-[0.98]"
      >
        <ProductImage type={product.imageType} customSrc={customImage} />
      </div>

      {/* Product Details */}
      <div className="pt-2 flex flex-col flex-1 justify-between">
        <div>
          {/* Title in clean modern font */}
          <h3 
            onClick={handleOpenDetail}
            className="font-medium text-slate-800 text-[13px] sm:text-[14px] leading-snug line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors min-h-[38px]"
          >
            {product.titleKhmer}
          </h3>

          {/* Price */}
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-[18px] sm:text-[20px] font-bold text-[#2563eb] tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Sales count row */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 mb-2">
            <span className="text-amber-500 text-xs">🔥</span>
            <span>{product.salesCount} បានលក់</span>
          </div>
        </div>

        {/* Action Button - Sleek, full-width Royal Blue */}
        <button
          onClick={() => onBuyNow(product)}
          className="w-full py-2 px-3 rounded-xl bg-[#4344e6] hover:bg-[#3839d6] text-white font-medium text-[13px] shadow-xs active:scale-[0.98] transition-all flex items-center justify-center font-['Kantumruy_Pro'] cursor-pointer"
        >
          ទិញឥឡូវ
        </button>
      </div>
    </div>
  );
};
