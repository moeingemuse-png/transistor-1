import React, { useState } from 'react';
import { VIDEO_ID, VIDEO_URL, VIDEO_TITLE, VIDEO_CHANNEL, CHAPTERS_DATA } from '../data/coursebookData';
import { Play, ExternalLink, Youtube, Clock, CheckCircle } from 'lucide-react';

export const VideoReferencePanel: React.FC = () => {
  const [activeTimestamp, setActiveTimestamp] = useState<number>(0);

  const chapters = [
    { time: '0:00', sec: 0, title: 'مقدمه و دوران لامپ‌های خلأ داغ' },
    { time: '0:35', sec: 35, title: 'دو کارکرد اصلی: سوئیچینگ و تقویت‌کننده' },
    { time: '1:18', sec: 78, title: 'اتم سیلیسیم و ساختار ۴ الکترون ظرفیت' },
    { time: '2:10', sec: 130, title: 'دوپینگ نیمه‌رساناها (نوع N و نوع P)' },
    { time: '2:40', sec: 160, title: 'پیوند PN و تشکیل لایه سد پتانسیل (۰.۷ ولت)' },
    { time: '4:15', sec: 255, title: 'کالبدشکافی NPN و مکانیزم تزریق بار از امیتر به کلکتور' },
    { time: '6:50', sec: 410, title: 'جریان‌های سه پایه (I_E, I_B, I_C) و ضریب بهره بتا' },
    { time: '7:40', sec: 460, title: 'ترانزیستور PNP و معکوس بودن حامل‌ها و ولتاژ' },
    { time: '8:50', sec: 530, title: 'نواحی کاری: قطع، خطی و اشباع کامل' },
    { time: '9:45', sec: 585, title: 'مدار کلید ترانزیستوری و اهمیت دیود هرزگرد' },
    { time: '11:15', sec: 675, title: 'تقویت‌کننده سیگنال صوتی و نقطه کار Q' },
    { time: '12:30', sec: 750, title: 'مدیریت حرارت، پکیج‌ها و مقایسه با ماسفت' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 my-8 text-slate-100 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-bold text-lg">
            <Youtube className="w-6 h-6" />
            <span>منبع ویدیویی مرجع: The Engineering Mindset</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            همگام‌سازی بخش‌های این جزوه با ویدیوی مرجع یوتیوب (شناسه 2uowMENwiHQ)
          </p>
        </div>

        <a
          href={VIDEO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/20"
        >
          <span>مشاهده مستقیم در یوتیوب</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Video Player (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 shadow-lg">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?start=${activeTimestamp}&autoplay=0&rel=0`}
              title={VIDEO_TITLE}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="mt-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-slate-300 font-medium">کانال مرجع: {VIDEO_CHANNEL}</span>
            </div>
            <span className="text-slate-500 font-mono">YouTube ID: {VIDEO_ID}</span>
          </div>
        </div>

        {/* Timestamp Chapters List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col max-h-[380px] overflow-y-auto">
          <span className="text-xs font-bold text-slate-300 mb-3 block">فهرست فصل‌های ویدیویی (کلیک برای پخش):</span>

          <div className="space-y-1.5">
            {chapters.map((ch, idx) => {
              const isActive = activeTimestamp === ch.sec;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTimestamp(ch.sec)}
                  className={`w-full text-right p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-rose-950/40 border-rose-500/80 text-rose-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Play className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-rose-400 fill-rose-400' : 'text-slate-500'}`} />
                    <span className="truncate">{ch.title}</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px] shrink-0">{ch.time}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
