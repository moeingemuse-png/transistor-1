import React, { useState, useMemo } from 'react';
import { Calculator, Flame, Cpu, ShieldAlert, CheckCircle2, Zap, ArrowLeft } from 'lucide-react';

export const Calculators: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<'switch' | 'q-point' | 'thermal'>('switch');

  // Calculator 1: Switch Base Resistor
  const [vin, setVin] = useState<number>(5.0); // Microcontroller voltage (5V or 3.3V)
  const [vbe, setVbe] = useState<number>(0.7); // 0.7V silicon
  const [loadCurrent_mA, setLoadCurrent_mA] = useState<number>(150); // e.g. 150 mA relay or LED strip
  const [beta, setBeta] = useState<number>(100);
  const [overdriveFactor, setOverdriveFactor] = useState<number>(3); // 2x to 5x safety for deep saturation

  const switchCalcResults = useMemo(() => {
    const ic_A = loadCurrent_mA / 1000;
    const ib_ideal_A = ic_A / beta;
    const ib_sat_A = ib_ideal_A * overdriveFactor;
    const voltageDrop_R = Math.max(0, vin - vbe);
    const rb_calc = ib_sat_A > 0 ? voltageDrop_R / ib_sat_A : 0;

    // Standard E24 nearest resistor list
    const e24Bases = [10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91];
    let nearestE24 = 1000;
    let minDiff = Infinity;

    for (let mult = 1; mult <= 100000; mult *= 10) {
      for (const val of e24Bases) {
        const standardVal = val * mult;
        const diff = Math.abs(standardVal - rb_calc);
        if (diff < minDiff) {
          minDiff = diff;
          nearestE24 = standardVal;
        }
      }
    }

    const resistorPower_mW = (Math.pow(ib_sat_A, 2) * nearestE24) * 1000;
    const transistorSatPower_mW = (0.2 * ic_A) * 1000;

    return {
      ib_ideal_mA: (ib_ideal_A * 1000).toFixed(2),
      ib_sat_mA: (ib_sat_A * 1000).toFixed(2),
      rb_calc: Math.round(rb_calc),
      nearestE24,
      resistorPower_mW: resistorPower_mW.toFixed(1),
      transistorSatPower_mW: transistorSatPower_mW.toFixed(1)
    };
  }, [vin, vbe, loadCurrent_mA, beta, overdriveFactor]);

  // Calculator 2: Voltage Divider Q-Point
  const [vcc, setVcc] = useState<number>(12);
  const [r1, setR1] = useState<number>(33000); // 33k
  const [r2, setR2] = useState<number>(6800); // 6.8k
  const [rc, setRc] = useState<number>(2200); // 2.2k
  const [re, setRe] = useState<number>(470); // 470
  const [betaBias, setBetaBias] = useState<number>(150);

  const qPointResults = useMemo(() => {
    // Thevenin Equivalent
    const vth = vcc * (r2 / (r1 + r2));
    const rth = (r1 * r2) / (r1 + r2);

    // Base loop: Vth = Ib*Rth + Vbe + (Beta+1)*Ib*Re
    const ib_A = Math.max(0, (vth - 0.7) / (rth + (betaBias + 1) * re));
    const ie_A = (betaBias + 1) * ib_A;
    const ic_A = betaBias * ib_A;

    const ve = ie_A * re;
    const vb = ve + 0.7;
    const vc = Math.max(0.2, vcc - ic_A * rc);
    const vce = Math.max(0.2, vc - ve);

    let state = 'فعال خطی (Active)';
    if (vce <= 0.3) {
      state = 'اشباع (Saturation - Clipping)';
    } else if (ic_A <= 0.0001) {
      state = 'قطع (Cutoff - Clipping)';
    }

    return {
      vth: vth.toFixed(2),
      rth: Math.round(rth),
      vb: vb.toFixed(2),
      ve: ve.toFixed(2),
      vc: vc.toFixed(2),
      vce: vce.toFixed(2),
      ic_mA: (ic_A * 1000).toFixed(2),
      state
    };
  }, [vcc, r1, r2, rc, re, betaBias]);

  // Calculator 3: Thermal & Heatsink
  const [vceThermal, setVceThermal] = useState<number>(6);
  const [icThermal_A, setIcThermal_A] = useState<number>(0.5);
  const [ambientTemp, setAmbientTemp] = useState<number>(25); // Celsius
  const [packageType, setPackageType] = useState<'to92' | 'to220'>('to220');

  const thermalResults = useMemo(() => {
    const power_W = vceThermal * icThermal_A;
    // TO-92 has R_thetaJA around 200 °C/W
    // TO-220 has R_thetaJA around 65 °C/W (without heatsink) and R_thetaJC around 2 °C/W
    const rja = packageType === 'to92' ? 200 : 65;
    const junctionTempNoHeatsink = ambientTemp + (power_W * rja);
    const maxTj = 150; // Silicon max junction temperature

    const needsHeatsink = junctionTempNoHeatsink > 110;
    const maxSafeTj = 120; // 30 deg derating
    const reqRtotal = (maxSafeTj - ambientTemp) / Math.max(0.01, power_W);
    const reqHeatsinkResistance = Math.max(0.5, reqRtotal - 2.5); // subtracting R_jc and interface grease

    return {
      power_W: power_W.toFixed(2),
      junctionTempNoHeatsink: Math.round(junctionTempNoHeatsink),
      needsHeatsink,
      reqHeatsinkResistance: reqHeatsinkResistance.toFixed(1)
    };
  }, [vceThermal, icThermal_A, ambientTemp, packageType]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 my-8 text-slate-100 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
            <Calculator className="w-5 h-5" />
            <span>ماشین‌حساب‌های مهندسی و محاسبات مداری ترانزیستور</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ابزارهای دقیق مهندسی برای طراحی مقاومت بیس، نقطه کار و انتخاب هیت‌سینک مناسب
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs self-stretch sm:self-auto">
          <button
            onClick={() => setActiveCalc('switch')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCalc === 'switch' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مقاومت بیس سوئیچ
          </button>
          <button
            onClick={() => setActiveCalc('q-point')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCalc === 'q-point' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            نقطه کار بایاس (Q-Point)
          </button>
          <button
            onClick={() => setActiveCalc('thermal')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCalc === 'thermal' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            گرما و هیت‌سینک
          </button>
        </div>
      </div>

      {/* CALC 1: SWITCH BASE RESISTOR */}
      {activeCalc === 'switch' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-amber-300 block mb-2">ورودی‌های مدار کلیدزنی:</span>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">ولتاژ پین کنترل (V_in):</span>
                <span className="font-mono text-cyan-400 font-bold">{vin} V</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[3.3, 5.0, 12.0].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVin(v)}
                    className={`py-1 rounded text-xs border font-medium ${
                      vin === v ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {v} ولت {v === 3.3 ? '(ESP/ARM)' : v === 5.0 ? '(آردوینو)' : '(PLC)'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">جریان مورد نیاز بار (I_load):</span>
                <span className="font-mono text-rose-400 font-bold">{loadCurrent_mA} mA</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={loadCurrent_mA}
                onChange={(e) => setLoadCurrent_mA(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">بهره جریان ترانزیستور (β یا h_FE):</span>
                <span className="font-mono text-emerald-400 font-bold">{beta}</span>
              </div>
              <input
                type="range"
                min="30"
                max="300"
                step="10"
                value={beta}
                onChange={(e) => setBeta(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">ضریب اضافه جریان اشباع (Overdrive Factor):</span>
                <span className="font-mono text-amber-400 font-bold">{overdriveFactor} برابر</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={overdriveFactor}
                onChange={(e) => setOverdriveFactor(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                توصیه مهندسی: ۳ تا ۵ برابر برای اطمینان از اشباع عمیق و خنک ماندن ترانزیستور
              </span>
            </div>
          </div>

          {/* Results Output */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-300 block mb-3">نتایج محاسبات مهندسی:</span>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">جریان بیس تئوریک (I_B min):</span>
                  <span className="font-mono text-slate-200 font-bold">{switchCalcResults.ib_ideal_mA} mA</span>
                </div>

                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">جریان بیس تزریقی با ضریب اشباع:</span>
                  <span className="font-mono text-amber-400 font-bold">{switchCalcResults.ib_sat_mA} mA</span>
                </div>

                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">مقاومت دقیق محاسبه شده:</span>
                  <span className="font-mono text-cyan-400 font-bold">{switchCalcResults.rb_calc} Ω</span>
                </div>

                <div className="flex justify-between p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-lg">
                  <div>
                    <span className="font-bold text-emerald-300 block">مقاومت استاندارد بازار (سری E24):</span>
                    <span className="text-[10px] text-slate-400">نزدیک‌ترین مقدار قابل خرید در الکترونیکی‌ها</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-extrabold text-base self-center">
                    {switchCalcResults.nearestE24 >= 1000
                      ? `${(switchCalcResults.nearestE24 / 1000).toFixed(1)}k`
                      : `${switchCalcResults.nearestE24}`} Ω
                  </span>
                </div>

                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">حداقل توان مقاومت بیس:</span>
                  <span className="font-mono text-slate-200">{switchCalcResults.resistorPower_mW} mW (مقاومت ۱/۴ وات کافیست)</span>
                </div>

                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">تلفات حرارتی ترانزیستور در اشباع:</span>
                  <span className="font-mono text-amber-300 font-bold">{switchCalcResults.transistorSatPower_mW} mW</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              فرمول استفاده شده: <code className="font-mono text-cyan-300">R_B = (V_in - 0.7) / (ODR × (I_C / β))</code>
            </div>
          </div>
        </div>
      )}

      {/* CALC 2: Q-POINT */}
      {activeCalc === 'q-point' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-cyan-300 block mb-2">مقادیر مدار مقسم ولتاژ:</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">ولتاژ تغذیه V_CC:</label>
                <input
                  type="number"
                  value={vcc}
                  onChange={(e) => setVcc(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">بتای ترانزیستور (β):</label>
                <input
                  type="number"
                  value={betaBias}
                  onChange={(e) => setBetaBias(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-emerald-400 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">مقاومت بالا R1 (Ω):</label>
                <input
                  type="number"
                  value={r1}
                  onChange={(e) => setR1(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">مقاومت پایین R2 (Ω):</label>
                <input
                  type="number"
                  value={r2}
                  onChange={(e) => setR2(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">مقاومت کلکتور RC (Ω):</label>
                <input
                  type="number"
                  value={rc}
                  onChange={(e) => setRc(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-rose-400 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">مقاومت امیتر RE (Ω):</label>
                <input
                  type="number"
                  value={re}
                  onChange={(e) => setRe(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-amber-400 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-cyan-300 block mb-3">مختصات نقطه کار ساکن (Q-Point):</span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">ولتاژ تونن (V_TH):</span>
                  <span className="font-mono text-slate-200">{qPointResults.vth} V</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">ولتاژ بیس (V_B):</span>
                  <span className="font-mono text-cyan-400 font-bold">{qPointResults.vb} V</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">ولتاژ امیتر (V_E):</span>
                  <span className="font-mono text-slate-200">{qPointResults.ve} V</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">جریان نقطه کار کلکتور (I_CQ):</span>
                  <span className="font-mono text-emerald-400 font-bold">{qPointResults.ic_mA} mA</span>
                </div>
                <div className="flex justify-between p-2.5 bg-cyan-950/40 border border-cyan-500/40 rounded-lg">
                  <span className="text-cyan-300 font-bold">ولتاژ نقطه کار (V_CEQ):</span>
                  <span className="font-mono text-cyan-400 font-extrabold text-sm">{qPointResults.vce} V</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">وضعیت کارکرد:</span>
                  <span className="font-bold text-amber-300">{qPointResults.state}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 mt-2">
              ایده‌آل تقویت صوتی: <code className="text-amber-300">V_CEQ ≈ V_CC / 2 = {(vcc / 2).toFixed(1)}V</code> برای تقارن کامل موج.
            </div>
          </div>
        </div>
      )}

      {/* CALC 3: THERMAL */}
      {activeCalc === 'thermal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-rose-300 block mb-2">اطلاعات کارکرد حرارتی ترانزیستور:</span>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">ولتاژ دو سر کلکتور-امیتر (V_CE):</span>
                <span className="font-mono text-amber-400 font-bold">{vceThermal} V</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="24"
                step="0.5"
                value={vceThermal}
                onChange={(e) => setVceThermal(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">جریان کلکتور عبوری (I_C):</span>
                <span className="font-mono text-rose-400 font-bold">{icThermal_A} A ({icThermal_A * 1000} mA)</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="3.0"
                step="0.05"
                value={icThermal_A}
                onChange={(e) => setIcThermal_A(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">نوع پکیج فیزیکی ترانزیستور:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPackageType('to92')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium ${
                    packageType === 'to92'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  پکیج TO-92 (کوچک پلاستیکی مثل 2N2222)
                </button>
                <button
                  onClick={() => setPackageType('to220')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium ${
                    packageType === 'to220'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  پکیج TO-220 (با زبانه فلزی مثل TIP31)
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">دمای محیط اطراف (T_Ambient):</span>
                <span className="font-mono text-cyan-400 font-bold">{ambientTemp} °C</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-rose-300 block mb-3">تحلیل ایمنی حرارتی:</span>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">توان اتلافی (P_D = V_CE × I_C):</span>
                  <span className="font-mono text-amber-400 font-bold text-sm">{thermalResults.power_W} W</span>
                </div>

                <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">دمای تخمینی پیوند سیلیکون بدون خنک‌کننده:</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      thermalResults.junctionTempNoHeatsink > 150
                        ? 'text-rose-500'
                        : thermalResults.junctionTempNoHeatsink > 100
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {thermalResults.junctionTempNoHeatsink} °C
                  </span>
                </div>

                <div
                  className={`p-3 rounded-lg border flex items-start gap-2 ${
                    thermalResults.needsHeatsink
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                      : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {thermalResults.needsHeatsink ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {thermalResults.needsHeatsink ? 'اخطار: نیاز فوری به هیت‌سینک خنک‌کننده!' : 'دما در محدوده ایمن بدون نیاز به هیت‌سینک'}
                    </span>
                    {thermalResults.needsHeatsink && (
                      <span className="text-[11px] text-slate-300 block mt-1">
                        دمای قطعه از ۱۰۰ درجه فراتر می‌رود و خطر سوختن یا فرار حرارتی (Thermal Runaway) بالاست.
                      </span>
                    )}
                  </div>
                </div>

                {thermalResults.needsHeatsink && (
                  <div className="p-2 bg-slate-900 rounded-lg flex justify-between">
                    <span className="text-slate-400">حداکثر مقاومت حرارتی مجاز هیت‌سینک (R_θHS):</span>
                    <span className="font-mono text-cyan-300 font-bold">{thermalResults.reqHeatsinkResistance} °C/W یا کمتر</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 mt-2">
              نکته: همواره از خمیر سیلیکون مرغوب بین بدنه فلزی ترانزیستور و هیت‌سینک استفاده کنید تا مقاومت حرارتی تماس به حداقل برسد.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
