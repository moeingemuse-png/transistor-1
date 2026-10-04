import React, { useState } from 'react';
import { ArrowLeftRight, Activity, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

export const DiagramPNJunction: React.FC = () => {
  const [bias, setBias] = useState<'none' | 'forward' | 'reverse'>('none');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 my-6 text-slate-100 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-base">
            <Activity className="w-5 h-5" />
            <span>دیاگرام تعاملی پیوند PN و لایه سد پتانسیل (Depletion Region)</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            مشاهده تشکیل لایه تخلیه در مرز اتصال P و N و چگونگی تأثیر ولتاژ بیرونی بر سد ۰.۷ ولتی
          </p>
        </div>

        {/* Bias Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs self-stretch sm:self-auto">
          <button
            onClick={() => setBias('none')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              bias === 'none'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            بدون ولتاژ (تعادل)
          </button>
          <button
            onClick={() => setBias('forward')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              bias === 'forward'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            بایاس مستقیم (&gt; 0.7V)
          </button>
          <button
            onClick={() => setBias('reverse')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              bias === 'reverse'
                ? 'bg-indigo-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            بایاس معکوس
          </button>
        </div>
      </div>

      {/* SVG Circuit Canvas */}
      <div className="relative w-full h-84 my-4 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 620 330" className="w-full h-full max-h-84 select-none">
          <defs>
            <linearGradient id="pSideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#881337" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4c0519" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="nSideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#164e63" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#083344" stopOpacity="0.8" />
            </linearGradient>
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="620" height="330" fill="url(#gridPattern)" />

          {/* External Connecting Wires */}
          <path d="M 70 120 L 30 120 L 30 260 L 260 260" fill="none" stroke="#475569" strokeWidth="2.5" />
          <path d="M 550 120 L 590 120 L 590 260 L 360 260" fill="none" stroke="#475569" strokeWidth="2.5" />

          {/* External Battery Source in Lower Path */}
          <g transform="translate(310, 260)">
            {bias === 'none' && (
              <>
                <circle r="14" fill="#0f172a" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />
                <text y="4" textAnchor="middle" fill="#64748b" fontSize="10">کلید باز</text>
              </>
            )}

            {bias === 'forward' && (
              <>
                {/* Long bar (+) on Left (P side), Short thick bar (-) on Right (N side) */}
                <line x1="-15" y1="-20" x2="-15" y2="20" stroke="#f59e0b" strokeWidth="4" />
                <line x1="15" y1="-10" x2="15" y2="10" stroke="#f59e0b" strokeWidth="6" />
                <line x1="-50" y1="0" x2="-15" y2="0" stroke="#f59e0b" strokeWidth="2.5" />
                <line x1="15" y1="0" x2="50" y2="0" stroke="#f59e0b" strokeWidth="2.5" />
                <text x="-25" y="-12" fill="#f59e0b" fontSize="13" fontWeight="bold">+</text>
                <text x="25" y="-12" fill="#f59e0b" fontSize="14" fontWeight="bold">-</text>
                <text y="35" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">باتری بایاس مستقیم (V &gt; 0.7V)</text>
              </>
            )}

            {bias === 'reverse' && (
              <>
                {/* Short bar (-) on Left (P side), Long bar (+) on Right (N side) */}
                <line x1="-15" y1="-10" x2="-15" y2="10" stroke="#6366f1" strokeWidth="6" />
                <line x1="15" y1="-20" x2="15" y2="20" stroke="#6366f1" strokeWidth="4" />
                <line x1="-50" y1="0" x2="-15" y2="0" stroke="#6366f1" strokeWidth="2.5" />
                <line x1="15" y1="0" x2="50" y2="0" stroke="#6366f1" strokeWidth="2.5" />
                <text x="-25" y="-12" fill="#6366f1" fontSize="14" fontWeight="bold">-</text>
                <text x="25" y="-12" fill="#6366f1" fontSize="13" fontWeight="bold">+</text>
                <text y="35" textAnchor="middle" fill="#818cf8" fontSize="11" fontWeight="bold">باتری بایاس معکوس (بستن سد)</text>
              </>
            )}
          </g>

          {/* Current flow arrows if forward biased */}
          {bias === 'forward' && (
            <g className="animate-pulse">
              <path d="M 120 260 L 90 260" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="100" y="250" fill="#22c55e" fontSize="11" fontWeight="bold" textAnchor="middle">شارش جریان I</text>
              <circle cx="280" cy="120" r="3" fill="#fbbf24" />
              <circle cx="340" cy="120" r="3" fill="#fbbf24" />
            </g>
          )}

          {/* MAIN SEMICONDUCTOR BAR */}
          {/* P-Type Region (Left) */}
          <rect x="70" y="50" width="240" height="140" fill="url(#pSideGrad)" stroke="#f43f5e" strokeWidth="1.5" rx="6" />
          <text x="140" y="78" fill="#fda4af" fontSize="14" fontWeight="bold">ناحیه نوع P (حفره‌ها +)</text>

          {/* N-Type Region (Right) */}
          <rect x="310" y="50" width="240" height="140" fill="url(#nSideGrad)" stroke="#06b6d4" strokeWidth="1.5" rx="6" />
          <text x="470" y="78" fill="#a5f3fc" fontSize="14" fontWeight="bold">ناحیه نوع N (الکترون‌ها -)</text>

          {/* Junction Line in center */}
          <line x1="310" y1="45" x2="310" y2="195" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* DEPLETION REGION OVERLAY */}
          {bias === 'none' && (
            <g>
              <rect x="250" y="50" width="120" height="140" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1.5" />
              {/* Negative Ions (Acceptors on P side) */}
              <circle cx="275" cy="85" r="9" fill="#881337" stroke="#f43f5e" strokeWidth="1" />
              <text x="275" y="89" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">-</text>
              <circle cx="275" cy="120" r="9" fill="#881337" stroke="#f43f5e" strokeWidth="1" />
              <text x="275" y="124" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">-</text>
              <circle cx="275" cy="155" r="9" fill="#881337" stroke="#f43f5e" strokeWidth="1" />
              <text x="275" y="159" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">-</text>

              {/* Positive Ions (Donors on N side) */}
              <circle cx="345" cy="85" r="9" fill="#155e75" stroke="#06b6d4" strokeWidth="1" />
              <text x="345" y="89" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">+</text>
              <circle cx="345" cy="120" r="9" fill="#155e75" stroke="#06b6d4" strokeWidth="1" />
              <text x="345" y="124" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">+</text>
              <circle cx="345" cy="155" r="9" fill="#155e75" stroke="#06b6d4" strokeWidth="1" />
              <text x="345" y="159" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">+</text>

              {/* Depletion Region Label */}
              <text x="310" y="38" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                لایه سد / ناحیه تخلیه (سد ۰.۷ ولت)
              </text>
            </g>
          )}

          {bias === 'forward' && (
            <g>
              {/* Very thin depletion layer */}
              <rect x="295" y="50" width="30" height="140" fill="#0f172a" fillOpacity="0.7" stroke="#22c55e" strokeWidth="1" strokeDasharray="2 2" />
              <text x="310" y="38" fill="#22c55e" fontSize="11" fontWeight="bold" textAnchor="middle">
                سد پتانسیل شکسته شد! (عرض سد نزدیک به صفر)
              </text>
              {/* Crossing electron stream */}
              <g className="animate-pulse">
                <path d="M 400 120 L 220 120" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 4" />
                <text x="310" y="112" fill="#38bdf8" fontSize="10" textAnchor="middle">هجوم الکترون‌ها</text>
              </g>
            </g>
          )}

          {bias === 'reverse' && (
            <g>
              {/* Very wide depletion layer */}
              <rect x="190" y="50" width="240" height="140" fill="#0f172a" fillOpacity="0.9" stroke="#6366f1" strokeWidth="2" />
              {/* Multiple rows of immobile ions */}
              {[215, 255].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy="85" r="8" fill="#881337" stroke="#f43f5e" />
                  <text x={x} y="89" fill="#fff" fontSize="10" textAnchor="middle">-</text>
                  <circle cx={x} cy="120" r="8" fill="#881337" stroke="#f43f5e" />
                  <text x={x} y="124" fill="#fff" fontSize="10" textAnchor="middle">-</text>
                  <circle cx={x} cy="155" r="8" fill="#881337" stroke="#f43f5e" />
                  <text x={x} y="159" fill="#fff" fontSize="10" textAnchor="middle">-</text>
                </g>
              ))}
              {[365, 405].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy="85" r="8" fill="#155e75" stroke="#06b6d4" />
                  <text x={x} y="89" fill="#fff" fontSize="10" textAnchor="middle">+</text>
                  <circle cx={x} cy="120" r="8" fill="#155e75" stroke="#06b6d4" />
                  <text x={x} y="124" fill="#fff" fontSize="10" textAnchor="middle">+</text>
                  <circle cx={x} cy="155" r="8" fill="#155e75" stroke="#06b6d4" />
                  <text x={x} y="159" fill="#fff" fontSize="10" textAnchor="middle">+</text>
                </g>
              ))}
              <text x="310" y="38" fill="#818cf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                سد تخلیه عریض شد! (دیوار نفوذناپذیر در برابر بارها)
              </text>
            </g>
          )}

          {/* Carrier dots in bulk regions */}
          {/* P region holes */}
          {[
            { x: 110, y: 95 }, { x: 140, y: 135 }, { x: 120, y: 165 }, { x: 160, y: 105 }
          ].map((pt, idx) => (
            <g key={idx}>
              <circle cx={pt.x} cy={pt.y} r="7" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2 2" />
              <text x={pt.x} y={pt.y + 3} fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">+</text>
            </g>
          ))}

          {/* N region free electrons */}
          {[
            { x: 470, y: 95 }, { x: 500, y: 135 }, { x: 460, y: 165 }, { x: 520, y: 105 }
          ].map((pt, idx) => (
            <g key={idx}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#38bdf8" />
              <text x={pt.x} y={pt.y + 3} fill="#082f49" fontSize="8" fontWeight="bold" textAnchor="middle">-</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Explanation Details */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 text-xs leading-relaxed">
        {bias === 'none' && (
          <div className="flex items-start gap-2.5">
            <ArrowLeftRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-emerald-300">حالت تعادل بدون بایاس (Unbiased Equilibrium): </span>
              الکترون‌های آزاد از مرز پیوند نفوذ کرده و با حفره‌ها ترکیب می‌شوند. این امر باعث می‌شود اتم‌های ناخالصی به یون‌های باردار ثابت (مثبت در سمت N و منفی در سمت P) تبدیل شوند. این ناحیه که خالی از الکترون آزاد و حفره است، سد پتانسیلی معادل ۰.۷ ولت (برای سیلیسیم) ایجاد می‌کند که مانع نفوذ بیشتر حامل‌هاست.
            </div>
          </div>
        )}

        {bias === 'forward' && (
          <div className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">بایاس مستقیم (Forward Bias): </span>
              قطب مثبت به ناحیه P و منفی به N وصل است. ولتاژ خارجی با میدان الکتریکی داخلی سد می‌جنگد. وقتی ولتاژ از ۰.۷ ولت عبور کند، دیواره سد فرو ریخته، عرض ناحیه تخلیه تقریباً صفر می‌شود و سیل عظیمی از الکترون‌ها و حفره‌ها به راحتی از پیوند عبور کرده و جریان برقرار می‌شود.
            </div>
          </div>
        )}

        {bias === 'reverse' && (
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-indigo-300">بایاس معکوس (Reverse Bias): </span>
              قطب مثبت باتری الکترون‌های آزاد ناحیه N را به سمت بیرون می‌کشد و قطب منفی باتری حفره‌های P را جذب می‌کند. در نتیجه عرض لایه سد پتانسیل عریض‌تر شده و یون‌های ساکن بیشتری آشکار می‌شوند. ترانزیستور/دیود در این حالت کاملاً مانند یک کلید قطع عمل کرده و جریانی عبور نمی‌دهد.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
