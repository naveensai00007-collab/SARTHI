import React, { useState } from 'react';
import { UserProfile, Lesson, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  HelpCircle,
  Award,
  Shield,
  Heart,
  Flame,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Play,
  RotateCcw,
} from 'lucide-react';

interface QuizHubProps {
  profile: UserProfile;
  lessons: Lesson[];
  onStartLessonQuiz: (lessonId: string) => void;
  onStartRandomQuiz: () => void;
  onOpenMockTest: () => void;
}

export const QuizHub: React.FC<QuizHubProps> = ({
  profile,
  lessons,
  onStartLessonQuiz,
  onStartRandomQuiz,
  onOpenMockTest,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.en;

  const categories = [
    { key: 'all', label: 'All Quizzes (15)' },
    { key: 'mandatory', label: 'Mandatory Signs' },
    { key: 'cautionary', label: 'Cautionary Signs' },
    { key: 'rules', label: 'Rules of the Road' },
    { key: 'challan_proof', label: 'Challan-Proof' },
  ];

  const filteredLessons = lessons.filter((l) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'rules') {
      return l.category === 'rules' || l.category === 'informatory';
    }
    return l.category === filterCategory;
  });

  return (
    <div className="max-w-lg mx-auto p-4 pb-24 space-y-5 select-none">
      {/* Header and User Stats Ribbon */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider block">
            Practice Arena
          </span>
          <h2 className="text-xl font-black text-[#1A1A1A] dark:text-white tracking-tight">
            Quiz Center
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Lives Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{profile.lives}/5 Lives</span>
          </div>

          {/* XP Badge */}
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-full text-xs font-bold text-amber-700 dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{profile.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Featured Quiz Modes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Daily Random 5-Question Sprint */}
        <div
          onClick={onStartRandomQuiz}
          className="p-5 bg-gradient-to-br from-[#FF6B35] to-[#E85D04] rounded-3xl text-white shadow-md shadow-orange-500/20 cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="space-y-1 relative z-10">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Quick Sprint
            </span>
            <h3 className="text-lg font-black tracking-tight text-white pt-1">
              Daily 5-Question Quiz
            </h3>
            <p className="text-xs text-white/85 leading-snug">
              Rapid mixed question test from all Indian road rule topics.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-white/90">2 min • 5 Questions</span>
            <div className="w-8 h-8 rounded-full bg-white text-[#FF6B35] flex items-center justify-center font-bold shadow-xs group-hover:translate-x-0.5 transition-transform">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Full 15-Minute RTO Mock Test */}
        <div
          onClick={onOpenMockTest}
          className="p-5 bg-gradient-to-br from-[#10B981] to-[#047857] rounded-3xl text-white shadow-md shadow-emerald-600/20 cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="space-y-1 relative z-10">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
              <Award className="w-3 h-3" /> Certification Exam
            </span>
            <h3 className="text-lg font-black tracking-tight text-white pt-1">
              Official RTO Mock (STALL)
            </h3>
            <p className="text-xs text-white/85 leading-snug">
              15 questions, 15 min countdown. Qualify for the official Sarthi Certificate!
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-white/90">Pass: 60%+</span>
            <div className="w-8 h-8 rounded-full bg-white text-[#10B981] flex items-center justify-center font-bold shadow-xs group-hover:translate-x-0.5 transition-transform">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes by Topic Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#1A1A1A] dark:text-white">
            Topic Quizzes (15 Lessons)
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
            {profile.completedQuizIds.length} / 15 Passed
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === cat.key
                  ? 'bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] shadow-xs'
                  : 'bg-white dark:bg-[#1C1F24] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Topic Quizzes List */}
        <div className="space-y-2">
          {filteredLessons.map((lesson) => {
            const isPassed = profile.completedQuizIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => onStartLessonQuiz(lesson.id)}
                className="p-3.5 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs hover:border-[#FF6B35] dark:hover:border-[#FF6B35] transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isPassed
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#10B981]'
                        : 'bg-orange-50 dark:bg-orange-950/40 text-[#FF6B35]'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    ) : (
                      lesson.number
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-[#1A1A1A] dark:text-white group-hover:text-[#FF6B35] transition-colors leading-tight">
                      {lesson.title}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {lesson.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPassed
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {isPassed ? 'Passed' : '5 Qs'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF6B35] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
