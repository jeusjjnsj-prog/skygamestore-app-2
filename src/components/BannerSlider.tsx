import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../types';

export interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  highlightText?: string;
  description: string;
  priceBadge: string;
  productId?: string;
  category?: string;
}

interface BannerSliderProps {
  onSelectProduct?: (productId: string) => void;
  onExploreAll?: () => void;
  products?: Product[];
}

interface ShowcaseApp {
  id: string;
  name: string;
  badge: string;
  badgeGradient: string;
  productId: string;
  slideIndex: number;
  delayClass: string;
  glowColor: string;
}

const SHOWCASE_APPS: ShowcaseApp[] = [
  {
    id: 'gemini',
    name: 'Gemini Pro',
    badge: 'AI Pro',
    badgeGradient: 'from-blue-600 via-indigo-600 to-purple-600',
    productId: 'gemini-ai-pro-18m',
    slideIndex: 1,
    delayClass: 'animate-float-slow',
    glowColor: 'rgba(99, 102, 241, 0.2)',
  },
  {
    id: 'capcut',
    name: 'CapCut VIP',
    badge: '4K',
    badgeGradient: 'from-cyan-500 to-blue-600',
    productId: 'capcut-pro-1m',
    slideIndex: 0,
    delayClass: 'animate-float-delayed',
    glowColor: 'rgba(6, 182, 212, 0.2)',
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    badge: 'VIP',
    badgeGradient: 'from-amber-500 to-orange-500',
    productId: 'canva-pro-1y',
    slideIndex: 2,
    delayClass: 'animate-float-delayed',
    glowColor: 'rgba(245, 158, 11, 0.2)',
  },
  {
    id: 'grok',
    name: 'Grok AI',
    badge: 'Super AI',
    badgeGradient: 'from-violet-600 to-pink-600',
    productId: 'grok-xai-10d',
    slideIndex: 3,
    delayClass: 'animate-float-slow',
    glowColor: 'rgba(168, 85, 247, 0.2)',
  },
];

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'capcut-pro',
    tag: '🎬 កាត់តវីដេអូកម្រិតខ្ពស់ • Video Editing',
    title: 'CapCut Pro VIP',
    highlightText: 'គ្មាន Watermark',
    description: 'នាំចេញវីដេអូ 4K 60FPS • Pro Effects, Filters & Cloud Space 100GB រហ័សទាន់ចិត្ត',
    priceBadge: 'បញ្ចុះតម្លៃពិសេសត្រឹម $3.90',
    productId: 'capcut-pro-1m',
  },
  {
    id: 'gemini-ai',
    tag: '🤖 បញ្ញាសិប្បនិម្មិត • Advanced AI',
    title: 'Google Gemini Pro & AI',
    highlightText: 'ជំនួយការឆ្លាតវៃ',
    description: 'ដំណើរការម៉ូដែល Gemini 1.5/2.0 Pro • វិភាគទិន្នន័យ & សរសេរកូដល្បឿនលឿនបំផុត',
    priceBadge: 'សុពលភាពវែង ធានាពេញលេញ',
    productId: 'gemini-ai-pro-18m',
  },
  {
    id: 'canva-pro',
    tag: '🎨 ឌីហ្សាញរូបភាព • Graphic Design',
    title: 'Canva Pro 1 Year',
    highlightText: 'ដោះសោរគ្រប់យ៉ាង',
    description: 'ចូលរួម Team Pro ប្រើប្រាស់ Premium Templates & Magic AI គ្មានដែនកំណត់',
    priceBadge: 'តម្លៃពិសេសត្រឹម $1.99 / ឆ្នាំ',
    productId: 'canva-pro-1y',
  },
  {
    id: 'grok-ai',
    tag: '⚡ ហាងកម្មវិធី និងសេវាឌីជីថល • Official Store',
    title: 'Grok Super AI & VIP Apps',
    highlightText: 'ធានា ១០០%',
    description: 'គណនី App Pro & AI គុណភាពខ្ពស់បំផុត • ប្រគល់ជូនស្វ័យប្រវត្ត និង Support ២៤/៧',
    priceBadge: 'សេវាកម្មសុទ្ធ ១០០%',
    productId: 'grok-xai-10d',
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
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    setTouchMoveX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchMoveX !== null) {
      const diff = touchMoveX - touchStartX;
      const threshold = 40;
      if (diff < -threshold) {
        nextSlide();
      } else if (diff > threshold) {
        prevSlide();
      }
    }
    setTouchStartX(null);
    setTouchMoveX(null);
    setIsPaused(false);
  };

  const handleAction = (slide: BannerSlide) => {
    if (slide.productId && onSelectProduct) {
      onSelectProduct(slide.productId);
    } else if (onExploreAll) {
      onExploreAll();
    }
  };

  const currentSlide = BANNER_SLIDES[currentIndex];

  const renderAppLogo = (id: string) => {
    switch (id) {
      case 'gemini':
        return (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center p-1 border border-purple-100/80">
            <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 filter drop-shadow-xs">
              <defs>
                <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4285F4" />
                  <stop offset="50%" stopColor="#9B51E0" />
                  <stop offset="100%" stopColor="#EC407A" />
                </linearGradient>
              </defs>
              <path fill="url(#geminiGrad)" d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
            </svg>
          </div>
        );
      case 'capcut':
        return (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center p-1.5 shadow-xs border border-slate-700/50">
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6">
              <path fill="#ffffff" d="M3 5.5A1.5 1.5 0 0 1 4.5 4h3.6a1.5 1.5 0 0 1 1.25.67L12 9l2.65-4.33A1.5 1.5 0 0 1 15.9 4h3.6A1.5 1.5 0 0 1 21 5.5v1.8a1.5 1.5 0 0 1-.25.83L14.7 18.5a1.5 1.5 0 0 1-1.25.67h-2.9a1.5 1.5 0 0 1-1.25-.67L3.25 8.13A1.5 1.5 0 0 1 3 7.3V5.5z" />
              <path fill="#06B6D4" d="M12 9l2.65-4.33A1.5 1.5 0 0 1 15.9 4h3.6A1.5 1.5 0 0 1 21 5.5v1.8a1.5 1.5 0 0 1-.25.83L14.7 18.5a1.5 1.5 0 0 1-1.25.67h-2.9a1.5 1.5 0 0 1-1.25-.67L3.25 8.13A1.5 1.5 0 0 1 3 7.3V5.5A1.5 1.5 0 0 1 4.5 4h3.6a1.5 1.5 0 0 1 1.25.67L12 9z" opacity="0.3" />
            </svg>
          </div>
        );
      case 'canva':
        return (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#00C4CC] via-[#00a8cc] to-[#7D2AE8] flex items-center justify-center text-white font-serif font-black text-sm sm:text-base italic shadow-xs">
            C
          </div>
        );
      case 'grok':
        return (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-950 border border-slate-700/60 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-xs">
            <span className="bg-gradient-to-tr from-white via-cyan-200 to-sky-400 bg-clip-text text-transparent">𝕏</span>
          </div>
        );
      default:
        return <Zap size={20} className="text-blue-600" />;
    }
  };

  return (
    <div className="relative w-full group select-none font-['Kantumruy_Pro']">
      {/* Outer ambient soft glow with modern pastel reflections */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-100/70 via-indigo-50/60 to-sky-100/70 rounded-3xl blur-xl opacity-75 pointer-events-none" />

      {/* Main Hero Banner Box: Clean White / Soft Glassmorphism with Soft Glow Shadow and Light Grey Border */}
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl hero-glass-surface border border-slate-200/90 shadow-[0_12px_36px_rgba(59,130,246,0.08),0_2px_12px_rgba(0,0,0,0.03)] p-4 sm:p-6 md:p-7 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Decorative soft glass gradients */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-60 h-60 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />

        {/* Left Side: Typography, Tag, Description, and CTA Button */}
        <div className="relative z-10 flex-1 w-full max-w-xl text-left">
          {/* Badge Tag */}
          <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-[11px] sm:text-xs font-bold text-blue-700 shadow-2xs">
              <Sparkles size={12} className="text-blue-600 animate-pulse" />
              <span>{currentSlide.tag}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              ✓ ធានា ១០០%
            </span>
          </div>

          {/* Heading in Dark Bold Slate-900 with Comfortable Vibrancy */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {currentSlide.title}{' '}
            {currentSlide.highlightText && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
                {currentSlide.highlightText}
              </span>
            )}
          </h2>

          {/* Description Text */}
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg line-clamp-2 font-medium">
            {currentSlide.description}
          </p>

          {/* Price & CTA Row */}
          <div className="mt-3.5 sm:mt-4 flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* CTA Button "កម្ម៉ង់ភ្លាមៗ" with Vibrant Gradient (Indigo to Sky Blue) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAction(currentSlide);
              }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#4f46e5] via-[#2563eb] to-[#0284c7] hover:from-[#4338ca] hover:to-[#0369a1] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer app-button-press"
            >
              <span>កម្ម៉ង់ភ្លាមៗ</span>
              <ArrowRight size={14} />
            </button>

            {/* Price Tag Capsule */}
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100/90 border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-2xs">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>{currentSlide.priceBadge}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Showcase (2x2 Grid of 4 Logos: Gemini, CapCut, Canva, Grok) */}
        <div className="relative z-10 shrink-0 w-full sm:w-auto flex flex-col items-center">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full max-w-[280px] sm:max-w-none">
            {SHOWCASE_APPS.map((app) => (
              <div
                key={app.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectProduct) {
                    onSelectProduct(app.productId);
                  } else {
                    goToSlide(app.slideIndex);
                  }
                }}
                className={`relative rounded-2xl p-2.5 sm:p-3.5 bg-white/95 border border-slate-100/90 shadow-[0_6px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(59,130,246,0.18)] hover:border-blue-300 transition-all duration-300 ease-out cursor-pointer active:scale-95 group/app ${app.delayClass} flex flex-col items-center justify-center min-w-[76px] sm:min-w-[100px] md:min-w-[108px] aspect-square`}
                style={{
                  boxShadow: `0 8px 24px -4px ${app.glowColor}, 0 2px 6px -1px rgba(0,0,0,0.04)`
                }}
                title={`ចុចទិញ ${app.name}`}
              >
                {/* Mini Glowing Badge */}
                <div className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r ${app.badgeGradient} text-white text-[8px] sm:text-[9.5px] font-black uppercase tracking-wider shadow-sm scale-95 sm:scale-100`}>
                  {app.badge}
                </div>

                {/* App Logo */}
                <div className="transition-transform duration-300 group-hover/app:scale-110">
                  {renderAppLogo(app.id)}
                </div>

                {/* App Name */}
                <span className="mt-1 sm:mt-1.5 text-[10px] sm:text-xs font-bold text-slate-800 text-center tracking-tight group-hover/app:text-blue-600 transition-colors">
                  {app.name}
                </span>
              </div>
            ))}
          </div>

          {/* Dots Pagination Indicators */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-3.5">
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
                    ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Floating Slide Navigation Arrows (Frosted Glass) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous Slide"
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200/80 shadow-md backdrop-blur-md items-center justify-center active:scale-90 transition-all hover:scale-105 cursor-pointer opacity-70 hover:opacity-100"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next Slide"
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200/80 shadow-md backdrop-blur-md items-center justify-center active:scale-90 transition-all hover:scale-105 cursor-pointer opacity-70 hover:opacity-100"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
