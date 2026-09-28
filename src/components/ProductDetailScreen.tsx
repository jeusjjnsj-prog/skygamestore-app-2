import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Check, 
  ShoppingCart, 
  Send, 
  Clock, 
  AlertCircle, 
  Copy, 
  Info,
  Camera,
  Trash2
} from 'lucide-react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onBuyNow: (product: Product, durationIndex?: number) => void;
  onAddToCart: (product: Product, durationIndex?: number) => void;
  cartCount: number;
  onOpenCart: () => void;
  customImage?: string | null;
  onUpdateCustomImage?: (productId: string, dataUrl: string | null) => void;
  isAdmin?: boolean;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onBack,
  onBuyNow,
  onAddToCart,
  cartCount,
  onOpenCart,
  customImage,
  onUpdateCustomImage,
  isAdmin = false,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedDurationIndex, setSelectedDurationIndex] = useState(0);
  const selectedDuration = product.durations[selectedDurationIndex] || product.durations[0];
  const finalPrice = selectedDuration ? selectedDuration.price : product.price;

  // Customized, creative non-copied specifications for each product
  const getProductCustomDetails = () => {
    if (product.id.includes('gemini-pro-18m-admin')) {
      return {
        badge: 'Admin Harvest • សុពលភាពវែង',
        categoryTag: 'Google AI License',
        mainFeatures: [
          'គណនី Gemini Advanced AI Pro ផ្លូវការ សុពលភាព ១៨ ខែពេញលេញ',
          'ដំណើរការម៉ូដែល Gemini 1.5 Pro Context ធំទូលាយ 1M Tokens',
          'ទំហំផ្ទុកទិន្នន័យ Google Cloud Storage ធំទូលាយ 2TB - 5TB ភ្ជាប់មកជាមួយ',
          'សិទ្ធិប្រើប្រាស់ Imagen 3 AI & AI Video Generation Credits ប្រចាំខែ',
          'គណនីឯកជន ១០០% សុវត្ថិភាព មិនច្របូកច្របល់ទិន្នន័យជាមួយអ្នកដទៃ',
          'មិនចាំបាច់ភ្ជាប់កាតធនាគារផ្ទាល់ខ្លួន ចូលប្រើប្រាស់បានភ្លាមៗ',
          'ដំណើរការរលូនទូទាំងពិភពលោក មិនទាមទារ VPN',
          'ធានារ៉ាប់រង Support & ប្តូរគណនីថ្មីជូនភ្លាមៗរយៈពេល ៦០ ថ្ងៃ'
        ],
        importantNotes: [
          'ដើម្បីរក្សាសុវត្ថិភាពគណនី សូមកុំចែករំលែក Password ទៅកាន់អ្នកដទៃ',
          'ប្រព័ន្ធ Skypro Store ផ្ទៀងផ្ទាត់ និងប្រគល់គណនីជូនស្វ័យប្រវត្តិ ២៤/៧'
        ]
      };
    }

    if (product.id.includes('gemini-ai-pro-18m')) {
      return {
        badge: 'Official Workspace • 18 Months',
        categoryTag: 'Google Workspace AI',
        mainFeatures: [
          'គណនី Google Gemini AI Pro ផ្លូវការ សុពលភាព 18 ខែពេញ',
          'វិភាគទិន្នន័យស៊ីជម្រៅលើឯកសារ Code, PDF, Spreadsheet និងវីដេអូ',
          'មុខងារ Voice Conversation ឆ្លើយឆ្លងជាសំឡេងល្បឿនលឿន',
          'អាចចូលប្រើប្រាស់បានលើគ្រប់ឧបករណ៍ (ទូរស័ព្ទ, iPad និង PC)',
          'គណនីមានសុវត្ថិភាពខ្ពស់ មិនជាប់ Checkpoint',
          'ធានាពេញមួយសុពលភាពជាមួយសេវាកម្មប្តូរថ្មីប្រសិនបើមានបញ្ហា'
        ],
        importantNotes: [
          'ទទួលបាន Email និង Password ផ្លូវការភ្លាមៗក្រោយទូទាត់',
          'មានក្រុមការងារ Skypro Admin Support ជួយសម្រួលការ Login ជូន'
        ]
      };
    }

    if (product.id.includes('capcut')) {
      return {
        badge: 'CapCut VIP Team • No Watermark',
        categoryTag: 'Video Editing Pro',
        mainFeatures: [
          'គណនី CapCut Pro Team ផ្លូវការ — សុពលភាព ៣០ ថ្ងៃពេញ',
          'ដោះសោរាល់ Pro Transitions, Effects, Filters និង Pro Sound FX',
          'នាំចេញវីដេអូកម្រិត 4K 60FPS គ្មានស្លាកសញ្ញា (No Watermark)',
          'មុខងារ Auto Captions, Smart Script និង AI Cutout ល្បឿនលឿន',
          'ទំហំផ្ទុក Cloud Storage 100GB សម្រាប់រក្សាទុកគម្រោងកាត់ត',
          'អនុញ្ញាតឱ្យចូលប្រើប្រាស់លើឧបករណ៍ចំនួន ២ (កុំព្យូទ័រ និងទូរស័ព្ទ)'
        ],
        importantNotes: [
          'សូមកុំចាកចេញពី Space/Team ដែលបានកំណត់ ដើម្បីរក្សាសិទ្ធិ Pro រហូតដល់ផុតកំណត់',
          'ហាមចែករំលែកគណនី ឬប្តូរព័ត៌មាន Profile ដើម្បីងាយស្រួលក្នុងការធានា'
        ]
      };
    }

    if (product.id.includes('grok')) {
      return {
        badge: 'xAI by Elon Musk • Real-time AI',
        categoryTag: 'Uncensored AI Model',
        mainFeatures: [
          'គណនី SuperGrok ដំណើរការលើម៉ូដែល Grok 2 & Grok 3 AI ចុងក្រោយបំផុត',
          'ទាញទិន្នន័យព័ត៌មានថ្មីៗ និង Real-time ផ្ទាល់ពីបណ្តាញសង្គម X (Twitter)',
          'បង្កើតរូបភាព AI ឥតព្រំដែន គុណភាពខ្ពស់ជាមួយ Flux Core Engine',
          'Password អាចប្តូរបានតាមតម្រូវការផ្ទាល់ខ្លួនរបស់អ្នក',
          'ទម្រង់ទទួលទំនិញ៖ Mail | Password ចូលប្រើបានភ្លាមៗ',
          'ធានារ៉ាប់រងប្តូរជូនរយៈពេល ៣ ថ្ងៃដំបូង'
        ],
        importantNotes: [
          'គណនីដំណើរការបានរយៈពេលខ្ទង់ ៩ ទៅ ១០ ថ្ងៃ ស្របតាមប្រព័ន្ធ Bill Subscription Hold',
          'Email ដើមមិនអាចផ្លាស់ប្តូរបានទេ ប៉ុន្តែ Password អាចប្តូរបានដោយសេរី'
        ]
      };
    }

    // Default digital items
    return {
      badge: 'Skypro Premium License',
      categoryTag: 'Digital Subscription',
      mainFeatures: product.features,
      importantNotes: [
        'ផលិតផលឌីជីថលសុវត្ថិភាព ធានាពេញមួយសុពលភាព',
        'មានបញ្ហាបច្ចេកទេស អាចទាក់ទងមកកាន់ Skypro Admin តាម Telegram បានគ្រប់ពេល'
      ]
    };
  };

  const details = getProductCustomDetails();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Kantumruy_Pro',sans-serif] pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-blue-600 transition-colors p-1 rounded-xl hover:bg-slate-100 active:scale-95"
        >
          <ArrowLeft size={18} />
          <span>ថយក្រោយ</span>
        </button>

        <span className="text-xs font-semibold text-slate-800">
          ព័ត៌មានលម្អិតទំនិញ
        </span>

        <button
          onClick={onOpenCart}
          className="relative p-1.5 rounded-full hover:bg-slate-100 text-slate-800 transition-colors"
          title="កន្ត្រក"
        >
          <ShoppingCart size={19} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Main Detail Body */}
      <div className="w-full max-w-md mx-auto sm:max-w-xl md:max-w-2xl p-4 sm:p-5 space-y-4">
        {/* Product Image Banner Box */}
        <div className="rounded-3xl overflow-hidden shadow-xs border border-slate-100 bg-white p-3 space-y-2">
          {/* Change Image Bar - Visible ONLY to Master Admin */}
          {isAdmin && (
            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Camera size={13} />
                <span>ប្ដូររូបភាពផលិតផលពិត</span>
              </button>

              {customImage && (
                <button
                  onClick={() => onUpdateCustomImage && onUpdateCustomImage(product.id, null)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="ត្រឡប់ទៅរូបដើមវិញ"
                >
                  <Trash2 size={13} />
                  <span>រូបដើម</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onUpdateCustomImage) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const res = event.target?.result as string;
                      if (res) onUpdateCustomImage(product.id, res);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          )}

          <ProductImage 
            type={product.imageType} 
            customSrc={customImage} 
            className="w-full aspect-[4/3] rounded-2xl" 
          />
        </div>

        {/* Category Tag & Title & Price Header */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              {details.categoryTag}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>មានក្នុងស្តុក (In Stock)</span>
            </span>
          </div>

          <h1 className="text-[18px] sm:text-[20px] font-bold text-slate-900 leading-snug">
            {product.titleKhmer}
          </h1>

          {/* Large Price with KHR & Sales Count */}
          <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[28px] font-black text-[#2563eb] tracking-tight">
                ${finalPrice.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">
                ~{Math.round(finalPrice * 4100).toLocaleString()} ៛
              </span>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1">
              <span className="text-amber-500">🔥</span>
              <span>{product.salesCount} បានលក់</span>
            </div>
          </div>
        </div>

        {/* Duration / Package Selection (if multiple) */}
        {product.durations && product.durations.length > 1 && (
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              ជ្រើសរើសកញ្ចប់រយៈពេល (Choose Plan):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {product.durations.map((dur, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDurationIndex(idx)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    selectedDurationIndex === idx
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{dur.label}</div>
                  <div className="text-xs font-bold text-blue-600 mt-0.5">
                    ${dur.price.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SkyPro Guarantee Notice Box (Identical structure with shield icon, customized text) */}
        <div className="bg-white rounded-3xl p-4 border border-blue-100 shadow-xs flex items-start gap-3 bg-gradient-to-r from-blue-50/50 to-white">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
            <ShieldCheck size={18} />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-slate-900 text-xs">
              ព័ត៌មានពី Skypro Store
            </h4>
            <p className="text-[11.5px] text-slate-600 leading-relaxed font-normal">
              នេះជាសេវាផលិតផលឌីជីថលសុវត្ថិភាព។ ក្រោយពេលការបង់ប្រាក់ត្រូវបានផ្ទៀងផ្ទាត់ជោគជ័យ ប្រព័ន្ធនឹងផ្ញើទិន្នន័យ (លីង ឬកូដគណនី) ជូនភ្លាមៗលើផ្ទាំងនេះ និងក្នុងប្រវត្តិបញ្ជាទិញរបស់អ្នក។
            </p>
          </div>
        </div>

        {/* Delivery Method Info (Lightning icon) */}
        <div className="px-3 py-2 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2 font-medium">
          <Zap size={14} className="text-indigo-600 shrink-0" />
          <span>ជម្រើសនៃការដឹកជញ្ជូន៖ ប្រគល់ជូនស្វ័យប្រវត្តិតាម Telegram ឬ Email ភ្លាមៗ</span>
        </div>

        {/* Creative Checklist Details */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
            លក្ខណៈពិសេស & សិទ្ធិប្រើប្រាស់
          </h3>

          <div className="space-y-2 text-xs">
            {details.mainFeatures.map((feat, index) => (
              <div key={index} className="flex items-start gap-2.5 text-slate-700">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                  ✓
                </span>
                <span className="leading-relaxed font-normal">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes Box (Hand/Pen icon style) */}
        <div className="bg-amber-50/60 rounded-3xl p-4 border border-amber-200/80 shadow-xs space-y-1.5 text-xs text-amber-950">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <span>✍️</span>
            <span>ចំណាំសំខាន់ពី Skypro Store៖</span>
          </div>
          <ul className="space-y-1 text-[11.5px] text-amber-900/90 pl-1">
            {details.importantNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-2.5 shadow-[0_-4px_25px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto sm:max-w-xl md:max-w-2xl flex items-center justify-between gap-3">
          {/* Price Preview */}
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">តម្លៃសរុប៖</span>
            <span className="text-[20px] font-black text-[#2563eb] leading-tight">
              ${finalPrice.toFixed(2)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              onClick={() => onAddToCart(product, selectedDurationIndex)}
              className="py-2.5 px-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
            >
              <ShoppingCart size={14} />
              <span>ដាក់កន្ត្រក</span>
            </button>

            <button
              onClick={() => onBuyNow(product, selectedDurationIndex)}
              className="py-2.5 px-5 rounded-xl bg-[#4344e6] hover:bg-[#3839d6] text-white text-[13px] font-medium shadow-xs transition-all active:scale-[0.98] flex items-center justify-center min-w-[120px]"
            >
              ទិញឥឡូវ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
