import React, { useState } from 'react';
import { Gauge, HelpCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export const MultimeterGuide: React.FC = () => {
  // Probes on pins 1, 2, 3
  const [redProbePin, setRedProbePin] = useState<number>(2); // Pin 2 is Base in standard 2N2222
  const [blackProbePin, setBlackProbePin] = useState<number>(3); // Pin 3 is Emitter
  const [transistorHealth, setTransistorHealth] = useState<'healthy_npn' | 'healthy_pnp' | 'shorted'>('healthy_npn');

  // Calculate LCD display reading
  const reading = React.useMemo(() => {
    if (transistorHealth === 'shorted') {
      return { val: '0.002 V', beep: true, verdict: 'اتصال کوتاه داخلی (سوخته!)' };
    }

    // Healthy NPN: Pin 2 is Base (P), Pin 1 is Collector (N), Pin 3 is Emitter (N)
    if (transistorHealth === 'healthy_npn') {
      if (redProbePin === 2 && blackProbePin === 1) {
        return { val: '0.672 V', beep: false, verdict: 'پیوند مستقیم بیس-کلکتور (B-C)' };
      }
      if (redProbePin === 2 && blackProbePin === 3) {
        return { val: '0.684 V', beep: false, verdict: 'پیوند مستقیم بیس-امیتر (B-E: ولتاژ کمی بیشتر)' };
      }
      // Any other reverse or C-E combination
      return { val: 'O.L (مدار باز)', beep: false, verdict: 'بایاس معکوس صحیح - بدون اتصال' };
    }

    // Healthy PNP: Pin 2 is Base (N), Pin 1 is Collector (P), Pin 3 is Emitter (P)
    if (transistorHealth === 'healthy_pnp') {
      if (blackProbePin === 2 && redProbePin === 1) {
        return { val: '0.668 V', beep: false, verdict: 'پیوند مستقیم کلکتور-بیس (C-B در PNP)' };
      }
      if (blackProbePin === 2 && redProbePin === 3) {
        return { val: '0.680 V', beep: false, verdict: 'پیوند مستقیم امیتر-بیس (E-B در PNP)' };
      }
      return { val: 'O.L (مدار باز)', beep: false, verdict: 'بایاس معکوس صحیح - بدون اتصال' };
    }

    return { val: 'O.L', beep: false, verdict: 'حالت نامشخص' };
  }, [redProbePin, blackProbePin, transistorHealth]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 my-6 text-slate-100 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-base">
            <Gauge className="w-5 h-5" />
            <span>میز کار تست و شناسایی پایه‌های ترانزیستور با مولتی‌متر دیجیتال</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            آموزش عملی نحوه پیدا کردن بیس، تشخیص نوع NPN یا PNP و تست سلامت قطعه با حالت تست دیود
          </p>
        </div>

        {/* Condition select */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs self-stretch sm:self-auto">
          <button
            onClick={() => setTransistorHealth('healthy_npn')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
              transistorHealth === 'healthy_npn' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            تست NPN سالم
          </button>
          <button
            onClick={() => setTransistorHealth('healthy_pnp')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
              transistorHealth === 'healthy_pnp' ? 'bg-rose-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            تست PNP سالم
          </button>
          <button
            onClick={() => setTransistorHealth('shorted')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
              transistorHealth === 'shorted' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            ترانزیستور سوخته
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4">
        {/* Multimeter & Transistor Illustration (7 cols) */}
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
          <div className="relative w-full h-72 flex items-center justify-center">
            <svg viewBox="0 0 460 260" className="w-full h-full select-none">
              {/* Digital Multimeter Body */}
              <rect x="30" y="30" width="160" height="200" rx="16" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
              {/* Multimeter LCD Screen */}
              <rect x="50" y="55" width="120" height="45" rx="6" fill="#064e3b" stroke="#047857" strokeWidth="2" />
              <text x="110" y="86" fill="#6ee7b7" fontSize="16" fontWeight="bold" textAnchor="middle" className="font-mono">
                {reading.val}
              </text>
              <text x="160" y="94" fill="#a7f3d0" fontSize="8" textAnchor="end">DIODE</text>

              {/* Rotary Switch Knob */}
              <circle cx="110" cy="140" r="24" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
              <line x1="110" y1="140" x2="110" y2="120" stroke="#f59e0b" strokeWidth="3" />

              {/* Multimeter Sockets */}
              <circle cx="80" cy="195" r="7" fill="#000" stroke="#ef4444" strokeWidth="2" />
              <text x="80" y="215" fill="#ef4444" fontSize="8" textAnchor="middle">VΩmA</text>

              <circle cx="140" cy="195" r="7" fill="#000" stroke="#64748b" strokeWidth="2" />
              <text x="140" y="215" fill="#94a3b8" fontSize="8" textAnchor="middle">COM</text>

              {/* TO-92 Transistor Package on Right */}
              <g transform="translate(320, 80)">
                {/* Transistor D-shaped Head */}
                <path d="M -35 0 A 35 35 0 0 1 35 0 L 35 35 L -35 35 Z" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <rect x="-35" y="35" width="70" height="15" fill="#090d16" />
                <text y="20" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {transistorHealth === 'healthy_npn' ? '2N2222' : transistorHealth === 'healthy_pnp' ? '2N3906' : 'FAULTY'}
                </text>

                {/* Pin 1 (Left - Collector) */}
                <line x1="-20" y1="50" x2="-20" y2="120" stroke="#94a3b8" strokeWidth="3" />
                <circle cx="-20" cy="120" r="4" fill="#64748b" />
                <text x="-20" y="140" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">پین ۱</text>
                <text x="-20" y="152" fill="#64748b" fontSize="8" textAnchor="middle">(C)</text>

                {/* Pin 2 (Middle - Base) */}
                <line x1="0" y1="50" x2="0" y2="120" stroke="#94a3b8" strokeWidth="3" />
                <circle cx="0" cy="120" r="4" fill="#64748b" />
                <text x="0" y="140" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">پین ۲</text>
                <text x="0" y="152" fill="#fda4af" fontSize="8" textAnchor="middle">(Base)</text>

                {/* Pin 3 (Right - Emitter) */}
                <line x1="20" y1="50" x2="20" y2="120" stroke="#94a3b8" strokeWidth="3" />
                <circle cx="20" cy="120" r="4" fill="#64748b" />
                <text x="20" y="140" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">پین ۳</text>
                <text x="20" y="152" fill="#7dd3fc" fontSize="8" textAnchor="middle">(E)</text>
              </g>

              {/* Dynamic Wires Connecting Multimeter to Chosen Pins */}
              {/* Red Probe Wire */}
              {redProbePin === 1 && (
                <path d="M 80 195 Q 160 250 300 200" fill="none" stroke="#ef4444" strokeWidth="2.5" />
              )}
              {redProbePin === 2 && (
                <path d="M 80 195 Q 180 250 320 200" fill="none" stroke="#ef4444" strokeWidth="2.5" />
              )}
              {redProbePin === 3 && (
                <path d="M 80 195 Q 200 250 340 200" fill="none" stroke="#ef4444" strokeWidth="2.5" />
              )}

              {/* Black Probe Wire */}
              {blackProbePin === 1 && (
                <path d="M 140 195 Q 200 260 300 200" fill="none" stroke="#334155" strokeWidth="2.5" strokeDasharray="4 2" />
              )}
              {blackProbePin === 2 && (
                <path d="M 140 195 Q 220 260 320 200" fill="none" stroke="#334155" strokeWidth="2.5" strokeDasharray="4 2" />
              )}
              {blackProbePin === 3 && (
                <path d="M 140 195 Q 240 260 340 200" fill="none" stroke="#334155" strokeWidth="2.5" strokeDasharray="4 2" />
              )}
            </svg>
          </div>

          <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs flex items-center justify-between">
            <span className="text-slate-400">تفسیر تست:</span>
            <span className="font-bold text-amber-300">{reading.verdict}</span>
          </div>
        </div>

        {/* Probe Selector Controls & Diagnostic Guide (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-200 mb-3">محل اتصال پراب‌های مولتی‌متر:</h4>

            <div className="mb-3">
              <label className="text-xs text-rose-400 font-bold block mb-1">پراب قرمز (مثبت / آند):</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((pin) => (
                  <button
                    key={pin}
                    onClick={() => setRedProbePin(pin)}
                    className={`py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      redProbePin === pin
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    پین شماره {pin}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bold block mb-1">پراب مشکی (منفی / COM):</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((pin) => (
                  <button
                    key={pin}
                    onClick={() => setBlackProbePin(pin)}
                    className={`py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      blackProbePin === pin
                        ? 'bg-slate-700 border-slate-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    پین شماره {pin}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2 text-slate-300">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>فرمول تجربی مهندسان در تشخیص امیتر از کلکتور:</span>
            </div>
            <p className="leading-relaxed">
              هنگامی که بیس را پیدا کردید، ولتاژ بیس-امیتر (B-E) همیشه <strong>چند میلی‌ولت بزرگ‌تر</strong> از ولتاژ بیس-کلکتور (B-C) است (مثلاً ۰.۶۸۴ در برابر ۰.۶۷۲).
              علت علمی: لایه امیتر برای تزریق حداکثری بارها ناخالصی بسیار بیشتری دارد، بنابراین غلظت بالای بارها سد پیوند آن را اندکی بزرگ‌تر می‌کند!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
