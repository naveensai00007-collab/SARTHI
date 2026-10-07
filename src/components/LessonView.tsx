import React, { useState, useEffect } from 'react';
import { Lesson, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { TrafficSignSvg } from './TrafficSignSvg';
import { speakText, stopSpeech } from '../utils/speech';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
  userLanguage: LanguageCode;
  onBack: () => void;
  onCompleteLesson: (lessonId: string) => void;
  onLaunchQuiz: (lessonId: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  userLanguage,
  onBack,
  onCompleteLesson,
  onLaunchQuiz,
}) => {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const t = TRANSLATIONS[userLanguage] || TRANSLATIONS.en;

  const currentSection = lesson.sections[sectionIndex];
  const totalSections = lesson.sections.length;
  const isLastSection = sectionIndex === totalSections - 1;

  useEffect(() => {
    // Stop any existing speech when switching sections or unmounting
    return () => {
      stopSpeech();
    };
  }, [sectionIndex, lesson.id]);

  const handleToggleAudio = () => {
    if (isAudioActive) {
      stopSpeech();
      setIsAudioActive(false);
    } else {
      const textToRead = `${currentSection.title}. ${currentSection.ruleText}. What it means: ${currentSection.whatItMeans}. Why it matters: ${currentSection.whyItMatters}. ${currentSection.challanNote ? currentSection.challanNote : ''}`;
      setIsAudioActive(true);
      speakText(textToRead, userLanguage, () => {
        setIsAudioActive(false);
      });
    }
  };

  const handleNextSection = () => {
    stopSpeech();
    setIsAudioActive(false);
    if (!isLastSection) {
      setSectionIndex((prev) => prev + 1);
    } else {
      onCompleteLesson(lesson.id);
    }
  };

  const handlePrevSection = () => {
    stopSpeech();
    setIsAudioActive(false);
    if (sectionIndex > 0) {
      setSectionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-[85vh] flex flex-col justify-between p-4 pb-20 select-none">
      {/* Top Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white dark:bg-[#1C1F24] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white hover:border-gray-300 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-wider">
              Lesson {lesson.number} • {lesson.durationMinutes} min
            </span>
            <h2 className="text-sm font-extrabold text-[#1A1A1A] dark:text-white line-clamp-1">
              {lesson.title}
            </h2>
          </div>

          {/* Audio narration toggle button */}
          <button
            onClick={handleToggleAudio}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isAudioActive
                ? 'bg-[#FF6B35] border-[#FF6B35] text-white animate-pulse'
                : 'bg-white dark:bg-[#1C1F24] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#FF6B35] hover:text-[#FF6B35]'
            }`}
            title="Listen to audio narration"
            aria-label="Audio Narration"
          >
            {isAudioActive ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#FF6B35] to-[#10B981] h-full transition-all duration-300 rounded-full"
            style={{ width: `${((sectionIndex + 1) / totalSections) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Visual & Concept Card */}
      <div className="my-auto py-4 space-y-4">
        <div className="bg-white dark:bg-[#1C1F24] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-md text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          {/* Section Indicator */}
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-orange-50 dark:bg-orange-950/40 text-[#FF6B35] border border-orange-100 dark:border-orange-900/50">
            Concept {sectionIndex + 1} of {totalSections}
          </span>

          {/* Large High-Fidelity Vector Graphic */}
          <div className="flex justify-center items-center py-2">
            {currentSection.signId ? (
              <TrafficSignSvg svgKey={currentSection.signId} size={130} />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FF6B35] flex items-center justify-center font-bold text-4xl shadow-inner">
                🚦
              </div>
            )}
          </div>

          {/* Concept Headline */}
          <h3 className="text-xl font-black text-[#1A1A1A] dark:text-white tracking-tight">
            {currentSection.title}
          </h3>

          {/* Rule Statement Callout */}
          <div className="p-3.5 bg-orange-50/70 dark:bg-orange-950/30 border-l-4 border-[#FF6B35] rounded-r-2xl text-left">
            <span className="text-[11px] font-extrabold text-[#FF6B35] uppercase tracking-wider block">
              Core Rule
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A] dark:text-gray-100 mt-0.5 leading-snug">
              {currentSection.ruleText}
            </p>
          </div>

          {/* What it means */}
          <div className="text-left space-y-1">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              What it means
            </span>
            <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              {currentSection.whatItMeans}
            </p>
          </div>

          {/* Why it matters */}
          <div className="text-left space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Why it matters
            </span>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
              {currentSection.whyItMatters}
            </p>
          </div>

          {/* Challan Savings Note (Threat Scanner & Resource Calculator Module) */}
          {currentSection.challanNote && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-800/80 flex items-start gap-2.5 text-left">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200 leading-normal">
                <span className="font-bold">Challan Alert: </span>
                {currentSection.challanNote}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation & Action Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {sectionIndex > 0 && (
            <button
              onClick={handlePrevSection}
              className="py-3.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#1A1A1A] dark:text-white font-bold text-xs rounded-2xl transition-colors flex items-center justify-center cursor-pointer"
              title="Previous Concept"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleNextSection}
            className={`flex-1 py-4 px-6 font-extrabold text-sm rounded-2xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isLastSection
                ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-emerald-500/25'
                : 'bg-gradient-to-r from-[#FF6B35] to-[#E85D04] text-white shadow-orange-500/25'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isLastSection ? 'Complete Lesson' : t.iUnderstand}</span>
            {!isLastSection && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Quiz Shortcut */}
        <div className="text-center">
          <button
            onClick={() => onLaunchQuiz(lesson.id)}
            className="text-xs text-gray-500 hover:text-[#FF6B35] font-semibold transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Skip ahead to 5-Question Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};
