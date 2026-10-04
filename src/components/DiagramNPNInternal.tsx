import React, { useState } from 'react';
import { Cpu, Power, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';

export const DiagramNPNInternal: React.FC = () => {
  const [baseTurnedOn, setBaseTurnedOn] = useState<boolean>(true);
  const [vceVoltage, setVceVoltage] = useState<number>(9);

  const baseCurrentMicroA = baseTurnedOn ? 120 : 0;
  const beta = 150;
  const collectorCurrentMilliA = baseTurnedOn ? Math.min(18.0, Number(((baseCurrentMicroA * beta) / 1000).toFixed(1))) : 0;
  const emitterCurrentMilliA = Number((collectorCurrentMilliA + (baseCurrentMicroA / 1000)).toFixed(2));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 my-6 text-slate-100 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-base">
            <Cpu className="w-5 h-5" />
            <span>کالبدشکافی تعاملی ترانزیستور NPN (انیمیشن اتمی The Engineering Mindset)</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            مشاهده مهاجرت ۹۹٪ الکترون‌ها از امیتر پرناخالصی از درون بیس فوق‌العاده نازک به کلکتور
          </p>
        </div>

        {/* Quick Base Switch Toggle */}
        <button
          onClick={() => setBaseTurnedOn(!baseTurnedOn)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
            baseTurnedOn
              ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{baseTurnedOn ? 'سیگنال بیس متصل (V_BE = 0.7V) [روشن]' : 'سیگنال بیس قطع (V_BE = 0V) [خاموش]'}</span>
        </button>
      </div>

      {/* Cross Section Canvas */}
      <div className="relative w-full h-96 my-4 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 660 380" className="w-full h-full max-h-96 select-none">
          <defs>
            <linearGradient id="emitterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#083344" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0e7490" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="baseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#881337" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#9f1239" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="collectorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f766e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#115e59" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="60%" stopColor="#eab308" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a16207" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* Three Silicon Layers */}
          {/* 1. Emitter Layer (Left, heavily doped N++) */}
          <rect x="60" y="80" width="180" height="200" fill="url(#emitterGrad)" stroke="#06b6d4" strokeWidth="2" rx="4" />
          <text x="150" y="110" fill="#a5f3fc" fontSize="13" fontWeight="bold" textAnchor="middle">
            امیتر (Emitter - N++)
          </text>
          <text x="150" y="128" fill="#67e8f9" fontSize="10" textAnchor="middle">
            ناخالصی بسیار شدید (Heavily Doped)
          </text>

          {/* 2. Base Layer (Middle, ULTRA THIN P) */}
          <rect x="240" y="80" width="50" height="200" fill="url(#baseGrad)" stroke="#f43f5e" strokeWidth="2" rx="2" />
          <text x="265" y="110" fill="#fecdd3" fontSize="11" fontWeight="bold" textAnchor="middle">
            بیس (P)
          </text>
          <text x="265" y="128" fill="#fda4af" fontSize="9" textAnchor="middle">
            بسیار نازک
          </text>

          {/* 3. Collector Layer (Right, wide N) */}
          <rect x="290" y="80" width="220" height="200" fill="url(#collectorGrad)" stroke="#14b8a6" strokeWidth="2" rx="4" />
          <text x="400" y="110" fill="#99f6e4" fontSize="13" fontWeight="bold" textAnchor="middle">
            کلکتور (Collector - N)
          </text>
          <text x="400" y="128" fill="#5eead4" fontSize="10" textAnchor="middle">
            مساحت وسیع + دفع گرما
          </text>

          {/* External Wiring Circuits */}
          {/* Base Connection Pin (Coming down from Base) */}
          <path d="M 265 280 L 265 340 L 160 340" fill="none" stroke={baseTurnedOn ? "#f43f5e" : "#475569"} strokeWidth="2.5" />
          <circle cx="265" cy="280" r="4" fill="#f43f5e" />
          <text x="265" y="300" fill="#fda4af" fontSize="10" fontWeight="bold">پایه بیس (B)</text>

          {/* Base Voltage Generator / Switch */}
          <g transform="translate(140, 340)">
            <circle r="14" fill="#0f172a" stroke={baseTurnedOn ? "#22c55e" : "#64748b"} strokeWidth="2" />
            <text y="4" textAnchor="middle" fill={baseTurnedOn ? "#22c55e" : "#64748b"} fontSize="9" fontWeight="bold">
              {baseTurnedOn ? "0.7V" : "0V"}
            </text>
          </g>
          <path d="M 126 340 L 60 340 L 60 280" fill="none" stroke={baseTurnedOn ? "#f43f5e" : "#475569"} strokeWidth="2.5" />

          {/* Emitter Connection Pin (Left) */}
          <path d="M 60 180 L 20 180 L 20 360 L 590 360 L 590 180 L 510 180" fill="none" stroke="#64748b" strokeWidth="2.5" />
          <circle cx="60" cy="180" r="4" fill="#06b6d4" />
          <text x="35" y="170" fill="#a5f3fc" fontSize="10" fontWeight="bold">امیتر (E)</text>

          {/* Collector Connection Pin (Right) */}
          <circle cx="510" cy="180" r="4" fill="#14b8a6" />
          <text x="520" y="170" fill="#99f6e4" fontSize="10" fontWeight="bold">کلکتور (C)</text>

          {/* Collector Circuit Battery and Lamp */}
          <g transform="translate(590, 260)">
            {/* Battery V_CC */}
            <line x1="-15" y1="-15" x2="15" y2="-15" stroke="#f59e0b" strokeWidth="4" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#f59e0b" strokeWidth="6" />
            <text x="25" y="-10" fill="#f59e0b" fontSize="11" fontWeight="bold">+{vceVoltage}V</text>
            <text x="25" y="15" fill="#f59e0b" fontSize="9">منبع تغذیه بار</text>
          </g>

          {/* Load Lamp in Collector path */}
          <g transform="translate(550, 180)">
            <circle r="18" fill={baseTurnedOn ? "url(#lampGlow)" : "#1e293b"} stroke="#f59e0b" strokeWidth="2" />
            <path d="M -8 8 L 0 -8 L 8 8" fill="none" stroke={baseTurnedOn ? "#78350f" : "#64748b"} strokeWidth="2" />
            <text y="-24" textAnchor="middle" fill={baseTurnedOn ? "#fde047" : "#64748b"} fontSize="10" fontWeight="bold">
              {baseTurnedOn ? "لامپ روشن!" : "لامپ خاموش"}
            </text>
          </g>

          {/* INTERNAL PARTICLES & FLOW ANIMATION */}
          {!baseTurnedOn && (
            <g>
              {/* Barrier overlay in B-C junction */}
              <rect x="238" y="80" width="54" height="200" fill="#020617" fillOpacity="0.85" stroke="#e11d48" strokeWidth="2" strokeDasharray="3 3" />
              <text x="265" y="175" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90 265 175)">
                سد معکوس (مانع عبور الکترون‌ها)
              </text>

              {/* Trapped electrons in Emitter */}
              {[
                { x: 90, y: 150 }, { x: 120, y: 190 }, { x: 160, y: 160 }, { x: 180, y: 220 }, { x: 110, y: 240 }
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="6" fill="#38bdf8" />
              ))}
            </g>
          )}

          {baseTurnedOn && (
            <g>
              {/* Electron flood from Emitter through Base to Collector */}
              <g className="animate-pulse">
                {/* Electron streams */}
                <path d="M 120 160 L 250 160 L 460 160" stroke="#38bdf8" strokeWidth="3" strokeDasharray="8 4" />
                <path d="M 120 200 L 250 200 L 460 200" stroke="#38bdf8" strokeWidth="3" strokeDasharray="8 4" />
                <path d="M 120 230 L 250 230 L 460 230" stroke="#38bdf8" strokeWidth="3" strokeDasharray="8 4" />

                {/* 1-2% Electrons escaping down to Base wire */}
                <path d="M 265 200 L 265 280" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="265" cy="245" r="4" fill="#f43f5e" />
                <text x="245" y="250" fill="#fda4af" fontSize="9" fontWeight="bold" textAnchor="end">تنها ۱٪ به بیس (I_B)</text>
              </g>

              {/* Majority 99% swept by Collector Positive pull */}
              <g transform="translate(370, 140)">
                <rect x="-10" y="-12" width="130" height="24" rx="4" fill="#0f172a" fillOpacity="0.9" stroke="#14b8a6" />
                <text x="55" y="4" fill="#2dd4bf" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ۹۹٪ جذب کلکتور شد (I_C)
                </text>
              </g>

              {/* Moving electron dots */}
              {[
                { x: 100, y: 170 }, { x: 150, y: 190 }, { x: 200, y: 180 },
                { x: 320, y: 165 }, { x: 380, y: 195 }, { x: 440, y: 175 }, { x: 480, y: 215 }
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#38bdf8" />
                  <text x={pt.x} y={pt.y + 3} fill="#082f49" fontSize="7" fontWeight="bold" textAnchor="middle">-</text>
                </g>
              ))}
            </g>
          )}

          {/* Measurement Gauges Box */}
          <g transform="translate(70, 20)">
            <rect width="520" height="45" rx="6" fill="#020617" stroke="#334155" />
            <text x="20" y="28" fill="#94a3b8" fontSize="11">جریان امیتر: </text>
            <text x="85" y="28" fill="#38bdf8" fontSize="12" fontWeight="bold" className="font-mono">
              I_E = {emitterCurrentMilliA} mA
            </text>

            <text x="190" y="28" fill="#94a3b8" fontSize="11">جریان بیس: </text>
            <text x="250" y="28" fill="#f43f5e" fontSize="12" fontWeight="bold" className="font-mono">
              I_B = {baseCurrentMicroA} µA
            </text>

            <text x="350" y="28" fill="#94a3b8" fontSize="11">جریان کلکتور: </text>
            <text x="420" y="28" fill="#2dd4bf" fontSize="12" fontWeight="bold" className="font-mono">
              I_C = {collectorCurrentMilliA} mA
            </text>

            <text x="490" y="28" fill="#f59e0b" fontSize="11" fontWeight="bold" className="font-mono">
              β = {beta}
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Controls & Technical Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-300 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>چرا ۹۹٪ الکترون‌ها جذب کلکتور می‌شوند نه بیس؟</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed">
            <li>
              <strong className="text-white">بیس فوق‌العاده نازک است:</strong> عرض لایه بیس در حد چند میکرون است؛ لذا الکترون‌های شتاب‌دار در کسری از نانوثانیه از آن عبور می‌کنند.
            </li>
            <li>
              <strong className="text-white">ناخالصی کم بیس:</strong> اتم‌های بور و حفره‌های آزاد در بیس بسیار اندک هستند (کمتر از ۱٪ تا ۲٪ الکترون‌ها فرصت ترکیب پیدا می‌کنند).
            </li>
            <li>
              <strong className="text-white">میدان جاذب قوی کلکتور:</strong> ولتاژ مثبت کلکتور (+9V) نیروی الکترواستاتیکی عظیمی اعمال کرده و الکترون‌ها را پیش از فرار از سیم بیس می‌بلعد.
            </li>
          </ol>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-cyan-300 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>تنظیم ولتاژ کلکتور (V_CC) و تست قدرت مکش</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-slate-400">ولتاژ تغذیه منبع:</span>
              <input
                type="range"
                min="3"
                max="24"
                step="1"
                value={vceVoltage}
                onChange={(e) => setVceVoltage(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <span className="font-mono text-cyan-400 font-bold min-w-10 text-left">{vceVoltage}V</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400">
            <span>فرمول پایستگی جریان:</span>
            <span className="font-mono text-amber-300 font-bold">
              I_E = I_B + I_C ({emitterCurrentMilliA} = {(baseCurrentMicroA / 1000).toFixed(2)} + {collectorCurrentMilliA})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
