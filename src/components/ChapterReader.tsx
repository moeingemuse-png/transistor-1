import React, { useState } from 'react';
import { Chapter } from '../types';
import { CHAPTERS_DATA, VIDEO_ID } from '../data/coursebookData';
import { DiagramAtomic } from './DiagramAtomic';
import { DiagramPNJunction } from './DiagramPNJunction';
import { DiagramNPNInternal } from './DiagramNPNInternal';
import { DiagramSchematics } from './DiagramSchematics';
import { CircuitSimulator } from './CircuitSimulator';
import { MultimeterGuide } from './MultimeterGuide';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Info,
  Youtube,
  Play
} from 'lucide-react';

interface ChapterReaderProps {
  searchQuery: string;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({ searchQuery }) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Filter chapters based on search query
  const filteredChapters = CHAPTERS_DATA.filter((ch) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      ch.title.toLowerCase().includes(query) ||
      ch.englishTitle.toLowerCase().includes(query) ||
      ch.summary.toLowerCase().includes(query) ||
      ch.sections.some((s) => s.title.toLowerCase().includes(query) || s.content.some((c) => c.toLowerCase().includes(query)))
    );
  });

  const activeChapter = filteredChapters[activeChapterIndex] || CHAPTERS_DATA[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Result Feedback if searching */}
      {searchQuery.trim() && (
        <div className="mb-6 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs flex items-center justify-between">
          <span className="text-slate-300">
            نتایج جستجو برای «<strong className="text-amber-400">{searchQuery}</strong>»: {filteredChapters.length} فصل یافت شد.
          </span>
          <span className="text-slate-500 font-mono text-[11px]">{filteredChapters.length} / 10</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Table of Contents Sidebar (3 cols) */}
        <aside className="lg:col-span-4 xl:col-span-3 no-print">
          <div className="sticky top-24 bg-slate-950 border border-slate-800/90 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>فهرست فصول جزوه (۱۰ فصل)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">سرفصل‌ها</span>
            </div>

            <nav className="mt-3 space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
              {CHAPTERS_DATA.map((ch, idx) => {
                const isSelected = activeChapter.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      const foundIdx = filteredChapters.findIndex((c) => c.id === ch.id);
                      if (foundIdx !== -1) setActiveChapterIndex(foundIdx);
                    }}
                    className={`w-full text-right p-3 rounded-xl border text-xs transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 text-amber-300 font-bold shadow-sm'
                        : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono opacity-60">فصل {ch.number}</span>
                      <span className="text-[10px] text-slate-500">{ch.readTime}</span>
                    </div>
                    <span className="line-clamp-2 leading-relaxed">{ch.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area (9 cols) */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-8">
          {/* Chapter Header Banner */}
          <article className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Top Chapter Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
              <span className="font-mono text-amber-400 font-bold">فصل شماره {activeChapter.number}</span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>زمان مطالعه: {activeChapter.readTime}</span>
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <a
                href={activeChapter.videoTimestamp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors"
                title="مشاهده لحظه مربوطه در ویدیوی The Engineering Mindset"
              >
                <Youtube className="w-3.5 h-3.5 text-rose-500" />
                <span>ویدیو: {activeChapter.videoTimestamp.label}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Title & English Subtitle */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 leading-snug mb-2">
              {activeChapter.title}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-500 mb-4" dir="ltr">
              {activeChapter.englishTitle}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-900 pt-4">
              {activeChapter.summary}
            </p>

            {/* Key Takeaways Box */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2.5">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                <span>نکات کلیدی و چکیده این فصل:</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                {activeChapter.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* Chapter Sections */}
          {activeChapter.sections.map((sec) => (
            <section
              key={sec.id}
              className="bg-slate-950 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-lg print-break-inside-avoid"
            >
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-4 pb-2 border-b border-slate-850 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{sec.title}</span>
              </h3>

              {/* Text Paragraphs */}
              <div className="space-y-3.5 text-sm sm:text-[15px] text-slate-300 leading-relaxed">
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx} className="leading-8">
                    {p}
                  </p>
                ))}
              </div>

              {/* Key Formula Box */}
              {sec.keyFormula && (
                <div className="my-5 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" dir="rtl">
                  <div>
                    <span className="text-xs font-bold text-cyan-300 block mb-1">فرمول محاسباتی کلیدی:</span>
                    <span className="text-xs text-slate-400">{sec.keyFormula.description}</span>
                  </div>
                  <div
                    className="p-2.5 px-4 rounded-lg bg-slate-950 border border-cyan-500/30 text-cyan-400 font-mono text-sm font-bold self-stretch sm:self-auto text-center"
                    dir="ltr"
                  >
                    {sec.keyFormula.formula}
                  </div>
                </div>
              )}

              {/* Callout box (Tip, Warning, Info) */}
              {sec.callout && (
                <div
                  className={`my-5 p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                    sec.callout.type === 'warning'
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                      : sec.callout.type === 'tip'
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  }`}
                >
                  {sec.callout.type === 'warning' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                  {sec.callout.type === 'tip' && <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                  {sec.callout.type === 'info' && <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                  <div>
                    <h5 className="font-bold mb-1 text-sm">{sec.callout.title}</h5>
                    <p className="text-slate-300">{sec.callout.text}</p>
                  </div>
                </div>
              )}

              {/* Dynamic Diagram Injection */}
              {sec.diagramType === 'atomic' && <DiagramAtomic />}
              {sec.diagramType === 'pn-junction' && <DiagramPNJunction />}
              {sec.diagramType === 'npn-internal' && <DiagramNPNInternal />}
              {sec.diagramType === 'schematic-symbol' && <DiagramSchematics />}
              {sec.diagramType === 'switch-circuit' && <CircuitSimulator />}
              {sec.diagramType === 'multimeter' && <MultimeterGuide />}
            </section>
          ))}

          {/* Bottom Chapter Navigation (Previous / Next) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-850 no-print">
            {activeChapterIndex > 0 ? (
              <button
                onClick={() => setActiveChapterIndex((prev) => prev - 1)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                <ChevronRight className="w-4 h-4 text-amber-400" />
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">فصل قبلی</span>
                  <span>{filteredChapters[activeChapterIndex - 1]?.title.slice(0, 35)}...</span>
                </div>
              </button>
            ) : (
              <div />
            )}

            {activeChapterIndex < filteredChapters.length - 1 && (
              <button
                onClick={() => setActiveChapterIndex((prev) => prev + 1)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20"
              >
                <div className="text-left">
                  <span className="text-[10px] text-slate-850 font-bold block">فصل بعدی</span>
                  <span>{filteredChapters[activeChapterIndex + 1]?.title.slice(0, 35)}...</span>
                </div>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
