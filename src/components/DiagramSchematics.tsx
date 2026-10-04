import React, { useState } from 'react';
import { GitCommit, Compass, HelpCircle, ArrowRight } from 'lucide-react';

export const DiagramSchematics: React.FC = () => {
  const [activePin, setActivePin] = useState<'none' | 'B' | 'C' | 'E'>('none');
  const [showDiodeModel, setShowDiodeModel] = useState<boolean>(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 my-6 text-slate-100 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-base">
            <Compass className="w-5 h-5" />
            <span>علائم شماتیک استاندارد ترانزیستور NPN و PNP و رمزگشایی جهت فلش</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            رمز حفظ جهت فلش امیتر: «NPN = Not Pointing iN» و «PNP = Pointing iN Proudly»
          </p>
        </div>

        <button
          onClick={() => setShowDiodeModel(!showDiodeModel)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
            showDiodeModel
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {showDiodeModel ? 'مخفی کردن مدل دیودی معادل' : 'مشاهده مدل دیودی معادل'}
        </button>
      </div>

      {/* Schematic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        {/* NPN Schematic Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-sm font-bold text-cyan-400">ترانزیستور NPN (تیپ پرکاربرد)</span>
            <span className="text-xs text-slate-500 font-mono">BC547 / 2N2222 / 2N3904</span>
          </div>

          <div className="relative w-64 h-52 flex items-center justify-center">
            <svg viewBox="0 0 240 200" className="w-full h-full select-none">
              {/* Outer Transistor Circle */}
              <circle cx="120" cy="100" r="45" fill="#090d16" stroke="#334155" strokeWidth="2" />

              {/* Base vertical bar */}
              <line
                x1="100"
                y1="75"
                x2="100"
                y2="125"
                stroke={activePin === 'B' ? '#f43f5e' : '#94a3b8'}
                strokeWidth={activePin === 'B' ? 5 : 4}
              />

              {/* Base terminal wire */}
              <line
                x1="40"
                y1="100"
                x2="100"
                y2="100"
                stroke={activePin === 'B' ? '#f43f5e' : '#94a3b8'}
                strokeWidth={activePin === 'B' ? 4 : 2.5}
              />
              <circle cx="40" cy="100" r="4" fill={activePin === 'B' ? '#f43f5e' : '#64748b'} />
              <text x="25" y="105" fill="#fda4af" fontSize="13" fontWeight="bold">B</text>

              {/* Collector wire (Top) */}
              <line
                x1="100"
                y1="85"
                x2="140"
                y2="60"
                stroke={activePin === 'C' ? '#2dd4bf' : '#94a3b8'}
                strokeWidth={activePin === 'C' ? 4 : 2.5}
              />
              <line
                x1="140"
                y1="60"
                x2="140"
                y2="20"
                stroke={activePin === 'C' ? '#2dd4bf' : '#94a3b8'}
                strokeWidth={activePin === 'C' ? 4 : 2.5}
              />
              <circle cx="140" cy="20" r="4" fill={activePin === 'C' ? '#2dd4bf' : '#64748b'} />
              <text x="155" y="28" fill="#99f6e4" fontSize="13" fontWeight="bold">C (کلکتور)</text>

              {/* Emitter wire (Bottom with ARROW POINTING OUT) */}
              <line
                x1="100"
                y1="115"
                x2="140"
                y2="140"
                stroke={activePin === 'E' ? '#38bdf8' : '#94a3b8'}
                strokeWidth={activePin === 'E' ? 4 : 2.5}
              />
              <line
                x1="140"
                y1="140"
                x2="140"
                y2="180"
                stroke={activePin === 'E' ? '#38bdf8' : '#94a3b8'}
                strokeWidth={activePin === 'E' ? 4 : 2.5}
              />
              <circle cx="140" cy="180" r="4" fill={activePin === 'E' ? '#38bdf8' : '#64748b'} />
              <text x="155" y="185" fill="#a5f3fc" fontSize="13" fontWeight="bold">E (امیتر)</text>

              {/* Arrow on Emitter pointing OUTWARDS */}
              <polygon points="128,126 142,142 120,138" fill="#38bdf8" />
            </svg>
          </div>

          <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
              <span>قاعده فلش در NPN:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              فلش روی پایه امیتر همیشه جهت شارش جریان قراردادی (جریان مثبت) را نشان می‌دهد. در NPN، فلش به سمت <strong>بیرون</strong> است:
              <span className="block mt-1 text-cyan-400 font-mono font-semibold">
                NPN = Not Pointing iN (به داخل اشاره نمی‌کند!)
              </span>
            </p>
          </div>
        </div>

        {/* PNP Schematic Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-sm font-bold text-rose-400">ترانزیستور PNP (مکمل NPN)</span>
            <span className="text-xs text-slate-500 font-mono">BC557 / 2N3906 / TIP32</span>
          </div>

          <div className="relative w-64 h-52 flex items-center justify-center">
            <svg viewBox="0 0 240 200" className="w-full h-full select-none">
              {/* Outer Transistor Circle */}
              <circle cx="120" cy="100" r="45" fill="#090d16" stroke="#334155" strokeWidth="2" />

              {/* Base vertical bar */}
              <line
                x1="100"
                y1="75"
                x2="100"
                y2="125"
                stroke={activePin === 'B' ? '#f43f5e' : '#94a3b8'}
                strokeWidth={activePin === 'B' ? 5 : 4}
              />

              {/* Base terminal wire */}
              <line
                x1="40"
                y1="100"
                x2="100"
                y2="100"
                stroke={activePin === 'B' ? '#f43f5e' : '#94a3b8'}
                strokeWidth={activePin === 'B' ? 4 : 2.5}
              />
              <circle cx="40" cy="100" r="4" fill={activePin === 'B' ? '#f43f5e' : '#64748b'} />
              <text x="25" y="105" fill="#fda4af" fontSize="13" fontWeight="bold">B</text>

              {/* Emitter wire on Top (or Bottom) with ARROW POINTING IN */}
              <line
                x1="100"
                y1="85"
                x2="140"
                y2="60"
                stroke={activePin === 'E' ? '#38bdf8' : '#94a3b8'}
                strokeWidth={activePin === 'E' ? 4 : 2.5}
              />
              <line
                x1="140"
                y1="60"
                x2="140"
                y2="20"
                stroke={activePin === 'E' ? '#38bdf8' : '#94a3b8'}
                strokeWidth={activePin === 'E' ? 4 : 2.5}
              />
              <circle cx="140" cy="20" r="4" fill={activePin === 'E' ? '#38bdf8' : '#64748b'} />
              <text x="155" y="28" fill="#a5f3fc" fontSize="13" fontWeight="bold">E (امیتر)</text>

              {/* Arrow on Emitter pointing INWARDS to Base */}
              <polygon points="112,78 126,69 122,86" fill="#f43f5e" />

              {/* Collector wire (Bottom) */}
              <line
                x1="100"
                y1="115"
                x2="140"
                y2="140"
                stroke={activePin === 'C' ? '#2dd4bf' : '#94a3b8'}
                strokeWidth={activePin === 'C' ? 4 : 2.5}
              />
              <line
                x1="140"
                y1="140"
                x2="140"
                y2="180"
                stroke={activePin === 'C' ? '#2dd4bf' : '#94a3b8'}
                strokeWidth={activePin === 'C' ? 4 : 2.5}
              />
              <circle cx="140" cy="180" r="4" fill={activePin === 'C' ? '#2dd4bf' : '#64748b'} />
              <text x="155" y="185" fill="#99f6e4" fontSize="13" fontWeight="bold">C (کلکتور)</text>
            </svg>
          </div>

          <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs">
            <div className="flex items-center gap-1.5 text-rose-300 font-bold mb-1">
              <span>قاعده فلش در PNP:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              در ترانزیستور PNP جهت فلش به سمت <strong>داخل</strong> (به سوی بیس) اشاره می‌کند:
              <span className="block mt-1 text-rose-400 font-mono font-semibold">
                PNP = Pointing iN Proudly (با افتخار رو به داخل!)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Diode Model Misconception Explained */}
      {showDiodeModel && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 mt-4 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>مدل دو دیود پشت‌به‌پشت و رفع یک خطای فکری کلاسیک</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            برای تست با مولتی‌متر، می‌توان ترانزیستور NPN را مانند دو دیود دید که آند (Anode) هر دو به بیس مشترک متصل است و کاتد یکی به امیتر و دیگری به کلکتور وصل است.
            اما <strong>هرگز</strong> نمی‌توان با لحیم کردن دو دیود معمولی ۱N4007 یک ترانزیستور ساخت!
            زیرا در ترانزیستور، لایه بیس تنها چند میکرون ضخامت دارد تا الکترون‌ها بدون ترکیب شدن به کلکتور برسند. در دو دیود جداگانه، فاصله میلی‌متری و سانتی‌متری سیم‌ها باعث خنثی شدن کامل بارها می‌شود و پدیده انتقال ترانزیستوری رخ نمی‌دهد.
          </p>
        </div>
      )}

      {/* Interactive Pin Highlight Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-slate-800 text-xs">
        <span className="text-slate-400">بررسی عملکرد هر پایه:</span>
        <button
          onClick={() => setActivePin(activePin === 'B' ? 'none' : 'B')}
          className={`px-3 py-1 rounded-md border font-medium transition-all ${
            activePin === 'B'
              ? 'bg-rose-500 text-white border-rose-400'
              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          پایه بیس (Base - کنترلر)
        </button>
        <button
          onClick={() => setActivePin(activePin === 'C' ? 'none' : 'C')}
          className={`px-3 py-1 rounded-md border font-medium transition-all ${
            activePin === 'C'
              ? 'bg-teal-500 text-slate-950 font-bold border-teal-400'
              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          پایه کلکتور (Collector - جمع‌کننده بار)
        </button>
        <button
          onClick={() => setActivePin(activePin === 'E' ? 'none' : 'E')}
          className={`px-3 py-1 rounded-md border font-medium transition-all ${
            activePin === 'E'
              ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          پایه امیتر (Emitter - منتشرکننده بار)
        </button>
      </div>
    </div>
  );
};
