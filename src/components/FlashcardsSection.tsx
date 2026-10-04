import React, { useState } from 'react';
import { FLASHCARDS_DATA } from '../data/coursebookData';
import { Layers, Rotate3d, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export const FlashcardsSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');

  const categories = ['همه', 'قوانین و فرمول‌ها', 'مفاهیم بنیادی', 'مدار و طراحی', 'عیب‌یابی کارگاهی', 'حفاظت مدار', 'مدیریت حرارت'];

  const filteredCards = FLASHCARDS_DATA.filter((c) => selectedCategory === 'همه' || c.category === selectedCategory);
  const currentCard = filteredCards[currentIdx] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 my-8 text-slate-100 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
            <Layers className="w-5 h-5" />
            <span>فلش‌کارت‌های مرور سریع نکات امتحانی و مصاحبه کاری</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            روی کارت کلیک کنید تا پاسخ تشریحی و فرمول‌های کلیدی نمایان شود
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIdx(0);
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-500 text-white font-bold border-rose-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredCards.length > 0 ? (
        <div className="max-w-xl mx-auto my-8">
          {/* Card index indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <span>دسته‌بندی: <strong className="text-rose-400">{currentCard.category}</strong></span>
            <span className="font-mono">کارت {currentIdx + 1} از {filteredCards.length}</span>
          </div>

          {/* Interactive Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[220px] bg-slate-950 border-2 border-slate-800 hover:border-rose-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl relative overflow-hidden group select-none"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-900">
              <span className="flex items-center gap-1 text-slate-400 group-hover:text-rose-400 transition-colors">
                <Rotate3d className="w-4 h-4" />
                <span>برای چرخش کارت کلیک کنید</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">{isFlipped ? 'پاسخ' : 'سوال'}</span>
            </div>

            <div className="my-auto py-4 text-center">
              {!isFlipped ? (
                <h4 className="text-lg font-bold text-slate-100 leading-relaxed">
                  {currentCard.question}
                </h4>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {currentCard.answer}
                  </p>
                  {currentCard.formula && (
                    <div className="inline-block px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-amber-400 text-xs font-bold mt-2" dir="ltr">
                      {currentCard.formula}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-900">
              {isFlipped ? 'روی کارت بزنید تا سوال را دوباره ببینید' : 'برای مشاهده جواب کلیک کنید'}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
              title="کارت قبلی"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all"
            >
              {isFlipped ? 'مشاهده سوال' : 'مشاهده جواب'}
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
              title="کارت بعدی"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-slate-500 text-xs">
          موردی در این دسته‌بندی یافت نشد.
        </div>
      )}
    </div>
  );
};
