import React from 'react';
import { ActiveTab } from '../types';
import { Cpu, BookOpen, Sliders, Calculator, Award, Layers, Gauge, Youtube, Printer, Search } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'booklet', label: 'جزوه کامل ۱۰ فصل', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'simulator', label: 'آزمایشگاه مدار', icon: <Sliders className="w-4 h-4" /> },
    { id: 'calculators', label: 'ماشین‌حساب‌ها', icon: <Calculator className="w-4 h-4" /> },
    { id: 'multimeter', label: 'تست با مولتی‌متر', icon: <Gauge className="w-4 h-4" /> },
    { id: 'quiz', label: 'آزمون آموخته‌ها', icon: <Award className="w-4 h-4" /> },
    { id: 'flashcards', label: 'فلش‌کارت‌ها', icon: <Layers className="w-4 h-4" /> },
    { id: 'video-guide', label: 'ویدیوی مرجع', icon: <Youtube className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between py-3.5 gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-100 tracking-tight flex items-center gap-2">
                  <span>جزوه جامع مهندسی ترانزیستورها</span>
                  <span className="text-[11px] font-mono text-slate-500 font-normal">v2.0</span>
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>مرجع صفر تا صد</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>بر اساس انیمیشن The Engineering Mindset</span>
                </div>
              </div>
            </div>

            {/* Print Button (Mobile & Desktop) */}
            <button
              onClick={handlePrint}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:border-slate-700"
              title="پرینت / ذخیره جزوه PDF"
            >
              <Printer className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64 md:w-72">
              <input
                type="text"
                placeholder="جستجو در فصل‌ها، مفاهیم و فرمول‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500/80 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            <button
              onClick={handlePrint}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-all hover:bg-slate-850"
              title="پرینت جزوه برای مطالعه آفلاین یا ذخیره به صورت PDF"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>چاپ / ذخیره PDF</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Zero-pill discipline: segmented clean control) */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-900">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
