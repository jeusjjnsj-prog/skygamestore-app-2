import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { appendCacheBuster } from '../utils/imageStore';

export interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  highlightText?: string;
  description: string;
  priceBadge: string;
  image: string;
  productId?: string;
  category?: string;
  themeGradient?: string;
}

interface BannerSliderProps {
  onSelectProduct?: (productId: string) => void;
  onExploreAll?: () => void;
  products?: Product[];
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'capcut-pro',
    tag: 'កាត់តវីដេអូកម្រិតខ្ពស់ • Video Editing',
    title: 'CapCut Pro VIP',
    highlightText: 'គ្មាន Watermark',
    description: 'នាំចេញវីដេអូកម្រិត 4K 60FPS • Pro Effects, Filters & Cloud Space 100GB',
    priceBadge: 'បញ្ចុះតម្លៃ 25% ត្រឹម $3.90',
    image: '/images/banner_capcut_pro.jpg',
    productId: 'capcut-pro-1m',
  },
  {
    id: 'gemini-ai',
    tag: 'បញ្ញាសិប្បនិម្មិត • Advanced AI',
    title: 'Google Gemini Pro & AI',
    highlightText: 'ជំនួយការឆ្លាតវៃ',
    description: 'ដំណើរការម៉ូដែល Gemini 1.5/2.0 Pro • វិភាគទិន្នន័យ & សរសេរកូដលឿនរហ័ស',
    priceBadge: 'សុពលភាពវែង ធានាពេញលេញ',
    image: '/images/banner_ai_pro.jpg',
    productId: 'gemini-ai-pro-18m',
  },
  {
    id: 'canva-pro',
    tag: 'ឌីហ្សាញរូបភាព • Graphic Design',
    title: 'Canva Pro 1 Year',
    highlightText: 'ដោះសោរគ្រប់យ៉ាង',
    description: 'ចូលរួម Team Pro ប្រើប្រាស់ Premium Templates & Magic AI គ្មានដែនកំណត់',
    priceBadge: 'តម្លៃពិសេសត្រឹម $1.99 / ឆ្នាំ',
    image: '/images/banner_canva_pro.jpg',
    productId: 'canva-pro-1y',
  },
  {
    id: 'skypro-special',
    tag: 'ហាងកម្មវិធី និងសេវាឌីជីថល • Official Store',
    title: 'SkyPro Store Pro Service',
    highlightText: 'ធានា ១០០%',
    description: 'គណនី App Pro & AI គុណភាពខ្ពស់បំផុត • ប្រគល់ជូនភ្លាមៗ និង Support 24/7',
    priceBadge: 'សេវាកម្មសុទ្ធ ១០០%',
    image: '/images/skypro_logo.jpg',
  },
];

