import React, { useRef, useState, useEffect } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { appendCacheBuster } from '../utils/imageStore';
import { storeSync } from '../services/storeSync';
import { DEFAULT_PERMANENT_HERO_BANNER } from '../data/permanentStoreImages';
import { Product } from '../types';

interface BannerSliderProps {
  onSelectProduct?: (productId: string) => void;
  onExploreAll?: () => void;
  products?: Product[];
  isAdmin?: boolean;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  onExploreAll,
  isAdmin = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerUrl, setBannerUrl] = useState<string>(() => {
    return storeSync.getData().heroBanner || DEFAULT_PERMANENT_HERO_BANNER;
  });
  const [imageTimestamp, setImageTimestamp] = useState<number>(() => storeSync.getLastUpdated());

  useEffect(() => {
    const unsubscribe = storeSync.subscribe((data, timestamp) => {
      if (data.heroBanner) {
        setBannerUrl(data.heroBanner);
        setImageTimestamp(timestamp);
      }
    });
    return unsubscribe;
  }, []);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          storeSync.updateHeroBanner(result);
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    storeSync.updateHeroBanner(null);
  };

  const finalSrc = appendCacheBuster(bannerUrl, imageTimestamp);
  const isCustomBanner = bannerUrl !== DEFAULT_PERMANENT_HERO_BANNER;

  return (
    <div className="w-full select-none relative group">
      {/* 
        Clean Single Image Banner Card:
        - 100% Responsive on mobile (w-full, h-auto, aspect-[16/9])
        - Smooth Vertical Float Keyframe Animation (translateY(-6px) to translateY(0px), 3.5s ease-in-out infinite alternate)
        - Rounded-2xl with shadow-lg
        - Absolutely zero HTML overlays or distracting boxes
      */}
      <div 
        onClick={() => {
          if (onExploreAll) onExploreAll();
        }}
        className="w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-lg bg-white cursor-pointer active:opacity-95 transition-all duration-300 animate-hero-float"
        title="SkyPro Store"
      >
        <img
          src={finalSrc}
          alt="SkyPro Store Hero Banner"
          referrerPolicy="no-referrer"
          className="w-full h-auto aspect-[16/9] object-cover object-center rounded-2xl block"
          loading="eager"
        />
      </div>

      {/* Admin Quick Upload / Reset Controls (Visible only to Admin) */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-30 opacity-80 hover:opacity-100 transition-opacity">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerUpload}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            title="ផ្លាស់ប្តូររូបភាព Banner (Admin)"
            className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-xs shadow-md transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          {isCustomBanner && (
            <button
              type="button"
              onClick={handleResetBanner}
              title="កំណត់រូបភាពដើមឡើងវិញ (Reset)"
              className="p-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-xs shadow-md transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
