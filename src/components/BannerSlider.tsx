import React from 'react';
import { appendCacheBuster } from '../utils/imageStore';
import { Product } from '../types';

interface BannerSliderProps {
  onSelectProduct?: (productId: string) => void;
  onExploreAll?: () => void;
  products?: Product[];
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  onExploreAll,
}) => {
  return (
    <div className="w-full select-none">
      {/* Clean Single Image Banner Card: Rounded-2xl, Shadow-md, 100% Responsive, Zero HTML/Div Overlays */}
      <div 
        onClick={() => {
          if (onExploreAll) onExploreAll();
        }}
        className="w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-md bg-white cursor-pointer active:opacity-95 transition-opacity"
        title="SkyPro Store"
      >
        <img
          src={appendCacheBuster('/images/skypro_hero_banner.jpg')}
          alt="SkyPro Store Banner"
          referrerPolicy="no-referrer"
          className="w-full h-auto object-cover rounded-2xl block"
          loading="eager"
        />
      </div>
    </div>
  );
};
