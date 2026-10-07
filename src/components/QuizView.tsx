import React, { useState } from 'react';
import { QuizQuestion, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { TrafficSignSvg } from './TrafficSignSvg';
import {
  Heart,
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  questions: QuizQuestion[];
  userLanguage: LanguageCode;
  initialLives?: number;
  onCompleteQuiz: (score: number, total: number, earnedXp: number) => void;
  onBack: () => void;
  onReviewLesson?: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  userLanguage,
  initialLives = 5,
  onCompleteQuiz,
  onBack,
  onReviewLesson,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [lives, setLives] = useState(initialLives);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongAnswerTrigger, setWrongAnswerTrigger] = useState(false);

  const t = TRANSLATIONS[userLanguage] || TRANSLATIONS.en;
  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      const newConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutive);
      setWrongStreak(0);

      // Trigger subtle mini confetti on bonus
      if (newConsecutive === 5) {
        try {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        } catch {
          // ignore
        }
      }
    } else {
      setConsecutiveCorrect(0);
      setWrongStreak((prev) => prev + 1);
      setLives((prev) => Math.max(0, prev - 1));
      setWrongAnswerTrigger(true);
      setTimeout(() => setWrongAnswerTrigger(false), 500);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      setIsFinished(true);
      const bonusXp = consecutiveCorrect >= 5 ? 20 : 0;
      const earnedXp = score * 10 + bonusXp;

      if (score >= Math.ceil(totalQuestions * 0.6)) {
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }

      onCompleteQuiz(score, totalQuestions, earnedXp);
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setConsecutiveCorrect(0);
    setWrongStreak(0);
    setLives(initialLives);
    setIsFinished(false);
  };

  if (isFinished) {
    const isPass = score >= Math.ceil(totalQuestions * 0.6);
    const bonusPoints = consecutiveCorrect >= 5 ? 20 : 0;
    const totalXp = score * 10 + bonusPoints;

    return (
      <div className="max-w-md mx-auto min-h-[75vh] flex flex-col justify-between p-6 select-none animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-4 my-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-md bg-white dark:bg-[#1C1F24] border border-gray-100 dark:border-gray-800">
            {isPass ? '🏆' : '🎯'}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-white">
              {isPass ? t.youPassed : t.youNeedMore}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isPass
                ? 'Great mastery! Your road instincts are getting stronger.'
                : 'Every mistake is a lesson learned without risking a fine.'}
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#1C1F24] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center justify-around">
              <div>
                <div className="text-2xl font-black text-[#FF6B35]">
                  {score} / {totalQuestions}
                </div>
                <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Score
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
              <div>
                <div className="text-2xl font-black text-[#10B981]">
                  +{totalXp} XP
                </div>
                <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Experience
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
              <div>
                <div className="text-2xl font-black text-rose-500">
                  {lives}
                </div>
                <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Lives Left
                </div>
              </div>
            </div>

            {bonusPoints > 0 && (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1.5 border border-amber-200 dark:border-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>5 in a row streak bonus! +20 XP</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2.5 pt-6">
          <button
            onClick={onBack}
            className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#E85D04] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-500/25 active:scale-98 transition-all cursor-pointer"
          >
            Continue Learning
          </button>
          <button
            onClick={handleRetake}
            className="w-full py-3 bg-white dark:bg-[#1C1F24] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-2xl hover:border-gray-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-md mx-auto min-h-[85vh] flex flex-col justify-between p-4 pb-20 select-none">
      {/* Quiz Top Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white dark:bg-[#1C1F24] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Question {currentIndex + 1} of {totalQuestions}
          </span>

          {/* Lives Indicator */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{lives}</span>
          </div>
        </div>

        {/* Thin Step Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#FF6B35] h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className={`my-auto py-3 space-y-4 ${wrongAnswerTrigger ? 'animate-gentle-shake' : ''}`}>
        {/* Support message if user made 3 mistakes in a row */}
        {wrongStreak >= 3 && !isAnswered && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between animate-in fade-in">
            <span>You're learning. That's what matters. Take your time!</span>
            {onReviewLesson && (
              <button
                onClick={onReviewLesson}
                className="font-bold underline text-amber-800 dark:text-amber-300 ml-2 cursor-pointer"
              >
                Review Lesson
              </button>
            )}
          </div>
        )}

        <div className="bg-white dark:bg-[#1C1F24] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          {/* Sign Image if applicable */}
          {currentQuestion.signSvgKey && (
            <div className="flex justify-center py-1">
              <TrafficSignSvg svgKey={currentQuestion.signSvgKey} size={100} />
            </div>
          )}

          <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] dark:text-white leading-snug">
            {currentQuestion.question}
          </h3>
        </div>

        {/* 4 Large Options (A, B, C, D) */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQuestion.correctIndex;

            let cardStyle = 'bg-white dark:bg-[#1C1F24] border-gray-200 dark:border-gray-700 text-[#1A1A1A] dark:text-gray-100 hover:border-[#FF6B35] dark:hover:border-[#FF6B35]';
            let circleStyle = 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';

            if (isAnswered) {
              if (isCorrectOption) {
                cardStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-2 border-[#10B981] text-emerald-950 dark:text-emerald-200 font-semibold shadow-xs animate-pulse-subtle';
                circleStyle = 'bg-[#10B981] text-white';
              } else if (isSelected && !isCorrectOption) {
                cardStyle = 'bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-400 text-rose-950 dark:text-rose-200';
                circleStyle = 'bg-rose-500 text-white';
              } else {
                cardStyle = 'bg-white/60 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 text-left shadow-2xs cursor-pointer ${cardStyle}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${circleStyle}`}
                >
                  {isAnswered && isCorrectOption ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isAnswered && isSelected && !isCorrectOption ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    optionLetters[idx]
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium leading-normal flex-1">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation Card (Fairness Ledger) */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border text-left text-xs space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              selectedOption === currentQuestion.correctIndex
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-orange-50/90 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800 text-orange-950 dark:text-orange-200'
            }`}
          >
            <div className="font-extrabold flex items-center gap-1.5 text-sm">
              {selectedOption === currentQuestion.correctIndex ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>{t.correct}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>{t.notQuite} Option {optionLetters[currentQuestion.correctIndex]} is correct.</span>
                </>
              )}
            </div>
            <p className="leading-relaxed font-medium">
              {currentQuestion.explanation}
            </p>
            {currentQuestion.challanImpact && (
              <p className="text-[11px] font-bold text-rose-700 dark:text-rose-400 pt-0.5">
                ⚖️ Penalty: {currentQuestion.challanImpact}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Next Question Button */}
      <div className="pt-2">
        <button
          disabled={!isAnswered}
          onClick={handleNext}
          className={`w-full py-4 px-6 font-extrabold text-sm rounded-2xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isAnswered
              ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85D04] text-white shadow-orange-500/25'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>{currentIndex + 1 === totalQuestions ? 'View Results' : t.nextQuestion}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
