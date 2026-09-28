import React, { useState, useRef } from 'react';
import { 
  RotateCw, 
  X, 
  CheckCircle, 
  Copy, 
  Check, 
  Send,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Trash2,
  Loader2
} from 'lucide-react';
import { Product, OrderItem } from '../types';

interface PaymentScreenProps {
  product: Product;
  onCancel: () => void;
  onSuccessOrder: (order: OrderItem) => void;
  userContact?: string;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  product,
  onCancel,
  onSuccessOrder,
  userContact = '097 888 9999'
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'success'>('waiting');
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Custom QR Image uploaded by the user / store admin, stored in localStorage
  const [customQrImage, setCustomQrImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem('skypro_custom_qr') || null;
    } catch {
      return null;
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle uploading custom QR image from device
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomQrImage(result);
          try {
            localStorage.setItem('skypro_custom_qr', result);
          } catch {
            // ignore quota errors
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetQrImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomQrImage(null);
    try {
      localStorage.removeItem('skypro_custom_qr');
    } catch {
      // ignore
    }
  };

  const [isVerifying, setIsVerifying] = useState(false);

  // Triggered ONLY when customer clicks to confirm they transferred money
  const handleConfirmPaid = () => {
    if (paymentStatus === 'success' || isVerifying) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      triggerPaymentSuccess();
    }, 1500);
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
      deliveryContact: userContact,
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

