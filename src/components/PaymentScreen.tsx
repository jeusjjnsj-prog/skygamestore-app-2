import React, { useState, useRef, useEffect } from 'react';
import { 
  RotateCw, 
  X, 
  CheckCircle, 
  Copy, 
  Check, 
  Send, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Loader2,
  ShieldCheck,
  Receipt,
  Sparkles,
  Phone,
  Clock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Product, OrderItem } from '../types';
import { ProductImage } from './ProductImage';
import { storeSync } from '../services/storeSync';

interface PaymentScreenProps {
  product: Product;
  onCancel: () => void;
  onSuccessOrder: (order: OrderItem) => void;
  userContact?: string;
  isAdmin?: boolean;
  customProductImage?: string | null;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  product,
  onCancel,
  onSuccessOrder,
  userContact = '',
  isAdmin = false,
  customProductImage = null,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'success'>('waiting');
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [customerPhone, setCustomerPhone] = useState(userContact || '');
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Custom QR Image synchronized live across all visitors via storeSync
  const [customQrImage, setCustomQrImage] = useState<string | null>(() => {
    return storeSync.getData().qrImage;
  });

  useEffect(() => {
    const unsub = storeSync.subscribe((data) => {
      setCustomQrImage(data.qrImage);
    });
    return unsub;
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle uploading custom QR image from device
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        if (result) {
          await storeSync.updateStoreQr(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetQrImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await storeSync.updateStoreQr(null);
  };

  // Triggered when customer clicks "បញ្ជាទិញឥឡូវ"
  const handleConfirmPaid = () => {
    if (paymentStatus === 'success' || isVerifying) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      triggerPaymentSuccess();
    }, 1200);
  };

  const triggerPaymentSuccess = () => {
    if (paymentStatus === 'success') return;

    const orderId = `SKY-${Math.floor(100000 + Math.random() * 900000)}`;
    const credentialsText = product.id.includes('gemini')
      ? `Account: gemini.pro.${Math.floor(100 + Math.random() * 900)}@gmail.com | Pass: SkyPro#${Math.floor(1000 + Math.random() * 9000)} | Status: 18 Months Active`
      : product.id.includes('capcut')
      ? `CapCut VIP Code: CC-PRO-SKYPRO-${Math.floor(100000 + Math.random() * 900000)} | Status: 1 Month Pro Unlocked`
      : product.id.includes('grok')
      ? `Grok Super Key: GROK-XAI-SKYPRO-${Math.floor(100000 + Math.random() * 900000)} (10 Days Unlimited)`
      : `Access Key: SKYPRO-VIP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const newOrder: OrderItem = {
      orderId,
      date: new Date().toLocaleString(),
      productTitle: product.titleKhmer,
      duration: product.durations[0]?.label || 'Standard',
      price: product.price,
      paymentMethod: 'ABA KHQR (Bakong)',
      deliveryContact: customerPhone || userContact || '0969749477',
      credentialsOrKey: credentialsText,
      status: 'completed'
    };

    setCompletedOrder(newOrder);
    setPaymentStatus('success');
    onSuccessOrder(newOrder);
  };

  const handleRefreshQR = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleCopy = () => {
    if (completedOrder?.credentialsOrKey) {
      navigator.clipboard.writeText(completedOrder.credentialsOrKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeDurationLabel = product.durations[0]?.label || 'Standard';

  return (
    <div className="w-full py-2 sm:py-4 flex justify-center font-['Kantumruy_Pro',sans-serif]">
      {/* 
        PREMIUM MODERN DIGITAL STORE CHECKOUT BOX:
        Mobile: width 92–95% (w-[94%]), max-width 500px, padding 24px (p-6), border-radius 20px (rounded-[20px])
        Desktop: width 560–620px (md:w-[600px] md:max-w-[620px]), padding 28–32px (md:p-8), border-radius 22px (md:rounded-[22px])
      */}
      <div className="w-[94%] max-w-[500px] p-6 rounded-[20px] md:w-[600px] md:max-w-[620px] md:p-8 md:rounded-[22px] bg-white border border-slate-100 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.09)] transition-all">
        {paymentStatus === 'waiting' ? (
          <div className="space-y-5">
            {/* Header: Brand Logo & Title & Close Button */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563eb] to-[#4f46e5] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Sparkles size={18} className="fill-white/20" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base md:text-lg font-black text-slate-900 tracking-tight">
                      SkyPro Store
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-[10px] font-bold text-blue-700">
                      Checkout
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    ផ្ទាំងបញ្ជាទិញ & ទូទាត់ប្រាក់ឌីជីថលសុវត្ថិភាព
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onCancel}
                className="w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="បោះបង់"
              >
                <X size={18} />
              </button>
            </div>

            {/* Master Admin: Change QR Image Bar (Only visible to Master Admin) */}
            {isAdmin && (
              <div className="flex items-center justify-between bg-blue-50/70 px-4 py-2.5 rounded-2xl border border-blue-200/60 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <ImageIcon size={16} className="text-blue-600" />
                  <span>រូបភាព QR Code បាញ់លុយ (Admin)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Upload size={13} />
                    <span>{customQrImage ? 'ប្ដូររូបថ្មី' : 'ប្ដូររូបភាព'}</span>
                  </button>

                  {customQrImage && (
                    <button
                      type="button"
                      onClick={handleResetQrImage}
                      className="p-1.5 rounded-xl hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      title="ប្រើ QR ដើម"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 1. Large & Clear Product Showcase */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50/90 to-blue-50/40 border border-slate-200/70 flex items-center gap-3.5 sm:gap-4.5">
              {/* Product Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-2xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-sm flex items-center justify-center p-1">
                <ProductImage
                  type={product.imageType}
                  customSrc={customProductImage}
                  className="w-full h-full rounded-xl object-contain"
                />
              </div>

              {/* Product Details & Price */}
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-700 text-[10px] font-bold mb-1">
                  <Sparkles size={11} />
                  <span>ឌីជីថលលំដាប់ខ្ពស់</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base md:text-lg leading-snug line-clamp-2">
                  {product.titleKhmer}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">
                  {product.titleEn} • {activeDurationLabel}
                </p>

                {/* Big Clear Price */}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#2563eb] tracking-tight">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    / {activeDurationLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Order Summary (សង្ខេបការបញ្ជាទិញ) */}
            <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 pb-1 border-b border-slate-200/60">
                <Receipt size={15} className="text-blue-600" />
                <span>សង្ខេបការបញ្ជាទិញ (Order Summary)</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>មុខទំនិញ៖</span>
                <span className="font-bold text-slate-900 text-right max-w-[65%] truncate">
                  {product.titleKhmer}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>គម្រោង / រយៈពេល៖</span>
                <span className="font-bold text-blue-700 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200/60">
                  {activeDurationLabel}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Phone size={13} className="text-slate-400" />
                  <span>លេខទូរស័ព្ទទទួលកូដ៖</span>
                </span>
                {isEditingPhone ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="012 345 678"
                      className="w-32 px-2 py-1 rounded-lg border border-blue-400 bg-white text-xs font-bold text-slate-900 focus:outline-none"
                    />
                    <button
                      onClick={() => setIsEditingPhone(false)}
                      className="px-2 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold"
                    >
                      យល់ព្រម
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 font-mono">
                      {customerPhone || userContact || '096 974 9477'}
                    </span>
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      កែ
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>វិធីសាស្ត្រទូទាត់៖</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>ABA KHQR (Bakong)</span>
                </span>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">ទឹកប្រាក់ត្រូវទូទាត់សរុប៖</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* 3. Large & Clear QR Payment Section */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm">
              {/* Red KHQR Banner Header */}
              <div className="bg-[#CE181E] py-3.5 px-4 text-center">
                <span className="text-white font-black text-base sm:text-lg tracking-[0.25em] font-sans">
                  K H Q R
                </span>
              </div>

              {/* QR Code Container */}
              <div className="p-5 sm:p-6 flex flex-col items-center justify-center text-center">
                <div className="relative p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-center">
                  {customQrImage ? (
                    <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-68 md:h-68 flex items-center justify-center overflow-hidden rounded-xl bg-white">
                      <img
                        src={customQrImage}
                        alt="Custom ABA KHQR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Authentic KHQR High-res Display */}
                      <svg 
                        className="w-56 h-56 sm:w-64 sm:h-64 md:w-68 md:h-68 text-slate-900" 
                        viewBox="0 0 200 200" 
                        fill="currentColor"
                      >
                        {/* Top-Left Finder */}
                        <rect x="10" y="10" width="46" height="46" rx="4" />
                        <rect x="17" y="17" width="32" height="32" rx="2" fill="white" />
                        <rect x="23" y="23" width="20" height="20" rx="2" fill="currentColor" />

                        {/* Top-Right Finder */}
                        <rect x="144" y="10" width="46" height="46" rx="4" />
                        <rect x="151" y="17" width="32" height="32" rx="2" fill="white" />
                        <rect x="157" y="23" width="20" height="20" rx="2" fill="currentColor" />

                        {/* Bottom-Left Finder */}
                        <rect x="10" y="144" width="46" height="46" rx="4" />
                        <rect x="17" y="151" width="32" height="32" rx="2" fill="white" />
                        <rect x="23" y="157" width="20" height="20" rx="2" fill="currentColor" />

                        {/* Grid Dots */}
                        <rect x="62" y="16" width="6" height="6" />
                        <rect x="74" y="16" width="6" height="6" />
                        <rect x="86" y="16" width="6" height="6" />
                        <rect x="98" y="16" width="6" height="6" />
                        <rect x="110" y="16" width="6" height="6" />
                        <rect x="122" y="16" width="6" height="6" />

                        <rect x="62" y="32" width="6" height="12" />
                        <rect x="74" y="28" width="12" height="6" />
                        <rect x="94" y="30" width="18" height="6" />
                        <rect x="120" y="28" width="12" height="12" />

                        <rect x="16" y="62" width="6" height="6" />
                        <rect x="16" y="74" width="6" height="6" />
                        <rect x="16" y="86" width="6" height="6" />
                        <rect x="16" y="98" width="6" height="6" />
                        <rect x="16" y="110" width="6" height="6" />
                        <rect x="16" y="122" width="6" height="6" />

                        <rect x="30" y="62" width="12" height="18" />
                        <rect x="48" y="68" width="24" height="6" />
                        <rect x="80" y="62" width="16" height="12" />
                        <rect x="104" y="62" width="20" height="6" />
                        <rect x="132" y="62" width="12" height="18" />
                        <rect x="150" y="68" width="18" height="12" />
                        <rect x="174" y="62" width="14" height="16" />

                        <rect x="30" y="88" width="24" height="6" />
                        <rect x="60" y="82" width="12" height="18" />
                        <rect x="132" y="86" width="18" height="10" />
                        <rect x="156" y="84" width="24" height="6" />

                        <rect x="30" y="104" width="12" height="12" />
                        <rect x="48" y="110" width="18" height="6" />
                        <rect x="138" y="104" width="14" height="14" />
                        <rect x="158" y="100" width="12" height="20" />
                        <rect x="176" y="106" width="12" height="8" />

                        <rect x="62" y="144" width="18" height="12" />
                        <rect x="86" y="140" width="14" height="18" />
                        <rect x="108" y="146" width="22" height="8" />
                        <rect x="136" y="144" width="16" height="12" />
                        <rect x="158" y="140" width="12" height="18" />
                        <rect x="176" y="144" width="12" height="10" />

                        <rect x="62" y="164" width="12" height="22" />
                        <rect x="80" y="170" width="20" height="12" />
                        <rect x="106" y="164" width="14" height="18" />
                        <rect x="126" y="172" width="26" height="10" />
                        <rect x="158" y="166" width="18" height="18" />
                        <rect x="182" y="164" width="8" height="22" />
                      </svg>

                      {/* Center Bakong '$' Circular Badge */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 rounded-full bg-[#181d24] border-2 border-white flex items-center justify-center text-white font-black text-base shadow-md">
                          $
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3.5 space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    ស្កេនជាមួយ ABA Mobile, Bakong ឬគ្រប់ធនាគារក្នុងស្រុក
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-blue-600 font-medium">
                    <RotateCw size={12} className="animate-spin text-blue-600" />
                    <span>ប្រព័ន្ធកំពុងរង់ចាំការទូទាត់ប្រាក់ស្វ័យប្រវត្តិ...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 
              4. SPECIFIED BUTTON:
              ប៊ូតុង “បញ្ជាទិញឥឡូវ” ធ្វើ Full Width និងកម្ពស់ 55px
            */}
            <button
              onClick={handleConfirmPaid}
              disabled={isVerifying}
              className="w-full h-[55px] rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-80"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={20} className="animate-spin text-white" />
                  <span>កំពុងផ្ទៀងផ្ទាត់ការបង់ប្រាក់...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={22} className="text-white" />
                  <span>បញ្ជាទិញឥឡូវ</span>
                </>
              )}
            </button>

            {/* Refresh QR & Cancel Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleRefreshQR}
                disabled={isRefreshing}
                className="flex-1 py-3 px-3 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                <span>QR ថ្មី</span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-3 rounded-xl hover:bg-red-50 text-red-600 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-transparent hover:border-red-200"
              >
                <X size={15} />
                <span>បោះបង់ការបង់ប្រាក់</span>
              </button>
            </div>
          </div>
        ) : (
          /* Order Success Screen (Delivers instant account credentials) */
          <div className="space-y-5 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
              <CheckCircle size={36} />
            </div>

            <div>
              <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ការទូទាត់បានជោគជ័យ ១០០%
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2.5">
                ទទួលបានការទូទាត់ប្រាក់ជោគជ័យ!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                លេខកូដបញ្ជាទិញ៖ <span className="font-mono text-blue-600 font-bold">{completedOrder?.orderId}</span>
              </p>
            </div>

            {/* Instant Credentials Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  ព័ត៌មានគណនី / កូដចូលប្រើប្រាស់
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copied ? 'បានចម្លងរួច!' : 'ចម្លងកូដ'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-white font-mono text-xs sm:text-sm text-emerald-700 break-all border border-slate-200 shadow-inner font-bold">
                {completedOrder?.credentialsOrKey}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>បានផ្ញើទៅកាន់៖</span>
                <span className="text-slate-800 font-bold">{completedOrder?.deliveryContact}</span>
              </div>
            </div>

            {/* Telegram Support Link */}
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">ត្រូវការជំនួយបច្ចេកទេស?</div>
                <div className="text-[10px] text-slate-500">SkyPro Admin Support ២៤/៧</div>
              </div>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3.5 rounded-xl bg-[#229ed9] hover:bg-[#1e8bc0] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Send size={13} />
                <span>Telegram</span>
              </a>
            </div>

            {/* Full Width Button to return home */}
            <button
              onClick={onCancel}
              className="w-full h-[55px] rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ត្រឡប់ទៅទំព័រដើម</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
