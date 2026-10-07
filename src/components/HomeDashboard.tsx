import React, { useState } from 'react';
import { UserProfile, Lesson } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  Flame,
  Shield,
  Play,
  Award,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Calendar,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';

interface HomeDashboardProps {
  profile: UserProfile;
  lessons: Lesson[];
  onStartLesson: (lessonId: string) => void;
  onStartQuiz: (lessonId: string) => void;
  onOpenMockTest: () => void;
  onOpenChallanModule: () => void;
  onOpenSigns: () => void;
  onOpenVerifyPortal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  lessons,
  onStartLesson,
  onStartQuiz,
  onOpenMockTest,
  onOpenChallanModule,
  onOpenSigns,
  onOpenVerifyPortal,
}) => {
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [curriculumTab, setCurriculumTab] = useState<'all' | 'signs' | 'rules' | 'challan'>('all');

  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.en;

  // Calculate RTO-Ready Percentage
  const totalCoreLessons = 12;
  const completedLessonsCount = profile.completedLessonIds.filter(
    (id) => !id.includes('13') && !id.includes('14') && !id.includes('15')
  ).length;
  const completedQuizzesCount = profile.completedQuizIds.length;
  const mockTestsCount = profile.mockTestsTaken;

  // Weighted RTO Ready: 40% lessons, 30% quizzes, 30% mock test
  const lessonPct = Math.min(100, (completedLessonsCount / totalCoreLessons) * 100);
  const quizPct = Math.min(100, (completedQuizzesCount / 8) * 100);
  const mockPct = mockTestsCount > 0 ? (profile.bestMockScore >= 9 ? 100 : 70) : 0;
  const rtoReadyPercent = Math.min(
    100,
    Math.round(lessonPct * 0.4 + quizPct * 0.3 + mockPct * 0.3)
  );

  // Challan-proof percentage
  const challanLessonsCompleted = profile.completedLessonIds.filter((id) =>
    ['lesson-13', 'lesson-14', 'lesson-15'].includes(id)
  ).length;
  const challanProofPercent = Math.min(
    100,
    Math.round(
      (challanLessonsCompleted / 3) * 60 + (completedLessonsCount / 12) * 40
    )
  );

  // Find next incomplete lesson
  const nextLesson =
    lessons.find((l) => !profile.completedLessonIds.includes(l.id)) || lessons[0];

  // Circle stroke calculations for 120px ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (rtoReadyPercent / 100) * circumference;

  // Calendar days for streak modal (past 30 days)
  const today = new Date();
  const past30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (29 - i));
    const active = i >= 30 - profile.streakDays;
    return { date: d.getDate(), month: d.toLocaleString('default', { month: 'short' }), active };
  });

  const filteredCurriculum = lessons.filter((l) => {
    if (curriculumTab === 'all') return true;
    if (curriculumTab === 'signs') return l.category === 'mandatory' || l.category === 'cautionary' || l.category === 'informatory';
    if (curriculumTab === 'rules') return l.category === 'rules';
    if (curriculumTab === 'challan') return l.category === 'challan_proof';
    return true;
  });

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto px-4 pt-2">
      {/* Top Greeting Bar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <span>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight flex items-center gap-1.5">
            <span>{profile.name}</span>
            <span className="text-lg">👋</span>
          </h2>
        </div>

        {/* Streak Flame Pill */}
        <button
          onClick={() => setShowStreakModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200/80 dark:border-amber-800 rounded-full text-xs font-bold text-amber-700 dark:text-amber-400 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Click to view streak calendar"
        >
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
          <span>{profile.streakDays} {t.streakText}</span>
        </button>
      </div>

      {/* Progress Cards: RTO-Ready & Challan-Proof */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Large Circular Progress Ring Card */}
        <div
          onClick={() => setShowProgressModal(true)}
          className="bg-white dark:bg-[#1C1F24] rounded-3xl p-5 border border-orange-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FF6B35]/10 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
              Licensing Metric
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-0.5 group-hover:text-[#FF6B35] transition-colors">
              Breakdown <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3">
            {/* SVG Circular Progress Ring */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#F3F4F6"
                  className="dark:stroke-gray-800"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="url(#progressGradient)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B35" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[#1A1A1A] dark:text-white tracking-tighter">
                  {rtoReadyPercent}%
                </span>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight -mt-0.5">
                  RTO-Ready
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="text-sm font-bold text-[#1A1A1A] dark:text-white leading-snug">
                {rtoReadyPercent >= 80
                  ? 'Ready for Learner Exam!'
                  : rtoReadyPercent >= 50
                  ? 'Strong Momentum'
                  : 'Starting Your Path'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                {completedLessonsCount} of {totalCoreLessons} lessons completed. Tap to view test readiness.
              </p>
            </div>
          </div>
        </div>

        {/* Challan-Proof Shield Badge Card */}
        <div
          onClick={() => setShowChallanModal(true)}
          className="bg-white dark:bg-[#1C1F24] rounded-3xl p-5 border border-emerald-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1B5E20] dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#1B5E20] dark:text-emerald-400" />
                Challan-Proof
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold group-hover:text-[#1B5E20] transition-colors flex items-center gap-0.5">
                Savings <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-[#1B5E20] dark:text-emerald-400 tracking-tight">
                  {challanProofPercent}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  Fines Risk Shielded
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#1B5E20] dark:text-emerald-400 flex items-center justify-center font-bold text-lg shadow-2xs group-hover:scale-105 transition-transform">
                🛡️
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2">
              💰 <span className="font-semibold text-gray-800 dark:text-white">₹5,000+ saved</span> by knowing helmet, PUCC & stop rules.
            </p>
          </div>
        </div>
      </div>

      {/* Today's Recommended 3-Minute Lesson Card */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#E85D04] rounded-3xl p-5 text-white shadow-lg shadow-[#FF6B35]/25 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-12 -top-12 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-sm text-white">
              <Sparkles className="w-3 h-3" />
              {t.todaysLesson} • {nextLesson.durationMinutes} min
            </span>
            <span className="text-xs text-white/80 font-medium">
              Lesson {nextLesson.number} of {lessons.length}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-black tracking-tight text-white">
              {nextLesson.title}
            </h3>
            <p className="text-xs text-white/85 line-clamp-1 mt-0.5">
              {nextLesson.subtitle}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => onStartLesson(nextLesson.id)}
              className="py-3 px-5 bg-white text-[#FF6B35] font-extrabold text-sm rounded-2xl shadow-md hover:bg-orange-50 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start 3-Min Lesson</span>
            </button>

            <button
              onClick={() => onStartQuiz(nextLesson.id)}
              className="py-3 px-4 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-2xl backdrop-blur-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Take Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Pathways Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-base text-[#1A1A1A] dark:text-white tracking-tight">
            Learning Pathways
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Bite-sized & visual</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Quick 2-min Quiz Card */}
          <button
            onClick={() => onStartQuiz(nextLesson.id)}
            className="p-4 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs hover:border-[#FF6B35] hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF6B35] flex items-center justify-center group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <div className="font-bold text-sm text-[#1A1A1A] dark:text-white">{t.quickQuiz}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">5 questions • 2 min</div>
            </div>
          </button>

          {/* Signs Reference Library Card */}
          <button
            onClick={onOpenSigns}
            className="p-4 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs hover:border-[#0EA5E9] hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-[#0EA5E9] flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <div className="font-bold text-sm text-[#1A1A1A] dark:text-white">Signs Library</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">28+ SVG Traffic Signs</div>
            </div>
          </button>

          {/* Official RTO Mock Test Card */}
          <button
            onClick={onOpenMockTest}
            className="p-4 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs hover:border-[#10B981] hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <div className="font-bold text-sm text-[#1A1A1A] dark:text-white">RTO Mock Test</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">STALL Exam Simulation</div>
            </div>
          </button>

          {/* Challan-Proof Module Card */}
          <button
            onClick={onOpenChallanModule}
            className="p-4 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <div className="font-bold text-sm text-[#1A1A1A] dark:text-white">Fine Avoidance</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Top 10 Indian Fines & Rights</div>
            </div>
          </button>
        </div>
      </div>

      {/* Complete Course Curriculum (All 15 Lessons) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-extrabold text-base text-[#1A1A1A] dark:text-white tracking-tight">
              Course Curriculum (15 Lessons)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Browse any topic at your own pace
            </p>
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            {profile.completedLessonIds.length} / 15 Done
          </span>
        </div>

        {/* Category Tabs for Curriculum */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { key: 'all', label: 'All (15)' },
            { key: 'signs', label: 'Signs (5)' },
            { key: 'rules', label: 'Road Rules (4)' },
            { key: 'challan', label: 'Challan-Proof (3)' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCurriculumTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                curriculumTab === tab.key
                  ? 'bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] shadow-xs'
                  : 'bg-white dark:bg-[#1C1F24] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lesson List */}
        <div className="space-y-2">
          {filteredCurriculum.map((lesson) => {
            const isCompleted = profile.completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => onStartLesson(lesson.id)}
                className="p-3.5 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs hover:border-[#FF6B35] dark:hover:border-[#FF6B35] transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981]'
                        : 'bg-orange-50 dark:bg-orange-950/40 text-[#FF6B35]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    ) : (
                      lesson.number
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-xs text-[#1A1A1A] dark:text-white group-hover:text-[#FF6B35] transition-colors truncate">
                      {lesson.title}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {lesson.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-gray-400 font-semibold">
                    {lesson.durationMinutes} min
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartLesson(lesson.id);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        : 'bg-orange-50 dark:bg-orange-950/40 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white'
                    }`}
                  >
                    {isCompleted ? 'Review' : 'Start'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RTO Official Verification Portal Banner */}
      <div className="p-4 bg-gradient-to-r from-gray-900 to-slate-800 dark:from-gray-950 dark:to-slate-900 rounded-3xl text-white flex items-center justify-between gap-3 shadow-md">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Government Verification Portal
          </div>
          <div className="text-xs text-gray-300">
            Verify official Sarthi Certificate ID for RTO licensing officers
          </div>
        </div>
        <button
          onClick={onOpenVerifyPortal}
          className="shrink-0 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          Verify ID
        </button>
      </div>

      {/* MODAL 1: RTO-Ready Breakdown Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C1F24] rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF6B35] flex items-center justify-center font-bold">
                  📊
                </div>
                <h3 className="font-extrabold text-lg text-[#1A1A1A] dark:text-white">
                  RTO-Ready Breakdown
                </h3>
              </div>
              <button
                onClick={() => setShowProgressModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2">
              <div className="text-4xl font-black text-[#FF6B35]">
                {rtoReadyPercent}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your probability of passing the RTO Learner Licence test on first attempt.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Lessons Completed
                </div>
                <div className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                  {completedLessonsCount} / {totalCoreLessons}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Quizzes Passed
                </div>
                <div className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                  {completedQuizzesCount} / 8
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Official Mock Tests
                </div>
                <div className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                  {mockTestsCount} / 3 taken
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowProgressModal(false);
                onOpenMockTest();
              }}
              className="w-full py-3.5 bg-[#FF6B35] hover:bg-[#E85D04] text-white font-bold text-sm rounded-2xl shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Take RTO Mock Test Now
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Streak 30-Day Calendar Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C1F24] rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                <h3 className="font-extrabold text-lg text-[#1A1A1A] dark:text-white">
                  {profile.streakDays}-Day Learning Streak
                </h3>
              </div>
              <button
                onClick={() => setShowStreakModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Consistency builds road competence. 3 minutes a day keeps your road instincts sharp.
            </p>

            {/* 30-Day Grid */}
            <div className="grid grid-cols-6 gap-2 py-2">
              {past30Days.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                    item.active
                      ? 'bg-gradient-to-b from-orange-400 to-amber-500 text-white font-bold shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 font-medium'
                  }`}
                >
                  <span className="text-[10px]">{item.month}</span>
                  <span className="text-xs font-bold">{item.date}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowStreakModal(false)}
              className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#1A1A1A] dark:text-white font-bold text-sm rounded-2xl transition-colors cursor-pointer"
            >
              Keep Going
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Challan Proof Savings Modal */}
      {showChallanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C1F24] rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#1B5E20] dark:text-emerald-400" />
                <h3 className="font-extrabold text-lg text-[#1A1A1A] dark:text-white">
                  Challan-Proof Guarantee
                </h3>
              </div>
              <button
                onClick={() => setShowChallanModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900 text-center">
              <div className="text-3xl font-black text-[#1B5E20] dark:text-emerald-400">₹5,000+</div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold mt-1">
                Estimated fines saved by knowing mandatory rules
              </p>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {t.challanSavingsCallout} Common violations like riding without helmet (₹1,000) or driving without PUCC (₹10,000) can be completely avoided with Sarthi.
            </p>

            <button
              onClick={() => {
                setShowChallanModal(false);
                onOpenChallanModule();
              }}
              className="w-full py-3.5 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold text-sm rounded-2xl shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Open Challan-Proof Module
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
