import React, { useState } from 'react';
import { ActiveTab } from './types';
import { Header } from './components/Header';
import { ChapterReader } from './components/ChapterReader';
import { CircuitSimulator } from './components/CircuitSimulator';
import { Calculators } from './components/Calculators';
import { MultimeterGuide } from './components/MultimeterGuide';
import { QuizSection } from './components/QuizSection';
import { FlashcardsSection } from './components/FlashcardsSection';
import { VideoReferencePanel } from './components/VideoReferencePanel';
import { DiagramAtomic } from './components/DiagramAtomic';
import { DiagramPNJunction } from './components/DiagramPNJunction';
import { DiagramNPNInternal } from './components/DiagramNPNInternal';
import { DiagramSchematics } from './components/DiagramSchematics';
import { VIDEO_URL, VIDEO_ID, VIDEO_CHANNEL, VIDEO_TITLE } from './data/coursebookData';
import { Cpu, Youtube, Heart, BookOpen, Sliders, Calculator, Award, Layers, Sparkles, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('booklet');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* HERO BANNER (Only on top of booklet tab) */}
        {activeTab === 'booklet' && !searchQuery && (
          <div className="bg-gradient-to-b from-slate-900/80 to-slate-950 border-b border-slate-800/80 py-10 no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>کتابچه راهنمای جامع مهندسی الکترونیک</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 tracking-tight leading-snug">
                    آموزش کامل و کاربردی ترانزیستورها از صفر تا صد
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
                    مرجع جامع آموزشی مبتنی بر ویدیوی تحسین‌شده <strong className="text-slate-200">{VIDEO_TITLE}</strong> از کانال <strong className="text-rose-400">{VIDEO_CHANNEL}</strong>. شامل فیزیک اتمی بلور سیلیسیم، نحوه کارکرد داخلی NPN و PNP، مدارات کلید و تقویت‌کننده صوتی، آزمایشگاه شبیه‌سازی زنده و ماشین‌حساب‌های مهندسی.
                  </p>
                </div>

                {/* Quick Action Box */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 min-w-[260px] shadow-lg">
                  <span className="text-xs font-bold text-slate-300">دسترسی سریع به ابزارها:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setActiveTab('simulator')}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 font-medium transition-all text-center flex flex-col items-center gap-1"
                    >
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <span>شبیه‌ساز مدار</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('calculators')}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 font-medium transition-all text-center flex flex-col items-center gap-1"
                    >
                      <Calculator className="w-4 h-4 text-cyan-400" />
                      <span>ماشین‌حساب</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 font-medium transition-all text-center flex flex-col items-center gap-1"
                    >
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>آزمون ۱۰ سوالی</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('video-guide')}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 font-medium transition-all text-center flex flex-col items-center gap-1"
                    >
                      <Youtube className="w-4 h-4 text-rose-500" />
                      <span>ویدیوی مرجع</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: BOOKLET (Full 10 Chapters) */}
        {activeTab === 'booklet' && (
          <ChapterReader searchQuery={searchQuery} />
        )}

        {/* TAB 2: INTERACTIVE CIRCUIT SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CircuitSimulator />
          </div>
        )}

        {/* TAB 3: CALCULATORS */}
        {activeTab === 'calculators' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Calculators />
          </div>
        )}

        {/* TAB 4: MULTIMETER WORKSHOP */}
        {activeTab === 'multimeter' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MultimeterGuide />
          </div>
        )}

        {/* TAB 5: QUIZ */}
        {activeTab === 'quiz' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <QuizSection />
          </div>
        )}

        {/* TAB 6: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FlashcardsSection />
          </div>
        )}

        {/* TAB 7: VIDEO REFERENCE */}
        {activeTab === 'video-guide' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <VideoReferencePanel />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-slate-950 border-t border-slate-900 py-8 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block">جزوه جامع مهندسی ترانزیستورها (صفر تا صد)</span>
              <span className="text-[11px] text-slate-400">
                منبع اصلی: ویدیوی کانال The Engineering Mindset در یوتیوب (شناسه 2uowMENwiHQ)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Youtube className="w-4 h-4 text-rose-500" />
              <span>مشاهده ویدیوی مرجع در یوتیوب</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
