import React from 'react';
import { Send, Phone, ShieldCheck, Clock, HelpCircle, User, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HelpScreenProps {
  onOpenAccount: () => void;
  isLoggedIn?: boolean;
}

export const HelpScreen: React.FC<HelpScreenProps> = ({
  onOpenAccount,
  isLoggedIn = false,
}) => {
  const faqs = [
    {
      q: 'តើខ្ញុំនឹងទទួលបានគណនី ឬកូដកម្មវិធីដោយរបៀបណា?',
      a: 'បន្ទាប់ពីទូទាត់ប្រាក់តាម KHQR រួចរាល់ ប្រព័ន្ធនឹងបង្ហាញលេខកូដ ឬគណនីភ្លាមៗនៅលើអេក្រង់ ហើយក្រុមការងារនឹងផ្ញើជូនតាម Telegram របស់អ្នកផងដែរ។',
    },
    {
      q: 'តើសេវាកម្មមានការធានាយ៉ាងដូចម្តេច?',
      a: 'ផលិតផលទាំងអស់នៅ SkyPro Store ទទួលបានការធានា ១០០% ពេញមួយសុពលភាព។ ប្រសិនបើមានបញ្ហាបច្ចេកទេស យើងខ្ញុំនឹងជួសជុល ឬដូរគណនីថ្មីជូនភ្លាមៗ។',
    },
    {
      q: 'តើម៉ោងធ្វើការ និងការឆ្លើយតបយ៉ាងណាដែរ?',
      a: 'ក្រុមការងារ SkyPro Support ផ្តល់សេវាកម្ម ២៤ ម៉ោងលើ ២៤ ម៉ោង ៧ ថ្ងៃក្នុងមួយសប្តាហ៍ (24/7) ឆ្លើយតបរហ័សទាន់ចិត្តក្នុងរង្វង់ 1-5 នាទី។',
    },
  ];

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto space-y-4 sm:space-y-6 font-['Kantumruy_Pro']">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-2">
            <ShieldCheck size={14} className="text-amber-300" />
            <span>SkyPro Official Support 24/7</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            មជ្ឈមណ្ឌលជំនួយ និងទំនាក់ទំនង
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-md font-normal leading-relaxed">
            លោកអ្នកត្រូវការជំនួយ ឬមានសំណួរទាក់ទងនឹងការទិញគណនី App Pro? ក្រុមការងារយើងខ្ញុំរីករាយបម្រើលោកអ្នកជានិច្ច!
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <a
              href="https://t.me/skyprostore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-600 font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 active:scale-95 transition-all"
            >
              <Send size={15} />
              <span>ឆាតតាម Telegram ភ្លាមៗ</span>
            </a>

            <a
              href="tel:0969749477"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all active:scale-95"
            >
              <Phone size={14} />
              <span>096 974 9477</span>
            </a>
          </div>
        </div>
      </div>

      {/* Account / Order History Quick Access Card */}
      <div 
        onClick={onOpenAccount}
        className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group app-card-motion"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
              {isLoggedIn ? 'ផ្ទាំងគ្រប់គ្រង និងប្រវត្តិទិញ' : 'ចូលគណនី / មើលប្រវត្តិកម្ម៉ង់'}
            </h3>
            <p className="text-[11px] text-slate-500">
              ពិនិត្យមើលគណនី និងលេខកូដដែលបានទិញរួចរាល់
            </p>
          </div>
        </div>
        <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </div>

      {/* Guarantees Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-[11px] sm:text-xs">ធានាដូរថ្មី ១០០%</h4>
            <p className="text-[10px] text-slate-500">ធានាពេញសុពលភាព</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-[11px] sm:text-xs">ប្រគល់ជូនរហ័ស</h4>
            <p className="text-[10px] text-slate-500">ភ្លាមៗក្រោយទូទាត់</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
          <HelpCircle size={16} className="text-blue-600" />
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
            សំណួរដែលសួរញឹកញាប់ (FAQs)
          </h3>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <h5 className="font-bold text-slate-800 text-xs leading-snug">
                {idx + 1}. {faq.q}
              </h5>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
