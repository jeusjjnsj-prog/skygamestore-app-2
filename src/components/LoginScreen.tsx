import React, { useState } from 'react';
import { User, LogOut, CheckCircle, Key, Copy, Check, Clock, ShieldCheck } from 'lucide-react';
import { OrderItem } from '../types';

interface LoginScreenProps {
  orders: OrderItem[];
  isLoggedIn?: boolean;
  userPhone?: string;
  onLoginSuccess?: (phone: string) => void;
  onLogout?: () => void;
  pendingCartCheckout?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  orders,
  isLoggedIn: externalIsLoggedIn,
  userPhone = '',
  onLoginSuccess,
  onLogout,
  pendingCartCheckout = false,
}) => {
  const [internalIsLoggedIn, setInternalIsLoggedIn] = useState(false);
  const isLoggedIn = externalIsLoggedIn !== undefined ? externalIsLoggedIn : internalIsLoggedIn;

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [phone, setPhone] = useState(userPhone || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMessage('សូមបញ្ចូលលេខទូរស័ព្ទ');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('សូមបញ្ចូលពាក្យសម្ងាត់');
      return;
    }
    setErrorMessage('');
    if (onLoginSuccess) {
      onLoginSuccess(phone);
    } else {
      setInternalIsLoggedIn(true);
    }
  };

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      setInternalIsLoggedIn(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (isLoggedIn) {
    const cleanPhone = (phone || userPhone || '').replace(/\s+/g, '');
    const filteredOrders = orders.filter(
      (o) => o.deliveryContact.replace(/\s+/g, '') === cleanPhone
    );

    return (
      <div className="space-y-4 font-['Kantumruy_Pro',sans-serif] pb-12">
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3b82f6] to-[#6366f1] text-white flex items-center justify-center font-bold shadow-sm">
              <User size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {name || 'អតិថិជន Skypro VIP'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {phone || userPhone}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogoutAction}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors font-medium cursor-pointer"
          >
            <LogOut size={14} />
            <span>ចាកចេញ</span>
          </button>
        </div>

        {/* User Orders & Licenses */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock size={15} className="text-blue-600" />
              <span>កូដគណនី & ប្រវត្តិបញ្ជាទិញរបស់អ្នក ({filteredOrders.length})</span>
            </h2>
            <span className="text-[11px] text-emerald-600 font-medium">សកម្ម</span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-xs text-slate-400 text-xs space-y-1">
              <p className="font-medium text-slate-600">មិនទាន់មានប្រវត្តិបញ្ជាទិញសម្រាប់លេខនេះទេ</p>
              <p className="text-[11px] text-slate-400">ទំនិញដែលបានទិញដោយលេខទូរស័ព្ទ {phone || userPhone} នឹងបង្ហាញនៅទីនេះ</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-2.5 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {order.productTitle}
                    </h4>
                    <span className="text-[11px] text-blue-600 font-medium">
                      {order.duration}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {order.date} • {order.deliveryContact}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-[#2563eb]">
                      ${order.price.toFixed(2)}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full block mt-0.5">
                      ជោគជ័យ
                    </span>
                  </div>
                </div>

                {order.credentialsOrKey && (
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <Key size={13} className="text-blue-600 shrink-0" />
                      <span className="text-xs font-mono text-emerald-700 font-bold truncate">
                        {order.credentialsOrKey}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(order.credentialsOrKey)}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 shadow-2xs shrink-0"
                      title="ចម្លងកូដ"
                    >
                      {copiedId === order.credentialsOrKey ? (
                        <Check size={13} className="text-emerald-600" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="font-['Kantumruy_Pro',sans-serif] pt-2 pb-12">
      {/* Login Card - Exact Match to IMG_1187.png */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-xs p-5 sm:p-6 space-y-4">
        {/* Title */}
        <h1 className="text-[19px] sm:text-[21px] font-bold text-slate-900 tracking-tight">
          {isRegisterMode ? 'បង្កើតគណនី' : 'ចូលប្រើ'}
        </h1>

        {pendingCartCheckout && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <span>💡</span>
            <span>សូមបង្កើតគណនី ឬចូលប្រើ ដើម្បីបន្តការទូទាត់ទំនិញក្នុងកន្ត្រក</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegisterMode && (
            <div>
              <label className="text-xs font-medium text-slate-800 mb-1.5 block">
                ឈ្មោះពេញ (Full Name)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ឧ. សុខ សំណាង"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
              />
            </div>
          )}

          {/* Phone Number Field */}
          <div>
            <label className="text-xs font-medium text-slate-800 mb-1.5 block">
              លេខទូរស័ព្ទ
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="012 345 678"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="text-xs font-medium text-slate-800 mb-1.5 block">
              ពាក្យសម្ងាត់
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
            />
          </div>

          {errorMessage && (
            <p className="text-[11px] text-red-500 font-medium">
              {errorMessage}
            </p>
          )}

          {/* Action Button: Royal Blue matching screenshot */}
          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 rounded-2xl bg-[#4344e6] hover:bg-[#3839d4] text-white font-medium text-xs sm:text-sm shadow-xs transition-all active:scale-[0.98] mt-2"
          >
            {isRegisterMode ? 'បង្កើតគណនី' : 'ចូលប្រើ'}
          </button>
        </form>

        {/* Footer Toggle Link: មិនទាន់មានគណនី? បង្កើតគណនី */}
        <div className="text-center text-xs text-slate-600 pt-2">
          {isRegisterMode ? (
            <span>
              មានគណនីរួចហើយ?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="text-blue-600 font-bold hover:underline"
              >
                ចូលប្រើ
              </button>
            </span>
          ) : (
            <span>
              មិនទាន់មានគណនី?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="text-blue-600 font-bold hover:underline"
              >
                បង្កើតគណនី
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
