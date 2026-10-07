import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  LanguageCode,
  VehicleType,
  GoalType,
  Certificate,
} from './types';
import {
  loadUserProfile,
  saveUserProfile,
  DEFAULT_PROFILE,
} from './utils/storage';
import { LESSONS } from './data/lessons';
import { ALL_QUIZ_QUESTIONS } from './data/quizzes';
import { TRAFFIC_SIGNS } from './data/signs';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Onboarding } from './components/Onboarding';
import { HomeDashboard } from './components/HomeDashboard';
import { QuizHub } from './components/QuizHub';
import { LessonView } from './components/LessonView';
import { QuizView } from './components/QuizView';
import { SignsLibrary } from './components/SignsLibrary';
import { MockTestView } from './components/MockTestView';
import { CertificateCard } from './components/CertificateCard';
import { RTOVerificationPortal } from './components/RTOVerificationPortal';
import { ChallanProofModule } from './components/ChallanProofModule';
import { ProfileView } from './components/ProfileView';
import { WifiOff } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeView, setActiveView] = useState<string>('home');
  const [activeLessonId, setActiveLessonId] = useState<string>('lesson-1');
  const [quizReturnView, setQuizReturnView] = useState<string>('quiz_hub');
  const [customQuizQuestions, setCustomQuizQuestions] = useState<any[] | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [verifyInitialId, setVerifyInitialId] = useState<string>('');
  const [isOffline, setIsOffline] = useState(false);

  // Initialize and check for URL parameters (e.g. ?verify=SAR-2026-K9P4X2)
  useEffect(() => {
    const loaded = loadUserProfile();
    setProfile(loaded);
    setIsLoaded(true);

    // Apply dark mode if user preferred
    if (loaded.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Check for URL query params
    const params = new URLSearchParams(window.location.search);
    const verifyParam = params.get('verify');
    if (verifyParam) {
      setVerifyInitialId(verifyParam);
      setActiveView('verify');
    }

    // Offline event listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update profile helper
  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      saveUserProfile(next);
      if (updates.darkMode !== undefined) {
        if (updates.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return next;
    });
  };

  // Onboarding completion
  const handleOnboardingComplete = (data: {
    name: string;
    language: LanguageCode;
    vehicleType: VehicleType;
    goal: GoalType;
    selectedState: string;
  }) => {
    handleUpdateProfile({
      ...data,
      isOnboarded: true,
      lastActiveDate: new Date().toISOString().split('T')[0],
    });
    setActiveView('home');
  };

  // Lesson actions
  const handleStartLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (!profile.completedLessonIds.includes(lessonId)) {
      const updatedCompleted = [...profile.completedLessonIds, lessonId];
      handleUpdateProfile({
        completedLessonIds: updatedCompleted,
        xp: profile.xp + 50,
      });
    }
    // Launch quiz for this lesson and return to lesson on back
    handleStartQuiz(lessonId, 'lesson');
  };

  // Quiz actions
  const handleStartQuiz = (lessonId: string, returnView: string = 'quiz_hub') => {
    setActiveLessonId(lessonId);
    setCustomQuizQuestions(null);
    setQuizReturnView(returnView);
    setActiveView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartRandomQuiz = () => {
    const shuffled = [...ALL_QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
    setCustomQuizQuestions(shuffled);
    setActiveLessonId('random-sprint');
    setQuizReturnView('quiz_hub');
    setActiveView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    try {
      localStorage.removeItem('sarthi_user_profile_v1');
    } catch {
      // ignore
    }
    const fresh: UserProfile = {
      ...DEFAULT_PROFILE,
      name: 'Learner Driver',
      isOnboarded: false,
      completedLessonIds: [],
      completedQuizIds: [],
      mockTestsTaken: 0,
      bestMockScore: 0,
      certificates: [],
      streakDays: 1,
      xp: 0,
      lives: 5,
    };
    saveUserProfile(fresh);
    setProfile(fresh);
    setActiveView('home');
  };

  const handleCompleteQuiz = (score: number, total: number, earnedXp: number) => {
    const passed = score >= Math.ceil(total * 0.6);
    let updatedQuizzes = [...profile.completedQuizIds];
    if (passed && !updatedQuizzes.includes(activeLessonId)) {
      updatedQuizzes.push(activeLessonId);
    }
    handleUpdateProfile({
      completedQuizIds: updatedQuizzes,
      xp: profile.xp + earnedXp,
      lives: Math.max(1, profile.lives - (total - score)),
    });
  };

  // Mock test completion
  const handleCompleteMockTest = (
    cert: Certificate | null,
    score: number,
    total: number
  ) => {
    const nextTaken = profile.mockTestsTaken + 1;
    const nextBest = Math.max(profile.bestMockScore, score);
    const updatedCerts = cert
      ? [cert, ...profile.certificates.filter((c) => c.id !== cert.id)]
      : profile.certificates;

    handleUpdateProfile({
      mockTestsTaken: nextTaken,
      bestMockScore: nextBest,
      certificates: updatedCerts,
      xp: profile.xp + score * 15,
    });
  };

  // View a specific certificate
  const handleViewCertificate = (cert: Certificate) => {
    setActiveCertificate(cert);
    setActiveView('certificate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCertificateById = (certId: string) => {
    const match = profile.certificates.find((c) => c.id === certId);
    if (match) {
      handleViewCertificate(match);
    } else {
      setVerifyInitialId(certId);
      setActiveView('verify');
    }
  };

  // Get current active lesson
  const currentLesson =
    LESSONS.find((l) => l.id === activeLessonId) || LESSONS[0];

  // Get questions for active quiz
  const currentQuizQuestions = ALL_QUIZ_QUESTIONS.filter(
    (q) => q.lessonId === activeLessonId
  );
  const quizQuestionsToUse =
    currentQuizQuestions.length > 0
      ? currentQuizQuestions
      : ALL_QUIZ_QUESTIONS.slice(0, 5);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FF6B35] animate-spin flex items-center justify-center text-white font-black">
          सा
        </div>
      </div>
    );
  }

  // Show onboarding if not completed yet
  if (!profile.isOnboarded) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        initialLanguage={profile.language}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] dark:bg-[#121417] text-[#1A1A1A] dark:text-[#F3F4F6] antialiased selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
      {/* Offline Status Badge */}
      {isOffline && (
        <div className="bg-amber-600 text-white text-[11px] font-bold py-1 px-4 text-center flex items-center justify-center gap-1.5 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode Active • All lessons, signs & quizzes work locally</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        profile={profile}
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onUpdateLanguage={(lang) => handleUpdateProfile({ language: lang })}
        onToggleDarkMode={() =>
          handleUpdateProfile({ darkMode: !profile.darkMode })
        }
      />

      {/* Main Screen Views */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        {activeView === 'home' && (
          <HomeDashboard
            profile={profile}
            lessons={LESSONS}
            onStartLesson={handleStartLesson}
            onStartQuiz={(lessonId) => handleStartQuiz(lessonId, 'home')}
            onOpenMockTest={() => {
              setActiveView('mock_test');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenChallanModule={() => {
              setActiveView('challan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSigns={() => {
              setActiveView('signs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenVerifyPortal={() => {
              setVerifyInitialId('');
              setActiveView('verify');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'quiz_hub' && (
          <QuizHub
            profile={profile}
            lessons={LESSONS}
            onStartLessonQuiz={(lessonId) => handleStartQuiz(lessonId, 'quiz_hub')}
            onStartRandomQuiz={handleStartRandomQuiz}
            onOpenMockTest={() => {
              setActiveView('mock_test');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'lesson' && (
          <LessonView
            lesson={currentLesson}
            userLanguage={profile.language}
            onBack={() => setActiveView('home')}
            onCompleteLesson={handleCompleteLesson}
            onLaunchQuiz={(lessonId) => handleStartQuiz(lessonId, 'lesson')}
          />
        )}

        {activeView === 'quiz' && (
          <QuizView
            questions={customQuizQuestions || quizQuestionsToUse}
            userLanguage={profile.language}
            initialLives={profile.lives}
            onCompleteQuiz={handleCompleteQuiz}
            onBack={() => setActiveView(quizReturnView)}
            onReviewLesson={
              activeLessonId.startsWith('lesson-')
                ? () => handleStartLesson(activeLessonId)
                : undefined
            }
          />
        )}

        {activeView === 'signs' && (
          <SignsLibrary
            signs={TRAFFIC_SIGNS}
            userLanguage={profile.language}
            onBack={() => setActiveView('home')}
          />
        )}

        {activeView === 'mock_test' && (
          <MockTestView
            profile={profile}
            allQuestions={ALL_QUIZ_QUESTIONS}
            onCompleteTest={handleCompleteMockTest}
            onBack={() => setActiveView('home')}
            onViewCertificate={handleViewCertificate}
          />
        )}

        {activeView === 'certificate' && activeCertificate && (
          <CertificateCard
            certificate={activeCertificate}
            onBack={() => setActiveView('profile')}
            onVerifyInPortal={(id) => {
              setVerifyInitialId(id);
              setActiveView('verify');
            }}
          />
        )}

        {activeView === 'verify' && (
          <RTOVerificationPortal
            initialCertId={verifyInitialId}
            onBack={() => setActiveView('home')}
          />
        )}

        {activeView === 'challan' && (
          <ChallanProofModule
            profile={profile}
            onOpenLesson={handleStartLesson}
            onBack={() => setActiveView('home')}
          />
        )}

        {activeView === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onViewCertificate={handleViewCertificateById}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Touch-Optimized Bottom Navigation */}
      <BottomNav
        activeTab={
          ['home', 'quiz_hub', 'quiz', 'signs', 'challan', 'profile'].includes(activeView)
            ? (activeView === 'quiz' ? 'quiz_hub' : activeView)
            : 'home'
        }
        onTabChange={(tab) => {
          setActiveView(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={profile.language}
      />
    </div>
  );
}