  return (
    <div className="w-full max-w-md mx-auto sm:max-w-xl md:max-w-2xl px-4 py-3 sm:py-5 space-y-3.5 font-['Kantumruy_Pro',sans-serif]">
      {paymentStatus === 'waiting' ? (
        <>
          {/* Top Bar: Change QR Image Button (ប្ដូររូបភាព QR Code) */}
          <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <ImageIcon size={16} className="text-blue-600" />
              <span>រូបភាព QR Code បាញ់លុយ</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Upload / Change button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-medium flex items-center gap-1.5 transition-colors border border-blue-200/60 shadow-2xs"
              >
                <Upload size={13} />
                <span>{customQrImage ? 'ប្ដូររូបថ្មី' : 'ប្ដូររូបភាព'}</span>
              </button>

              {/* Reset to default button if custom image exists */}
              {customQrImage && (
                <button
                  type="button"
                  onClick={handleResetQrImage}
                  className="p-1.5 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                  title="ប្រើ QR ដើម"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Main White KHQR Card (Exact match to IMG_1188.png) */}
          <div className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-slate-100 transition-all">
            {/* Solid Red KHQR Banner */}
            <div className="bg-[#CE181E] py-3.5 px-4 text-center">
              <span className="text-white font-black text-base sm:text-lg tracking-[0.25em] font-sans">
                K H Q R
              </span>
            </div>

            {/* Card Content */}
            <div className="p-5 sm:p-6 space-y-3">
              {/* Payment description & Price */}
              <div>
                <div className="text-[13.5px] sm:text-sm font-medium text-slate-800">
                  បង់ប្រាក់ជាមួយ ABA KHQR
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
                  ${product.price.toFixed(2)}
                </div>
              </div>

              {/* Dashed Separator Line */}
              <div className="border-b border-dashed border-slate-200 pt-1"></div>

              {/* QR Code Display: either custom uploaded image OR default KHQR code */}
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="relative p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-center min-h-[224px]">
                  {customQrImage ? (
                    /* User's custom uploaded QR code image */
                    <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center overflow-hidden rounded-xl bg-white">
                      <img
                        src={customQrImage}
                        alt="Custom ABA KHQR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    /* Default Authentic KHQR SVG with Center '$' Emblem */
                    <div className="relative">
                      <svg 
                        className="w-56 h-56 sm:w-64 sm:h-64 text-slate-900" 
                        viewBox="0 0 200 200" 
                        fill="currentColor"
                      >
                        {/* Top-Left Finder Pattern */}
                        <rect x="10" y="10" width="46" height="46" rx="4" />
                        <rect x="17" y="17" width="32" height="32" rx="2" fill="white" />
                        <rect x="23" y="23" width="20" height="20" rx="2" fill="currentColor" />

                        {/* Top-Right Finder Pattern */}
                        <rect x="144" y="10" width="46" height="46" rx="4" />
                        <rect x="151" y="17" width="32" height="32" rx="2" fill="white" />
                        <rect x="157" y="23" width="20" height="20" rx="2" fill="currentColor" />

                        {/* Bottom-Left Finder Pattern */}
                        <rect x="10" y="144" width="46" height="46" rx="4" />
                        <rect x="17" y="151" width="32" height="32" rx="2" fill="white" />
                        <rect x="23" y="157" width="20" height="20" rx="2" fill="currentColor" />

                        {/* Grid Pattern Dots to simulate authentic KHQR data */}
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

                        {/* Body data blocks */}
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

                      {/* Centered Circular '$' Badge */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-[#181d24] border-2 border-white flex items-center justify-center text-white font-bold text-sm shadow-md">
                          $
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-2 font-medium">
                  ស្កេនជាមួយកម្មវិធី ABA Mobile ឬ Bakong App
                </span>
              </div>
            </div>
          </div>

          {/* Waiting Payment Status */}
          <div className="text-center pt-1 font-['Kantumruy_Pro']">
            <button
              onClick={triggerPaymentSuccess}
              className="inline-flex items-center justify-center gap-1.5 text-slate-500 hover:text-blue-600 text-xs font-normal py-1 px-3 rounded-full transition-colors cursor-pointer"
              title="ប្រព័ន្ធកំពុងរង់ចាំ Webhook ពីធនាគារ..."
            >
              <RotateCw size={13} className="text-blue-600 animate-spin" />
              <span>កំពុងរង់ចាំការទូទាត់ប្រាក់...</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Refresh QR button */}
            <button
              onClick={handleRefreshQR}
              disabled={isRefreshing}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs sm:text-sm font-medium shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <RotateCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
              <span>QR ថ្មី</span>
            </button>

            {/* Cancel Payment red text */}
            <button
              onClick={onCancel}
              className="w-full py-2 flex items-center justify-center gap-1 text-red-500 hover:text-red-600 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <X size={14} className="stroke-[2.5]" />
              <span>បោះបង់ការបង់ប្រាក់</span>
            </button>
          </div>
        </>
      ) : (
        /* Order Success & Instant Account Delivery */
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
            <CheckCircle size={36} />
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ការទូទាត់បានជោគជ័យ
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-2">
              ទទួលបានការទូទាត់ប្រាក់ជោគជ័យ!
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              លេខបញ្ជាទិញ៖ <span className="font-mono text-blue-600 font-bold">{completedOrder?.orderId}</span>
            </p>
          </div>

          {/* Account credentials box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                ព័ត៌មានគណនី / កូដចូលប្រើប្រាស់
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'ចម្លងរួចរាល់' : 'ចម្លងកូដ'}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white font-mono text-xs text-emerald-700 break-all border border-slate-200 shadow-inner font-bold">
              {completedOrder?.credentialsOrKey}
            </div>

            <div className="text-[11px] text-slate-500">
              បានផ្ញើទៅកាន់៖ <span className="text-slate-800 font-semibold">{completedOrder?.deliveryContact}</span>
            </div>
          </div>

          {/* Telegram Support Button */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">ត្រូវការជំនួយបច្ចេកទេស?</div>
              <div className="text-[10px] text-slate-500">Skypro Admin Support ២៤/៧</div>
            </div>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              className="py-2 px-3.5 rounded-xl bg-[#229ed9] hover:bg-[#1e8bc0] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Send size={13} />
              Telegram
            </a>
          </div>

          <button
            onClick={onCancel}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
          >
            ត្រឡប់ទៅទំព័រដើម
          </button>
        </div>
      )}
    </div>
  );
};
