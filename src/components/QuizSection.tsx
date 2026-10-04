import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/coursebookData';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';

export const QuizSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const isAnswered = selectedAnswers[currentQ.id] !== undefined;

  const handleSelect = (optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentIdx(0);
  };

  const score = calculateScore();
  const totalQuestions = QUIZ_QUESTIONS.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 my-8 text-slate-100 shadow-2xl">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <Award className="w-5 h-5" />
            <span>آزمون جامع ارزیابی و تثبیت آموخته‌های ترانزیستور</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ۱۰ تست طبق استاندارد آزمون‌های فنی مهندسی با بازخورد تشریحی و ارجاع به ویدیوی The Engineering Mindset
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400">سوال</span>
          <span className="text-amber-400 font-bold">{currentIdx + 1}</span>
          <span className="text-slate-500">از</span>
          <span className="text-slate-300">{totalQuestions}</span>
        </div>
      </div>

      {!showResults ? (
        <div className="mt-6">
          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-6 border border-slate-800">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                سطح: {currentQ.difficulty}
              </span>
              <span className="text-xs text-slate-500">
                منبع ویدیویی: دقیقه {currentQ.sourceTimestamp}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-100 leading-relaxed mb-6">
              {currentQ.id}. {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                const isCorrect = currentQ.correctIndex === optIdx;

                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';

                if (isAnswered) {
                  if (isSelected && isCorrect) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold';
                  } else if (isCorrect) {
                    btnStyle = 'bg-emerald-950/40 border-emerald-500/70 text-emerald-300';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(optIdx)}
                    className={`w-full text-right p-4 rounded-xl border text-sm transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs leading-relaxed">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>تحلیل و پاسخ تشریحی:</span>
                </div>
                <p className="text-slate-300">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold hover:bg-slate-700 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              <span>سوال قبلی</span>
            </button>

            {currentIdx < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
              >
                <span>سوال بعدی</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowResults(true)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
              >
                <span>مشاهده کارنامه و نتایج نهایی</span>
                <Award className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="mt-6 text-center py-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center mb-4">
            <Award className="w-10 h-10 text-amber-400" />
          </div>

          <h3 className="text-2xl font-black text-slate-100 mb-1">
            {percentage >= 80 ? 'عالی! شما بر مفاهیم ترانزیستور کاملاً مسلط هستید' : percentage >= 50 ? 'نتیجه خوب! مرور مجدد فصل‌ها مهارت شما را تکمیل می‌کند' : 'نیاز به مرور مجدد فصل‌های ۵ و ۸'}
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            شما به <strong className="text-amber-400 font-mono">{score}</strong> سوال از <strong className="text-slate-200 font-mono">{totalQuestions}</strong> سوال پاسخ صحیح دادید (نمره: <span className="font-mono">{percentage}٪</span>).
          </p>

          {/* Detailed Question Review List */}
          <div className="text-right space-y-3 max-w-2xl mx-auto my-6">
            {QUIZ_QUESTIONS.map((q) => {
              const isCorrect = selectedAnswers[q.id] === q.correctIndex;
              return (
                <div key={q.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span className="text-slate-300 font-medium">سوال {q.id}: {q.question.slice(0, 60)}...</span>
                  </div>
                  <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isCorrect ? 'صحیح' : 'نادرست'}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>آزمون مجدد از ابتدا</span>
          </button>
        </div>
      )}
    </div>
  );
};
