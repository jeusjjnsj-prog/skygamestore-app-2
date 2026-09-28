import React from 'react';
import { Sparkles, Shield, Cpu, Zap, Lock } from 'lucide-react';

interface ProductImageProps {
  type: string;
  className?: string;
  customSrc?: string | null;
}

export const ProductImage: React.FC<ProductImageProps> = ({ type, className = '', customSrc }) => {
  if (customSrc) {
    return (
      <div className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center ${className}`}>
        <img src={customSrc} alt="Product" className="w-full h-full object-cover rounded-2xl" />
      </div>
    );
  }

  if (type === 'gemini-banner') {
    return (
      <div className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1638] via-[#101944] to-[#0a0f2b] p-3 flex flex-col justify-between text-white border border-blue-900/40 select-none shadow-inner ${className}`}>
        {/* Top right "BEST VALUE" badge */}
        <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-400/40 shadow-sm flex items-center gap-0.5">
          <span>★</span> BEST VALUE
        </div>

        {/* Gemini Sparkling Header */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5">
            {/* Sparkle icon */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 via-indigo-400 to-cyan-400 flex items-center justify-center p-0.5 shadow-md">
              <Sparkles size={11} className="text-white fill-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-indigo-200 bg-clip-text text-transparent font-sans">
                Gemini
              </span>
              <span className="text-xs font-bold text-cyan-300">Pro</span>
              <span className="text-[8px] px-1 py-0.2 rounded bg-indigo-500/40 text-cyan-200 border border-cyan-400/40 font-mono">
                AI
              </span>
            </div>
          </div>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white tracking-tighter leading-none">
              18
            </span>
            <div className="leading-tight">
              <div className="text-[11px] font-black tracking-wide text-blue-200 uppercase">MONTHS</div>
              <div className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest">PLAN</div>
            </div>
          </div>
        </div>

        {/* 4 Feature Badges Grid */}
        <div className="grid grid-cols-2 gap-1.5 my-auto text-[8px]">
          <div className="p-1 rounded bg-white/5 border border-white/10 flex items-center gap-1">
            <Cpu size={10} className="text-cyan-400 shrink-0" />
            <span className="truncate text-slate-200">Advanced AI Chat</span>
          </div>
          <div className="p-1 rounded bg-white/5 border border-white/10 flex items-center gap-1">
            <Zap size={10} className="text-amber-400 shrink-0" />
            <span className="truncate text-slate-200">Fast & Powerful</span>
          </div>
          <div className="p-1 rounded bg-white/5 border border-white/10 flex items-center gap-1">
            <Sparkles size={10} className="text-pink-400 shrink-0" />
            <span className="truncate text-slate-200">Smart Creation</span>
          </div>
          <div className="p-1 rounded bg-white/5 border border-white/10 flex items-center gap-1">
            <Shield size={10} className="text-emerald-400 shrink-0" />
            <span className="truncate text-slate-200">Secure & Reliable</span>
          </div>
        </div>

        {/* Bottom Banner Footer */}
        <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[7.5px] text-blue-300/80 font-medium">
          <span>⚡ Fast • Smart • Powerful</span>
          <span className="text-slate-400">🛡️ Trusted Access</span>
        </div>
      </div>
    );
  }

  if (type === 'gemini-logo') {
    return (
      <div className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-[#fafafa] flex flex-col items-center justify-center p-4 border border-slate-100 shadow-inner select-none ${className}`}>
        <div className="flex items-center justify-center scale-110">
          {/* Google G letter stylized */}
          <svg className="w-12 h-12 mr-1" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>

          {/* Gemini brand text in blue/purple with star */}
          <div className="relative">
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#4285F4] via-[#7B1FA2] to-[#80D8FF] bg-clip-text text-transparent font-sans">
              emini
            </span>
            <div className="absolute -top-2 right-1 text-[#80D8FF] animate-pulse">
              ✦
            </div>
          </div>
        </div>

        <div className="mt-3 text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
          Google AI Workspace
        </div>
      </div>
    );
  }

  if (type === 'capcut') {
    return (
      <div className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-white flex flex-col items-center justify-center p-4 border border-slate-100 shadow-inner select-none ${className}`}>
        {/* CapCut Official Black Geometric Ribbon / Bowtie Logo */}
        <div className="w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
            {/* Top wedge */}
            <path d="M 12 18 L 88 18 C 88 18 64 45 50 45 C 36 45 12 18 12 18 Z" />
            {/* Bottom wedge */}
            <path d="M 12 82 L 88 82 C 88 82 64 55 50 55 C 36 55 12 82 12 82 Z" />
            {/* Crossing bars */}
            <line x1="22" y1="26" x2="78" y2="74" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <line x1="78" y1="26" x2="22" y2="74" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  if (type === 'grok') {
    return (
      <div className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-[#0d0f14] flex flex-col items-center justify-center p-4 border border-slate-800 shadow-inner select-none text-white ${className}`}>
        {/* Grok official logo */}
        <div className="flex items-center gap-2">
          {/* Grok Slash Ring */}
          <div className="w-10 h-10 rounded-full border-[3px] border-white flex items-center justify-center relative">
            <div className="w-12 h-1 bg-white rotate-45 transform origin-center absolute"></div>
          </div>
          <span className="text-3xl font-black tracking-tight font-sans text-white">
            Grok
          </span>
        </div>
        <div className="mt-2 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
          xAI • Elon Musk
        </div>
      </div>
    );
  }

  if (type === 'chatgpt') {
    return (
      <div className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-[#0c131a] flex flex-col items-center justify-center p-4 border border-slate-800 shadow-inner select-none ${className}`}>
        <div className="w-16 h-16 rounded-2xl bg-[#10a37f]/20 border border-[#10a37f]/50 flex items-center justify-center text-[#10a37f] shadow-lg mb-2">
          <Sparkles size={32} />
        </div>
        <span className="text-base font-extrabold text-white">ChatGPT Plus</span>
        <span className="text-[9px] text-[#10a37f] font-semibold">GPT-4o & Canvas</span>
      </div>
    );
  }

  if (type === 'canva') {
    return (
      <div className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-tr from-[#00c4cc] to-[#7d2ae8] flex flex-col items-center justify-center p-4 shadow-inner select-none text-white ${className}`}>
        <span className="text-3xl font-black italic tracking-tight font-serif drop-shadow-md">
          Canva
        </span>
        <span className="text-[10px] font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full mt-2 uppercase">
          PRO VIP
        </span>
      </div>
    );
  }

  if (type === 'netflix') {
    return (
      <div className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center p-4 border border-slate-900 shadow-inner select-none ${className}`}>
        <span className="text-4xl font-black text-[#E50914] tracking-tighter drop-shadow-md font-sans">
          NETFLIX
        </span>
        <span className="text-[9px] font-bold text-amber-400 tracking-widest mt-2 uppercase">
          4K ULTRA HD
        </span>
      </div>
    );
  }

  if (type === 'youtube') {
    return (
      <div className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-[#1f1f1f] flex flex-col items-center justify-center p-4 border border-slate-800 shadow-inner select-none ${className}`}>
        <div className="w-16 h-11 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-lg mb-2">
          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[12px] border-l-white ml-1"></div>
        </div>
        <span className="text-sm font-extrabold text-white">YouTube Premium</span>
        <span className="text-[9px] text-slate-400">គ្មានពាណិជ្ជកម្ម No Ads</span>
      </div>
    );
  }

  return (
    <div className={`w-full aspect-square rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 ${className}`}>
      <Sparkles size={32} />
    </div>
  );
};