export const BannerSlider: React.FC<BannerSliderProps> = ({
  onSelectProduct,
  onExploreAll,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchMoveX, setTouchMoveX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = BANNER_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-slide effect (4.5s)
  useEffect(() => {
    if (isPaused) {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
      return;
    }

    autoSlideTimerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
    setTouchMoveX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchMoveX(currentX);
    const diff = currentX - touchStartX;
    // Dampen drag
    setDragOffset(diff * 0.7);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchMoveX !== null) {
      const diff = touchMoveX - touchStartX;
      const threshold = 40; // minimum swipe distance in px
      if (diff < -threshold) {
        nextSlide();
      } else if (diff > threshold) {
        prevSlide();
      }
    }
    setTouchStartX(null);
    setTouchMoveX(null);
    setDragOffset(0);
    setIsPaused(false);
  };

  // Mouse Drag Handlers for Desktop swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPaused(true);
    setIsDragging(true);
    setTouchStartX(e.clientX);
    setTouchMoveX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || touchStartX === null) return;
    setTouchMoveX(e.clientX);
    const diff = e.clientX - touchStartX;
    setDragOffset(diff * 0.6);
  };

  const handleMouseUp = () => {
    if (isDragging && touchStartX !== null && touchMoveX !== null) {
      const diff = touchMoveX - touchStartX;
      const threshold = 40;
      if (diff < -threshold) {
        nextSlide();
      } else if (diff > threshold) {
        prevSlide();
      }
    }
    setIsDragging(false);
    setTouchStartX(null);
    setTouchMoveX(null);
    setDragOffset(0);
    setIsPaused(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
    setIsPaused(false);
  };

  const handleAction = (slide: BannerSlide) => {
    if (slide.productId && onSelectProduct) {
      onSelectProduct(slide.productId);
    } else if (onExploreAll) {
      onExploreAll();
    }
  };

  return (
    <div className="relative w-full group select-none">
      {/* Outer ambient glow matching the SkyPro cyan/electric blue branding */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0052fe]/40 via-[#00e5ff]/25 to-[#4344e6]/40 rounded-2xl sm:rounded-3xl blur-md opacity-60 pointer-events-none" />

      {/* Main Slider Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 border border-cyan-500/25 shadow-xl aspect-[16/8.8] sm:aspect-[16/7] md:aspect-[21/9] flex items-stretch cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Slides Track */}
        <div
          className="flex w-full h-full transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
            transitionProperty: isDragging || touchStartX !== null ? 'none' : 'transform',
          }}
        >
          {BANNER_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className="relative w-full h-full shrink-0 overflow-hidden flex items-center"
            >
              {/* Slide Background Image */}
              <img
                src={appendCacheBuster(slide.image)}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 transform scale-[1.02] group-hover:scale-105 transition-transform duration-700"
                draggable={false}
              />

              {/* High-contrast scrim gradient strictly matching SkyPro Store colors */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 sm:via-slate-950/65 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />

              {/* Cyan brand accent glow */}
              <div className="absolute top-0 left-0 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-[#0052fe]/20 blur-2xl pointer-events-none z-10" />
              <div className="absolute bottom-0 left-1/3 w-32 sm:w-56 h-32 sm:h-56 rounded-full bg-[#00e5ff]/15 blur-2xl pointer-events-none z-10" />

              {/* Content overlay */}
              <div className="relative z-20 w-full px-4 sm:px-8 py-3 sm:py-6 flex flex-col justify-center h-full max-w-[85%] sm:max-w-md md:max-w-lg">
                {/* Badge Tag */}
                <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-[10px] sm:text-xs font-semibold text-cyan-300 backdrop-blur-md shadow-xs">
                    <Sparkles size={11} className="text-[#00e5ff] animate-pulse" />
                    <span>{slide.tag}</span>
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-base sm:text-xl md:text-2xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
                  {slide.title}{' '}
                  {slide.highlightText && (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#38bdf8]">
                      {slide.highlightText}
                    </span>
                  )}
                </h2>

                {/* Description */}
                <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs md:text-sm text-slate-200/90 leading-snug line-clamp-2 drop-shadow-xs max-w-sm sm:max-w-md">
                  {slide.description}
                </p>

                {/* Price & CTA Button Row */}
                <div className="mt-2.5 sm:mt-3.5 flex items-center gap-2 sm:gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(slide);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#0052fe] via-[#0084ff] to-[#00e5ff] hover:from-[#0047dc] hover:to-[#00c8e0] text-white text-xs sm:text-sm font-bold shadow-md shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>កម្ម៉ង់ភ្លាមៗ</span>
                    <ArrowRight size={13} />
                  </button>

                  {/* Price Tag Capsule */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] sm:text-xs font-medium text-cyan-200 backdrop-blur-md">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span>{slide.priceBadge}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-950/60 hover:bg-[#0052fe]/80 border border-cyan-400/30 text-white backdrop-blur-md flex items-center justify-center shadow-lg active:scale-90 transition-all hover:scale-105 cursor-pointer opacity-85 hover:opacity-100"
        >
          <ChevronLeft size={18} className="text-cyan-100" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-950/60 hover:bg-[#0052fe]/80 border border-cyan-400/30 text-white backdrop-blur-md flex items-center justify-center shadow-lg active:scale-90 transition-all hover:scale-105 cursor-pointer opacity-85 hover:opacity-100"
        >
          <ChevronRight size={18} className="text-cyan-100" />
        </button>

        {/* Dots Pagination Indicators */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/10">
          {BANNER_SLIDES.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(dotIndex);
              }}
              aria-label={`Go to slide ${dotIndex + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === dotIndex
                  ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]'
                  : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
