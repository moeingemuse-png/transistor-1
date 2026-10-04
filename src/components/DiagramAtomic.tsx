import React, { useState } from 'react';
import { Atom, Zap, Info, ShieldCheck } from 'lucide-react';

export const DiagramAtomic: React.FC = () => {
  const [mode, setMode] = useState<'pure' | 'n-type' | 'p-type'>('pure');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 my-6 text-slate-100 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-base">
            <Atom className="w-5 h-5" />
            <span>دیاگرام تعاملی ساختار اتمی و فرآیند دوپینگ (Doping)</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            مشاهده چیدمان ۴ الکترون لایه ظرفیت سیلیسیم و ایجاد الکترون آزاد یا حفره با افزودن ناخالصی
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs self-stretch sm:self-auto">
          <button
            onClick={() => setMode('pure')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              mode === 'pure'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            سیلیسیم خالص (Intrinsic)
          </button>
          <button
            onClick={() => setMode('n-type')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              mode === 'n-type'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            نوع N (با فسفر)
          </button>
          <button
            onClick={() => setMode('p-type')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              mode === 'p-type'
                ? 'bg-rose-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            نوع P (با بور)
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-80 my-4 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 600 320" className="w-full h-full max-h-80 select-none">
          <defs>
            <radialGradient id="siGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="pGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#083344" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="bGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#4c0519" stopOpacity="0.3" />
            </radialGradient>
            <filter id="glowEffect">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid covalent bond lines connecting 3x3 lattice */}
          {/* Horizontal lines */}
          <line x1="120" y1="80" x2="480" y2="80" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="120" y1="160" x2="480" y2="160" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="120" y1="240" x2="480" y2="240" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          {/* Vertical lines */}
          <line x1="180" y1="40" x2="180" y2="280" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="300" y1="40" x2="300" y2="280" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="420" y1="40" x2="420" y2="280" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

          {/* Covalent shared electron pairs along bonds around central atom */}
          {/* Top bond */}
          <circle cx="295" cy="115" r="4" fill="#60a5fa" />
          <circle cx="305" cy="115" r="4" fill="#60a5fa" />
          {/* Bottom bond */}
          <circle cx="295" cy="205" r="4" fill="#60a5fa" />
          <circle cx="305" cy="205" r="4" fill="#60a5fa" />
          {/* Left bond */}
          <circle cx="235" cy="155" r="4" fill="#60a5fa" />
          <circle cx="235" cy="165" r="4" fill="#60a5fa" />
          {/* Right bond */}
          {mode === 'p-type' ? (
            <>
              {/* Only 1 electron on the right, leaving a HOLE! */}
              <circle cx="360" cy="155" r="4" fill="#60a5fa" />
              {/* Visual Hole representation */}
              <g className="animate-pulse">
                <circle cx="360" cy="168" r="9" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="2 2" />
                <text x="360" y="172" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">+</text>
              </g>
            </>
          ) : (
            <>
              <circle cx="360" cy="155" r="4" fill="#60a5fa" />
              <circle cx="360" cy="165" r="4" fill="#60a5fa" />
            </>
          )}

          {/* Surrounding Silicon Atoms */}
          {[
            { x: 180, y: 80 }, { x: 300, y: 80 }, { x: 420, y: 80 },
            { x: 180, y: 160 },                   { x: 420, y: 160 },
            { x: 180, y: 240 }, { x: 300, y: 240 }, { x: 420, y: 240 },
          ].map((pos, idx) => (
            <g key={idx} transform={`translate(${pos.x}, ${pos.y})`}>
              <circle r="22" fill="url(#siGlow)" stroke="#3b82f6" strokeWidth="1.5" />
              <text y="4" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">Si</text>
              <text y="15" textAnchor="middle" fill="#93c5fd" fontSize="9">+14</text>
            </g>
          ))}

          {/* Central Atom */}
          {mode === 'pure' && (
            <g transform="translate(300, 160)">
              <circle r="26" fill="url(#siGlow)" stroke="#60a5fa" strokeWidth="2" filter="url(#glowEffect)" />
              <text y="5" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">Si</text>
              <text y="18" textAnchor="middle" fill="#93c5fd" fontSize="10">سیلیسیم (+14)</text>
            </g>
          )}

          {mode === 'n-type' && (
            <g transform="translate(300, 160)">
              <circle r="26" fill="url(#pGlow)" stroke="#06b6d4" strokeWidth="2" filter="url(#glowEffect)" />
              <text y="5" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">P</text>
              <text y="18" textAnchor="middle" fill="#a5f3fc" fontSize="10">فسفر (+15)</text>

              {/* Free extra electron orbiting or floating away */}
              <g className="animate-bounce">
                <circle cx="48" cy="-35" r="7" fill="#22d3ee" filter="url(#glowEffect)" />
                <text x="48" y="-32" fill="#082f49" fontSize="10" fontWeight="900" textAnchor="middle">-</text>
                {/* Motion arrow or trajectory */}
                <path d="M 28 -15 Q 38 -25 45 -30" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
              </g>
            </g>
          )}

          {mode === 'p-type' && (
            <g transform="translate(300, 160)">
              <circle r="26" fill="url(#bGlow)" stroke="#f43f5e" strokeWidth="2" filter="url(#glowEffect)" />
              <text y="5" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">B</text>
              <text y="18" textAnchor="middle" fill="#fecdd3" fontSize="10">بور (+13)</text>
            </g>
          )}

          {/* Legend Annotations */}
          <g transform="translate(20, 20)">
            <rect width="170" height="75" rx="6" fill="#090d16" fillOpacity="0.85" stroke="#1e293b" />
            <circle cx="15" cy="20" r="4" fill="#60a5fa" />
            <text x="30" y="24" fill="#94a3b8" fontSize="10">الکترون ظرفیت پیوندی</text>

            {mode === 'n-type' && (
              <>
                <circle cx="15" cy="45" r="6" fill="#22d3ee" />
                <text x="30" y="49" fill="#22d3ee" fontSize="10" fontWeight="bold">الکترون آزاد اضافی (حامل بار)</text>
              </>
            )}

            {mode === 'p-type' && (
              <>
                <circle cx="15" cy="45" r="6" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2 2" />
                <text x="30" y="49" fill="#f43f5e" fontSize="10" fontWeight="bold">حفره مثبت (کمبود ۱ الکترون)</text>
              </>
            )}

            {mode === 'pure' && (
              <text x="15" y="50" fill="#64748b" fontSize="10">تمام پیوندها تکمیل و قفل</text>
            )}
          </g>
        </svg>
      </div>

      {/* Explanation Banner Based on Mode */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 text-xs leading-relaxed">
        {mode === 'pure' && (
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">سیلیسیم خالص (بلور ذاتی): </span>
              هر اتم سیلیسیم با ۴ اتم همسایه پیوند اشتراکی دارد. همه ۸ جایگاه الکترونی پر هستند و هیچ حامل آزاد مفیدی وجود ندارد. در دمای اتاق، سیلیسیم خالص رسانایی بسیار ناچیزی شبیه عایق دارد.
            </div>
          </div>
        )}

        {mode === 'n-type' && (
          <div className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-300">نیمه‌رسانای نوع N (Negative Doped): </span>
              فسفر ۵ الکترون لایه ظرفیت دارد. ۴ الکترون در پیوند با سیلیسیم‌ها قفل می‌شوند اما الکترون پنجم آزادانه در بلور رها می‌شود. بار الکترون منفی است، به همین دلیل به آن نوع N می‌گویند. این الکترون‌ها به آسانی جریان الکتریکی را منتقل می‌کنند.
            </div>
          </div>
        )}

        {mode === 'p-type' && (
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-300">نیمه‌رسانای نوع P (Positive Doped): </span>
              بور فقط ۳ الکترون لایه ظرفیت دارد. بنابراین جای یک الکترون در پیوند با سیلیسیم همسایه خالی می‌ماند که به آن «حفره» (Hole) می‌گوییم. این حفره مانند بار مثبت رفتار کرده و الکترون‌های اتم‌های مجاور را جذب می‌کند و جریان را پیش می‌برد.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
