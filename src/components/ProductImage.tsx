import React from 'react';
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react';
import { appendCacheBuster } from '../utils/imageStore';

interface ProductImageProps {
  type: string;
  className?: string;
  customSrc?: string | null;
  timestamp?: number;
}

export const ProductImage: React.FC<ProductImageProps> = ({ 
  type, 
  className = '', 
  customSrc,
  timestamp
}) => {
  if (customSrc) {
    const finalUrl = appendCacheBuster(customSrc, timestamp);
    return (
      <div className={`relative w-full h-full overflow-hidden bg-slate-100 flex items-center justify-center ${className}`}>
        <img 
          key={`${customSrc.slice(0, 32)}-${timestamp || 'default'}`}
          src={finalUrl} 
          alt="Product" 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
    );
  }

  if (type === 'gemini-banner') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50/40 p-2.5 sm:p-3 flex flex-col justify-between text-slate-900 border border-slate-100 select-none ${className}`}>
        {/* Top right "BEST VALUE" badge */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-blue-600 text-white text-[7px] sm:text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
          <span>★</span> BEST
        </div>

        {/* Gemini Sparkling Header */}
        <div className="pt-0.5">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-purple-100 flex items-center justify-center p-0.5 shadow-xs shrink-0">
              <Sparkles size={11} className="text-blue-600 fill-blue-600 sm:w-3.5 sm:h-3.5" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-sans">
                Gemini
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-blue-600">Pro</span>
              <span className="text-[7px] sm:text-[8px] px-1 py-0.2 rounded bg-blue-100 text-blue-700 font-mono font-bold">
                AI
              </span>
            </div>
          </div>

          <div className="mt-0.5 sm:mt-1 flex items-baseline gap-1">
            <span className="text-lg sm:text-2xl font-black text-slate-900 tracking-tighter leading-none">
              18
            </span>
            <div className="leading-tight">
              <div className="text-[9px] sm:text-[11px] font-black tracking-wide text-slate-800 uppercase">MONTHS</div>
              <div className="text-[7px] sm:text-[8px] font-bold text-blue-600 uppercase tracking-widest">PLAN</div>
            </div>
          </div>
        </div>

        {/* 4 Feature Badges Grid */}
        <div className="grid grid-cols-2 gap-1 sm:gap-1.5 my-auto text-[7px] sm:text-[8px]">
          <div className="p-1 rounded-lg bg-white border border-slate-100 shadow-2xs flex items-center gap-1">
            <Cpu size={9} className="text-blue-600 shrink-0" />
            <span className="truncate text-slate-700 font-medium">Advanced AI</span>
          </div>
          <div className="p-1 rounded-lg bg-white border border-slate-100 shadow-2xs flex items-center gap-1">
            <Zap size={9} className="text-amber-500 shrink-0" />
            <span className="truncate text-slate-700 font-medium">Ultra Fast</span>
          </div>
          <div className="p-1 rounded-lg bg-white border border-slate-100 shadow-2xs flex items-center gap-1">
            <Sparkles size={9} className="text-pink-500 shrink-0" />
            <span className="truncate text-slate-700 font-medium">Smart Gen</span>
          </div>
          <div className="p-1 rounded-lg bg-white border border-slate-100 shadow-2xs flex items-center gap-1">
            <Shield size={9} className="text-emerald-500 shrink-0" />
            <span className="truncate text-slate-700 font-medium">Reliable</span>
          </div>
        </div>

        {/* Bottom Banner Footer */}
        <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[7px] sm:text-[7.5px] text-slate-500 font-medium">
          <span>⚡ Fast • Smart</span>
          <span className="text-emerald-600 font-semibold">🛡️ Trusted 100%</span>
        </div>
      </div>
    );
  }

  if (type === 'gemini-logo') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-white flex flex-col items-center justify-center p-2.5 sm:p-4 border border-slate-100 shadow-inner select-none ${className}`}>
        <div className="flex items-center justify-center scale-90 sm:scale-110">
          <svg className="w-8 h-8 sm:w-12 sm:h-12 mr-1" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>

          <div className="relative">
            <span className="text-xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#4285F4] via-[#7B1FA2] to-[#80D8FF] bg-clip-text text-transparent font-sans">
              emini
            </span>
            <div className="absolute -top-2 right-1 text-[#80D8FF] animate-pulse">
              ✦
            </div>
          </div>
        </div>

        <div className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          Google AI Workspace
        </div>
      </div>
    );
  }

  if (type === 'capcut') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-white flex flex-col items-center justify-center p-2.5 sm:p-4 border border-slate-100 shadow-inner select-none ${className}`}>
        <div className="w-12 h-12 sm:w-18 sm:h-18 flex items-center justify-center">
          <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
            <path d="M 12 18 L 88 18 C 88 18 64 45 50 45 C 36 45 12 18 12 18 Z" />
            <path d="M 12 82 L 88 82 C 88 82 64 55 50 55 C 36 55 12 82 12 82 Z" />
            <line x1="22" y1="26" x2="78" y2="74" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <line x1="78" y1="26" x2="22" y2="74" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
        <div className="mt-1 text-[8px] sm:text-[10px] font-bold text-slate-900 tracking-wider uppercase">
          CapCut Pro
        </div>
      </div>
    );
  }

  if (type === 'grok') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-white flex flex-col items-center justify-center p-2.5 sm:p-4 border border-slate-100 shadow-inner select-none text-slate-900 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-xs">
            <span className="text-xl sm:text-2xl font-black text-slate-900">𝕏</span>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight font-sans text-slate-900">
            Grok
          </span>
        </div>
        <div className="mt-1.5 text-[7.5px] sm:text-[9px] font-bold tracking-widest text-slate-500 uppercase">
          xAI • Super Intelligence
        </div>
      </div>
    );
  }

  if (type === 'chatgpt') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-white flex flex-col items-center justify-center p-2.5 sm:p-4 border border-slate-100 shadow-inner select-none ${className}`}>
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#10a37f]/10 border border-[#10a37f]/30 flex items-center justify-center text-[#10a37f] shadow-xs mb-1 sm:mb-2">
          <Sparkles size={20} className="sm:w-7 sm:h-7" />
        </div>
        <span className="text-xs sm:text-sm font-black text-slate-900">ChatGPT Plus</span>
        <span className="text-[7.5px] sm:text-[9px] text-[#10a37f] font-bold">GPT-4o & Canvas</span>
      </div>
    );
  }

  if (type === 'canva') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-white flex flex-col items-center justify-center p-2.5 sm:p-4 border border-slate-100 shadow-inner select-none text-slate-900 ${className}`}>
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#00c4cc] to-[#7d2ae8] flex items-center justify-center text-white shadow-sm mb-1">
          <span className="text-2xl sm:text-3xl font-black italic tracking-tight font-serif">
            C
          </span>
        </div>
        <span className="text-xs sm:text-sm font-black text-slate-900">Canva Pro</span>
        <span className="text-[7.5px] sm:text-[8.5px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-1 uppercase tracking-wide">
          PRO VIP
        </span>
      </div>
    );
  }

  if (type === 'netflix') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-white flex flex-col items-center justify-center p-2.5 sm:p-4 border border-slate-100 shadow-inner select-none ${className}`}>
        <span className="text-2xl sm:text-4xl font-black text-[#E50914] tracking-tighter drop-shadow-xs font-sans">
          NETFLIX
        </span>
        <span className="text-[7.5px] sm:text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 tracking-widest mt-1 sm:mt-2 uppercase">
          4K ULTRA HD
        </span>
      </div>
    );
  }

  if (type === 'youtube') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-white flex flex-col items-center justify-center p-2.5 sm:p-4 border border-slate-100 shadow-inner select-none ${className}`}>
        <div className="w-12 h-8 sm:w-16 sm:h-11 bg-[#FF0000] rounded-lg sm:rounded-xl flex items-center justify-center shadow-md mb-1 sm:mb-2">
          <div className="w-0 h-0 border-y-[4px] sm:border-y-[6px] border-y-transparent border-l-[8px] sm:border-l-[12px] border-l-white ml-0.5"></div>
        </div>
        <span className="text-xs sm:text-sm font-black text-slate-900">YouTube Premium</span>
        <span className="text-[7.5px] sm:text-[9px] text-slate-500 font-medium">គ្មានពាណិជ្ជកម្ម No Ads</span>
      </div>
    );
  }

  if (type === 'claude') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-white flex flex-col items-center justify-center p-2.5 sm:p-4 border border-slate-100 shadow-inner select-none ${className}`}>
        <div className="w-11 h-11 sm:w-15 sm:h-15 rounded-2xl bg-amber-50/90 border border-amber-200/60 flex items-center justify-center shadow-xs mb-1 sm:mb-1.5">
          <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-9 sm:h-9 text-[#D97706]" fill="currentColor">
            <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v3.25a1.5 1.5 0 0 1-3 0V3.5A1.5 1.5 0 0 1 12 2zm7.07 3.43a1.5 1.5 0 0 1 0 2.12l-2.3 2.3a1.5 1.5 0 0 1-2.12-2.12l2.3-2.3a1.5 1.5 0 0 1 2.12 0zM22 12a1.5 1.5 0 0 1-1.5 1.5h-3.25a1.5 1.5 0 0 1 0-3h3.25A1.5 1.5 0 0 1 22 12zm-3.43 7.07a1.5 1.5 0 0 1-2.12 0l-2.3-2.3a1.5 1.5 0 0 1 2.12-2.12l2.3 2.3a1.5 1.5 0 0 1 0 2.12zM12 22a1.5 1.5 0 0 1-1.5-1.5v-3.25a1.5 1.5 0 0 1 3 0v3.25A1.5 1.5 0 0 1 12 22zm-7.07-3.43a1.5 1.5 0 0 1 0-2.12l2.3-2.3a1.5 1.5 0 0 1 2.12 2.12l-2.3 2.3a1.5 1.5 0 0 1-2.12 0zM2 12a1.5 1.5 0 0 1 1.5-1.5h3.25a1.5 1.5 0 0 1 0 3H3.5A1.5 1.5 0 0 1 2 12zm3.43-7.07a1.5 1.5 0 0 1 2.12 0l2.3 2.3a1.5 1.5 0 0 1-2.12 2.12l-2.3-2.3a1.5 1.5 0 0 1 0-2.12z" />
            <circle cx="12" cy="12" r="3" fill="#D97706" />
          </svg>
        </div>
        <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">Claude 3.5</span>
        <span className="text-[7.5px] sm:text-[9px] text-[#D97706] font-bold">Anthropic AI</span>
      </div>
    );
  }

  if (type === 'spotify') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-white flex flex-col items-center justify-center p-2.5 sm:p-4 border border-slate-100 shadow-inner select-none ${className}`}>
        <div className="w-11 h-11 sm:w-15 sm:h-15 rounded-full bg-[#1DB954] flex items-center justify-center shadow-md mb-1 sm:mb-1.5 p-2">
          <svg viewBox="0 0 24 24" className="w-full h-full text-black fill-current">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.215.353-.676.467-1.03.25-2.825-1.727-6.381-2.117-10.57-1.161-.403.092-.806-.157-.898-.56-.092-.403.157-.806.56-.898 4.587-1.048 8.52-.607 11.688 1.339.354.217.467.677.25 1.03zm1.467-3.262c-.27.441-.849.58-1.29.31-3.235-1.988-8.167-2.563-11.994-1.401-.497.151-1.026-.134-1.177-.63-.151-.496.134-1.025.63-1.176 4.375-1.328 9.81-.689 13.52 1.597.441.27.58.849.311 1.3zm.126-3.41c-3.88-2.304-10.28-2.516-13.987-1.39-.597.181-1.233-.16-1.414-.757-.182-.597.16-1.233.757-1.414 4.257-1.293 11.328-1.045 15.787 1.603.537.319.713 1.018.394 1.555-.319.537-1.018.713-1.537.403z"/>
          </svg>
        </div>
        <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">Spotify</span>
        <span className="text-[7.5px] sm:text-[9px] text-[#1DB954] font-bold">Premium Music</span>
      </div>
    );
  }

  if (type === 'telegram') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-white flex flex-col items-center justify-center p-2.5 sm:p-4 border border-slate-100 shadow-inner select-none ${className}`}>
        <div className="w-11 h-11 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-[#229ED9] to-[#2AABEE] flex items-center justify-center shadow-md mb-1 sm:mb-1.5 p-2">
          <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-current">
            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.03 9.58c-.15.68-.56.84-1.13.53l-3.14-2.31-1.52 1.46c-.17.17-.31.31-.63.31l.23-3.21 5.84-5.28c.25-.23-.06-.35-.39-.14l-7.22 4.55-3.11-.97c-.68-.21-.69-.68.14-1l12.18-4.7c.56-.21 1.06.14.76 1.18z"/>
          </svg>
        </div>
        <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">Telegram</span>
        <span className="text-[7.5px] sm:text-[9px] text-[#229ED9] font-bold">Premium VIP</span>
      </div>
    );
  }

  if (type === 'duolingo') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-white flex flex-col items-center justify-center p-2.5 sm:p-4 border border-slate-100 shadow-inner select-none ${className}`}>
        <div className="w-11 h-11 sm:w-15 sm:h-15 rounded-2xl bg-[#58CC02] flex items-center justify-center shadow-md mb-1 sm:mb-1.5 p-1.5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#58CC02"/>
            <ellipse cx="36" cy="46" rx="14" ry="17" fill="white"/>
            <ellipse cx="64" cy="46" rx="14" ry="17" fill="white"/>
            <circle cx="36" cy="46" r="8" fill="#1C3805"/>
            <circle cx="64" cy="46" r="8" fill="#1C3805"/>
            <circle cx="38" cy="43" r="3" fill="white"/>
            <circle cx="66" cy="43" r="3" fill="white"/>
            <path d="M 44 54 Q 50 64 56 54 Z" fill="#FF9600" stroke="#E58500" strokeWidth="2"/>
          </svg>
        </div>
        <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">Duolingo</span>
        <span className="text-[7.5px] sm:text-[9px] text-[#58CC02] font-black">SUPER</span>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-xl sm:rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 ${className}`}>
      <Sparkles size={24} className="sm:w-8 sm:h-8" />
    </div>
  );
};
