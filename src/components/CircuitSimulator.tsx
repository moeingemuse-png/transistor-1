import React, { useState, useMemo } from 'react';
import { Sliders, ToggleLeft, Activity, AlertOctagon, Lightbulb, Zap, HelpCircle, CheckCircle } from 'lucide-react';

export const CircuitSimulator: React.FC = () => {
  const [simMode, setSimMode] = useState<'switch' | 'amplifier'>('switch');

  // Switch Mode State
  const [vccSwitch, setVccSwitch] = useState<number>(12); // Volts
  const [vinSwitch, setVinSwitch] = useState<number>(5.0); // Base input voltage (e.g. Arduino 5V)
  const [switchClosed, setSwitchClosed] = useState<boolean>(true);
  const [rbSwitch, setRbSwitch] = useState<number>(1000); // 1k ohm
  const [rlSwitch, setRlSwitch] = useState<number>(100); // 100 ohm load (or bulb)
  const [betaSwitch, setBetaSwitch] = useState<number>(120);
  const [loadType, setLoadType] = useState<'lamp' | 'relay' | 'motor'>('lamp');
  const [hasFlyback, setHasFlyback] = useState<boolean>(true);

  // Switch Calculations
  const switchStats = useMemo(() => {
    const effectiveVin = switchClosed ? vinSwitch : 0;
    const vbe = effectiveVin > 0.7 ? 0.7 : effectiveVin;
    const ib_A = effectiveVin > 0.7 ? (effectiveVin - 0.7) / rbSwitch : 0;
    const ib_mA = ib_A * 1000;
    const ib_uA = ib_A * 1000000;

    const ic_max_sat_A = Math.max(0, (vccSwitch - 0.2) / rlSwitch);
    const ic_active_A = ib_A * betaSwitch;

    let state: 'cutoff' | 'active' | 'saturation' = 'cutoff';
    let ic_A = 0;
    let vce = vccSwitch;

    if (ib_A <= 0.000001) {
      state = 'cutoff';
      ic_A = 0;
      vce = vccSwitch;
    } else if (ic_active_A >= ic_max_sat_A) {
      state = 'saturation';
      ic_A = ic_max_sat_A;
      vce = 0.2;
    } else {
      state = 'active';
      ic_A = ic_active_A;
      vce = Math.max(0.2, vccSwitch - (ic_A * rlSwitch));
    }

    const ic_mA = ic_A * 1000;
    const powerDissipation_mW = (vce * ic_A) * 1000;
    const brightnessRatio = Math.min(1, ic_A / ((vccSwitch - 0.2) / rlSwitch));

    return {
      vbe,
      ib_uA,
      ib_mA,
      ic_mA,
      vce,
      state,
      powerDissipation_mW,
      brightnessRatio
    };
  }, [switchClosed, vinSwitch, vccSwitch, rbSwitch, rlSwitch, betaSwitch]);

  // Amplifier Mode State
  const [vccAmp, setVccAmp] = useState<number>(12);
  const [inputAmpMilliV, setInputAmpMilliV] = useState<number>(50); // mV peak
  const [biasVb, setBiasVb] = useState<number>(1.8); // Volts on base
  const [rcAmp, setRcAmp] = useState<number>(2200); // 2.2k ohm
  const [reAmp, setReAmp] = useState<number>(560); // 560 ohm

  // Amplifier Calculations
  const ampStats = useMemo(() => {
    const ve = Math.max(0, biasVb - 0.7);
    const ie_mA = ve > 0 ? (ve / reAmp) * 1000 : 0;
    const ic_mA = ie_mA;
    const vc = Math.max(0.2, vccAmp - (ic_mA / 1000) * rcAmp);
    const vce = Math.max(0.2, vc - ve);

    // Small-signal Voltage gain approx: Av = -Rc / (re' + RE) or Av = -Rc / RE
    const small_re = ie_mA > 0 ? 26 / ie_mA : 1000; // dynamic resistance of emitter diode
    const voltageGain = rcAmp / (reAmp + small_re);

    let ampState: 'clean' | 'clipping-cutoff' | 'clipping-saturation' = 'clean';
    if (vce < 1.0) {
      ampState = 'clipping-saturation';
    } else if (vce > vccAmp - 1.5) {
      ampState = 'clipping-cutoff';
    }

    return {
      ve,
      vc,
      vce,
      ic_mA,
      voltageGain: Number(voltageGain.toFixed(1)),
      ampState
    };
  }, [biasVb, vccAmp, rcAmp, reAmp]);

  // Oscilloscope waveform points
  const wavePoints = useMemo(() => {
    const pointsIn: string[] = [];
    const pointsOut: string[] = [];
    const width = 280;
    const height = 120;
    const midY = height / 2;

    for (let x = 0; x <= width; x += 4) {
      const angle = (x / 40) * Math.PI * 2;
      const sinVal = Math.sin(angle);

      // Input wave (small)
      const inY = midY - (sinVal * (inputAmpMilliV / 100) * 18);
      pointsIn.push(`${x},${inY.toFixed(1)}`);

      // Output wave (amplified and inverted: 180 degree phase shift!)
      let outAmplitude = sinVal * ampStats.voltageGain * (inputAmpMilliV / 1000) * 14;
      let outY = midY + outAmplitude; // inverted

      // Check clipping against supply rails
      if (outY > height - 8) outY = height - 8;
      if (outY < 8) outY = 8;

      pointsOut.push(`${x},${outY.toFixed(1)}`);
    }

    return {
      inPath: `M ${pointsIn.join(' L ')}`,
      outPath: `M ${pointsOut.join(' L ')}`
    };
  }, [inputAmpMilliV, ampStats]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 my-8 text-slate-100 shadow-2xl">
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <Sliders className="w-5 h-5" />
            <span>آزمایشگاه و شبیه‌ساز تعاملی مدار ترانزیستوری (Sandbox)</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            تغییر آنلاین مقادیر مقاومت، ولتاژ تحریک و مشاهده اثر آن بر حالت‌های قطع، اشباع و تقویت موج صوتی
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs self-stretch md:self-auto">
          <button
            onClick={() => setSimMode('switch')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              simMode === 'switch'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مد کلیدزنی (Switch Mode)
          </button>
          <button
            onClick={() => setSimMode('amplifier')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              simMode === 'amplifier'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مد تقویت‌کننده (Amplifier Mode)
          </button>
        </div>
      </div>

      {/* ================= SWITCH MODE ================= */}
      {simMode === 'switch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
          {/* Left Column: Interactive Circuit Schematic (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-bold text-slate-300">شماتیک مدار سوئیچ ترانزیستور NPN با بار</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">وضعیت قطعه:</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    switchStats.state === 'saturation'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : switchStats.state === 'active'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {switchStats.state === 'saturation' && 'اشباع کامل (ON - کلید بسته)'}
                  {switchStats.state === 'active' && 'ناحیه فعال خطی (نیمه‌روشن)'}
                  {switchStats.state === 'cutoff' && 'ناحیه قطع (OFF - کلید باز)'}
                </span>
              </div>
            </div>

            {/* SVG Interactive Circuit */}
            <div className="relative w-full h-80 flex items-center justify-center">
              <svg viewBox="0 0 460 280" className="w-full h-full select-none">
                {/* VCC Rail Top */}
                <line x1="80" y1="30" x2="380" y2="30" stroke="#f59e0b" strokeWidth="2.5" />
                <circle cx="380" cy="30" r="4" fill="#f59e0b" />
                <text x="390" y="34" fill="#f59e0b" fontSize="12" fontWeight="bold">+{vccSwitch}V (V_CC)</text>

                {/* Ground Rail Bottom */}
                <line x1="80" y1="250" x2="380" y2="250" stroke="#475569" strokeWidth="2.5" />
                <line x1="280" y1="250" x2="280" y2="265" stroke="#475569" strokeWidth="2" />
                <line x1="270" y1="265" x2="290" y2="265" stroke="#475569" strokeWidth="2" />
                <line x1="275" y1="270" x2="285" y2="270" stroke="#475569" strokeWidth="2" />

                {/* LOAD BRANCH (Top to Collector) */}
                <line x1="280" y1="30" x2="280" y2="60" stroke="#f59e0b" strokeWidth="2" />

                {/* Load Device: Lamp / Motor / Relay */}
                <g transform="translate(280, 80)">
                  {loadType === 'lamp' && (
                    <g>
                      <circle
                        r="20"
                        fill={switchStats.brightnessRatio > 0.05 ? `rgba(250, 204, 21, ${switchStats.brightnessRatio})` : '#0f172a'}
                        stroke="#eab308"
                        strokeWidth="2"
                      />
                      <path d="M -10 10 L 10 -10 M -10 -10 L 10 10" stroke={switchStats.brightnessRatio > 0.2 ? "#713f12" : "#94a3b8"} strokeWidth="2" />
                      <text x="28" y="5" fill="#fde047" fontSize="10" fontWeight="bold">
                        {switchStats.brightnessRatio > 0.8 ? 'لامپ پرنور' : switchStats.brightnessRatio > 0.1 ? 'روشن ضعیف' : 'خاموش'}
                      </text>
                    </g>
                  )}

                  {loadType === 'motor' && (
                    <g className={switchStats.brightnessRatio > 0.1 ? 'animate-spin' : ''}>
                      <circle r="20" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                      <text y="4" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">M</text>
                      <line x1="-12" y1="-12" x2="12" y2="12" stroke="#0284c7" strokeWidth="2" />
                      <line x1="-12" y1="12" x2="12" y2="-12" stroke="#0284c7" strokeWidth="2" />
                    </g>
                  )}

                  {loadType === 'relay' && (
                    <g>
                      <rect x="-18" y="-14" width="36" height="28" fill="#1e293b" stroke="#a855f7" strokeWidth="2" rx="4" />
                      <path d="M -12 0 Q -6 -10 0 0 Q 6 -10 12 0" fill="none" stroke="#c084fc" strokeWidth="2" />
                      <text x="25" y="4" fill="#c084fc" fontSize="9">رله سلفی</text>
                    </g>
                  )}
                </g>

                {/* Optional Flyback Diode beside inductive loads */}
                {(loadType === 'relay' || loadType === 'motor') && (
                  <g transform="translate(330, 80)">
                    <line x1="-50" y1="-20" x2="0" y2="-20" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="0" y1="-20" x2="0" y2="20" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="-50" y1="20" x2="0" y2="20" stroke="#64748b" strokeWidth="1.5" />
                    {hasFlyback ? (
                      <g>
                        <polygon points="0,-8 -10,8 10,8" fill="#22c55e" />
                        <line x1="-10" y1="-8" x2="10" y2="-8" stroke="#22c55e" strokeWidth="2" />
                        <text x="14" y="2" fill="#22c55e" fontSize="8" fontWeight="bold">دیود هرزگرد</text>
                      </g>
                    ) : (
                      <g>
                        <text x="12" y="2" fill="#ef4444" fontSize="8" fontWeight="bold">بدون محافظ!</text>
                      </g>
                    )}
                  </g>
                )}

                {/* Wire from Load to Collector */}
                <line x1="280" y1="102" x2="280" y2="135" stroke={switchStats.ic_mA > 1 ? "#22c55e" : "#64748b"} strokeWidth="2" />

                {/* BJT Transistor Symbol */}
                <g transform="translate(280, 160)">
                  <circle r="26" fill="#090d16" stroke="#334155" strokeWidth="1.5" />
                  {/* Base Bar */}
                  <line x1="-10" y1="-14" x2="-10" y2="14" stroke="#94a3b8" strokeWidth="3" />
                  {/* Collector Pin (top right to bar) */}
                  <line x1="0" y1="-25" x2="-10" y2="-8" stroke="#94a3b8" strokeWidth="2" />
                  {/* Emitter Pin (bottom right to bar with arrow) */}
                  <line x1="0" y1="25" x2="-10" y2="8" stroke="#94a3b8" strokeWidth="2" />
                  <polygon points="-4,14 4,24 -2,22" fill="#38bdf8" />
                  {/* Base Lead */}
                  <line x1="-10" y1="0" x2="-35" y2="0" stroke="#94a3b8" strokeWidth="2" />
                  <text x="32" y="-5" fill="#94a3b8" fontSize="9">NPN</text>
                </g>

                {/* Wire from Emitter to GND */}
                <line x1="280" y1="185" x2="280" y2="250" stroke="#64748b" strokeWidth="2" />

                {/* BASE DRIVE BRANCH (Left to Base) */}
                <line x1="245" y1="160" x2="210" y2="160" stroke="#94a3b8" strokeWidth="2" />

                {/* Base Resistor R_B */}
                <g transform="translate(170, 160)">
                  <rect x="-25" y="-9" width="50" height="18" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" rx="3" />
                  <text y="4" textAnchor="middle" fill="#fda4af" fontSize="9" fontWeight="bold" className="font-mono">
                    R_B={rbSwitch >= 1000 ? `${rbSwitch / 1000}k` : `${rbSwitch}`}Ω
                  </text>
                </g>
                <line x1="145" y1="160" x2="110" y2="160" stroke="#94a3b8" strokeWidth="2" />

                {/* Physical Base Switch */}
                <g transform="translate(100, 160)" className="cursor-pointer" onClick={() => setSwitchClosed(!switchClosed)}>
                  <circle cx="-10" cy="0" r="3" fill="#64748b" />
                  <circle cx="10" cy="0" r="3" fill="#64748b" />
                  {switchClosed ? (
                    <line x1="-10" y1="0" x2="10" y2="0" stroke="#22c55e" strokeWidth="3" />
                  ) : (
                    <line x1="-10" y1="0" x2="6" y2="-12" stroke="#ef4444" strokeWidth="3" />
                  )}
                  <text y="-14" textAnchor="middle" fill={switchClosed ? "#22c55e" : "#ef4444"} fontSize="8">
                    {switchClosed ? 'کلید بسته' : 'کلید باز'}
                  </text>
                </g>

                <line x1="90" y1="160" x2="60" y2="160" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="60" cy="160" r="4" fill="#3b82f6" />
                <text x="20" y="164" fill="#60a5fa" fontSize="10" fontWeight="bold">+{vinSwitch}V</text>
                <text x="20" y="176" fill="#94a3b8" fontSize="8">(پین آردوینو)</text>
              </svg>
            </div>

            {/* Live Measurements Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-900 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">جریان بیس (I_B)</span>
                <span className="font-mono text-rose-400 font-bold text-sm">
                  {switchStats.ib_mA > 1 ? `${switchStats.ib_mA.toFixed(2)} mA` : `${switchStats.ib_uA.toFixed(0)} µA`}
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">جریان کلکتور (I_C)</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{switchStats.ic_mA.toFixed(1)} mA</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">ولتاژ V_CE</span>
                <span className="font-mono text-cyan-400 font-bold text-sm">{switchStats.vce.toFixed(2)} V</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">توان تلفاتی (P_D)</span>
                <span className="font-mono text-amber-400 font-bold text-sm">{switchStats.powerDissipation_mW.toFixed(1)} mW</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Sliders & Circuit Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-amber-300 mb-3 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>تنظیمات و متغیرهای مدار کلید</span>
              </h4>

              {/* Base Voltage Slider */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">ولتاژ فرمان بیس (V_in):</span>
                  <span className="font-mono text-cyan-400 font-bold">{vinSwitch} V</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5.0"
                  step="0.1"
                  value={vinSwitch}
                  onChange={(e) => setVinSwitch(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Base Resistor Slider */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">مقاومت بیس (R_B):</span>
                  <span className="font-mono text-rose-400 font-bold">{rbSwitch} Ω</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={rbSwitch}
                  onChange={(e) => setRbSwitch(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Load Type & Flyback Protection */}
              <div className="mb-3">
                <label className="text-xs text-slate-300 block mb-1">نوع بار متصل به کلکتور:</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    onClick={() => setLoadType('lamp')}
                    className={`py-1.5 px-2 rounded-lg border font-medium transition-all ${
                      loadType === 'lamp'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    لامپ روشنایی
                  </button>
                  <button
                    onClick={() => setLoadType('motor')}
                    className={`py-1.5 px-2 rounded-lg border font-medium transition-all ${
                      loadType === 'motor'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    موتور DC
                  </button>
                  <button
                    onClick={() => setLoadType('relay')}
                    className={`py-1.5 px-2 rounded-lg border font-medium transition-all ${
                      loadType === 'relay'
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    رله ۱۲ ولت
                  </button>
                </div>
              </div>

              {(loadType === 'motor' || loadType === 'relay') && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">دیود هرزگرد (Flyback):</span>
                  <button
                    onClick={() => setHasFlyback(!hasFlyback)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      hasFlyback ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {hasFlyback ? 'دیود فعال (محافظت‌شده)' : 'بدون دیود (خطر سوختن!)'}
                  </button>
                </div>
              )}
            </div>

            {/* Warning / Education Insight Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>نکته کلیدی برای کلید ترانزیستوری ایده‌آل</span>
              </div>
              <p>
                در کلیدزنی، ما می‌خواهیم ترانزیستور فوراً به <strong>ناحیه اشباع</strong> برود تا افت ولتاژ روی آن حداقل (<code className="text-cyan-300">V_CE ≈ 0.2V</code>) و تلفات توان ناچیز باشد. اگر <code className="text-rose-300">R_B</code> بیش از حد بزرگ انتخاب شود، ترانزیستور در ناحیه فعال گیر افتاده، ولتاژ زیادی روی آن می‌افتد و به شدت داغ خواهد شد!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= AMPLIFIER MODE ================= */}
      {simMode === 'amplifier' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
          {/* Oscilloscope View (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">اسیلوسکوپ ۲ کاناله شبیه‌سازی تقویت سیگنال صوتی</span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  ampStats.ampState === 'clean'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {ampStats.ampState === 'clean' && 'تقویت شفاف و متقارن (بدون اعوجاج)'}
                {ampStats.ampState === 'clipping-saturation' && 'برش قله در اشباع (Clipping Distortion)'}
                {ampStats.ampState === 'clipping-cutoff' && 'برش قله در قطع (Cutoff Distortion)'}
              </span>
            </div>

            {/* Digital Oscilloscope Screen */}
            <div className="relative w-full h-56 bg-[#04130d] border-2 border-emerald-950 rounded-lg p-2 overflow-hidden flex items-center justify-center">
              {/* Scope Grid Lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/30" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-emerald-500/30" />

              <svg viewBox="0 0 280 120" className="w-full h-full select-none z-10">
                {/* Channel 1: Input Wave (Cyan, smaller) */}
                <path d={wavePoints.inPath} fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 2" />

                {/* Channel 2: Output Wave (Amber, inverted & amplified) */}
                <path d={wavePoints.outPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              </svg>

              {/* Channel Overlay Legend */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono z-20 bg-slate-950/80 px-2.5 py-1 rounded border border-emerald-900/50">
                <span className="text-cyan-400">CH1 (ورودی Vin): {inputAmpMilliV} mVpp</span>
                <span className="text-amber-400 font-bold">CH2 (خروجی Vout): بهره ولتاژ Av ≈ {ampStats.voltageGain}x</span>
              </div>
            </div>

            {/* DC Bias Q-Point Data */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs mt-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">ولتاژ بیس (V_B)</span>
                <span className="font-mono text-cyan-400 font-bold">{biasVb.toFixed(2)} V</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">جریان نقطه کار (I_CQ)</span>
                <span className="font-mono text-emerald-400 font-bold">{ampStats.ic_mA.toFixed(2)} mA</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">ولتاژ نقطه کار (V_CEQ)</span>
                <span className="font-mono text-amber-400 font-bold">{ampStats.vce.toFixed(2)} V</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">بهره ولتاژ (Gain)</span>
                <span className="font-mono text-purple-400 font-bold">{ampStats.voltageGain} برابر</span>
              </div>
            </div>
          </div>

          {/* Controls for Amplifier (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-cyan-300 mb-3 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>تنظیم بایاسینگ و نقطه کار (Q-Point)</span>
              </h4>

              {/* Input AC Signal Amplitude Slider */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">دامنه سیگنال صوتی ورودی:</span>
                  <span className="font-mono text-cyan-400 font-bold">{inputAmpMilliV} mV</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={inputAmpMilliV}
                  onChange={(e) => setInputAmpMilliV(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* DC Bias Voltage Slider */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">ولتاژ بایاس DC بیس (تنظیم کننده Q):</span>
                  <span className="font-mono text-amber-400 font-bold">{biasVb.toFixed(2)} V</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="3.5"
                  step="0.05"
                  value={biasVb}
                  onChange={(e) => setBiasVb(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  برای بهترین حالت بدون اعوجاج، اسلایدر را روی ۱.۸ ولت (وسط) بگذارید.
                </span>
              </div>

              {/* Collector Resistor */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">مقاومت کلکتور (R_C):</span>
                  <span className="font-mono text-rose-400 font-bold">{rcAmp} Ω</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="4700"
                  step="100"
                  value={rcAmp}
                  onChange={(e) => setRcAmp(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Theory Callout */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-400 block mb-1">اختلاف فاز ۱۸۰ درجه چیست؟</span>
              در تقویت‌کننده امیتر مشترک، با بالا رفتن ولتاژ ورودی، جریان کلکتور زیاد شده و افت ولتاژ روی مقاومت کلکتور بیشتر می‌شود؛ در نتیجه ولتاژ خروجی کاهش می‌یابد. بنابراین سیگنال خروجی ۱۸۰ درجه وارونه (Inverted) است.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
