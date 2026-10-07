import React, { useState } from 'react';
import { ChallanOffence, UserProfile } from '../types';
import { COMMON_CHALLANS } from '../data/challans';
import {
  Shield,
  AlertTriangle,
  FileText,
  Calculator,
  ChevronRight,
  CheckCircle2,
  X,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';

interface ChallanProofModuleProps {
  profile: UserProfile;
  onOpenLesson: (lessonId: string) => void;
  onBack?: () => void;
}

export const ChallanProofModule: React.FC<ChallanProofModuleProps> = ({
  profile,
  onOpenLesson,
  onBack,
}) => {
  const [selectedOffence, setSelectedOffence] = useState<ChallanOffence | null>(null);
  const [activeTab, setActiveTab] = useState<'offences' | 'calculator' | 'rights'>('offences');

  // Fine Calculator state: checked offences
  const [checkedOffences, setCheckedOffences] = useState<Record<string, boolean>>({
    'ch-pucc': true,
    'ch-helmet': true,
    'ch-licence': false,
    'ch-insurance': true,
    'ch-red-light': false,
  });

  // Calculate potential fine sum
  const totalFineExposure = COMMON_CHALLANS.reduce((sum, off) => {
    return checkedOffences[off.id] ? sum + off.fineAmount : sum;
  }, 0);

  const toggleCalculatorOffence = (id: string) => {
    setCheckedOffences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Completion calculation
  const challanLessons = ['lesson-13', 'lesson-14', 'lesson-15'];
  const completedCount = challanLessons.filter((id) =>
    profile.completedLessonIds.includes(id)
  ).length;
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / 3) * 60 + (profile.completedLessonIds.length / 12) * 40)
  );

  return (
    <div className="max-w-lg mx-auto p-4 pb-24 space-y-5 select-none">
      {/* Header with Progress Ring / Shield */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-emerald-200">
              <Shield className="w-3.5 h-3.5" />
              Challan-Proof Mastery
            </span>
            <span className="text-xs font-bold text-emerald-200">
              {progressPercent}% Complete
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Drive Without Fear or Fines
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed mt-1">
              Indian drivers pay over ₹20,000 Crore annually in preventable fines. Learn the rules, safeguard your wallet, and uphold your rights.
            </p>
          </div>

          {/* Quick Module Lessons Shortcuts */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => onOpenLesson('lesson-13')}
              className="py-2.5 px-3.5 bg-white text-emerald-950 font-extrabold text-xs rounded-xl shadow-md hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Common Traps (Lesson 13)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenLesson('lesson-14')}
              className="py-2.5 px-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl backdrop-blur-xs transition-colors cursor-pointer"
            >
              <span>Police Rights (14)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white dark:bg-[#1C1F24] rounded-2xl p-1 border border-gray-200 dark:border-gray-800 shadow-2xs">
        <button
          onClick={() => setActiveTab('offences')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'offences'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Fines Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Fine Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('rights')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'rights'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Traffic Rights</span>
        </button>
      </div>

      {/* TAB 1: Offences Directory */}
      {activeTab === 'offences' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              Common Offences (Motor Vehicles Act)
            </span>
            <span className="text-xs font-bold text-[#1B5E20] dark:text-emerald-400">
              {COMMON_CHALLANS.length} Offences
            </span>
          </div>

          <div className="space-y-2.5">
            {COMMON_CHALLANS.map((offence) => (
              <div
                key={offence.id}
                onClick={() => setSelectedOffence(offence)}
                className="p-4 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs hover:border-[#FF6B35] dark:hover:border-[#FF6B35] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-[#1A1A1A] dark:text-white group-hover:text-[#FF6B35] transition-colors">
                      {offence.offence}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                    <span>{offence.sectionMVA}</span>
                    {offence.courtChallan && (
                      <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                        Court Challan
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-rose-600 dark:text-rose-400">
                    ₹{offence.fineAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-gray-400 font-semibold flex items-center justify-end gap-0.5 mt-0.5">
                    Avoid <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Fine Calculator */}
      {activeTab === 'calculator' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Summary Box */}
          <div className="p-5 bg-gradient-to-r from-rose-500 to-amber-600 rounded-3xl text-white shadow-md text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-100">
              Potential Legal Financial Risk
            </span>
            <div className="text-3xl font-black">
              ₹{totalFineExposure.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-rose-100">
              Sarthi helps you eliminate 100% of these fines by knowing the rules in advance.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1C1F24] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-[#1A1A1A] dark:text-white">
              Select common violations to test potential liability:
            </h3>

            <div className="space-y-2">
              {COMMON_CHALLANS.map((off) => {
                const isChecked = !!checkedOffences[off.id];

                return (
                  <button
                    key={off.id}
                    onClick={() => toggleCalculatorOffence(off.id)}
                    className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between text-left cursor-pointer ${
                      isChecked
                        ? 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-200'
                        : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs font-bold ${
                          isChecked
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                      <span className="text-xs font-bold leading-tight">
                        {off.offence}
                      </span>
                    </div>
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400 shrink-0 ml-2">
                      ₹{off.fineAmount.toLocaleString('en-IN')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Traffic Stop Rights Guide */}
      {activeTab === 'rights' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="p-4 bg-white dark:bg-[#1C1F24] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#1B5E20] dark:text-emerald-400">
              <Scale className="w-5 h-5" />
              <h3 className="font-extrabold text-sm text-[#1A1A1A] dark:text-white">
                Your Statutory Rights During Traffic Stops
              </h3>
            </div>

            <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border-l-4 border-[#1B5E20]">
                <span className="font-extrabold text-gray-900 dark:text-white block mb-0.5">
                  1. Officer Rank Mandate (Sub-Inspector & Above)
                </span>
                Only an officer of Sub-Inspector (SI) rank or above wearing official stars and nameplate can legally issue a compounding traffic challan. Constables cannot demand spot fines.
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border-l-4 border-[#FF6B35]">
                <span className="font-extrabold text-gray-900 dark:text-white block mb-0.5">
                  2. Ignition Key Snatching is Strictly Barred
                </span>
                Supreme Court and Police circulars prohibit police officers from pulling vehicle keys out of running ignitions or physically detaining drivers without legal grounds.
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border-l-4 border-emerald-600">
                <span className="font-extrabold text-gray-900 dark:text-white block mb-0.5">
                  3. DigiLocker Digital Certificates are Legally Binding
                </span>
                Per MoRTH notification, digital DL and RC on DigiLocker or mParivahan are 100% equivalent to original physical laminated cards. Police cannot impound your phone.
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border-l-4 border-amber-500">
                <span className="font-extrabold text-gray-900 dark:text-white block mb-0.5">
                  4. E-Challan Receipt Requirement
                </span>
                Always demand an official electronic e-challan or printed government receipt. Never give cash without an authentic printed receipt.
              </div>
            </div>

            <button
              onClick={() => onOpenLesson('lesson-14')}
              className="w-full py-3 bg-[#1B5E20] hover:bg-[#144718] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Complete Full 3-Min Lesson on Police Rights
            </button>
          </div>
        </div>
      )}

      {/* Offence Detail Modal */}
      {selectedOffence && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C1F24] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900">
                {selectedOffence.sectionMVA}
              </span>
              <button
                onClick={() => setSelectedOffence(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-left space-y-1">
              <h3 className="text-base font-extrabold text-[#1A1A1A] dark:text-white">
                {selectedOffence.offence}
              </h3>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 pt-1">
                Fine: ₹{selectedOffence.fineAmount.toLocaleString('en-IN')}
                {selectedOffence.repeatFine && (
                  <span className="text-xs text-gray-400 font-semibold block">
                    Repeat Offence: ₹{selectedOffence.repeatFine.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-left">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl">
                <span className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block text-[10px]">
                  Why this is hazardous
                </span>
                <p className="text-gray-800 dark:text-gray-200 mt-0.5 leading-relaxed">
                  {selectedOffence.whyRisky}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
                <span className="font-bold text-[#1B5E20] dark:text-emerald-400 uppercase tracking-wider block text-[10px]">
                  How to avoid forever
                </span>
                <p className="text-emerald-950 dark:text-emerald-200 font-medium mt-0.5 leading-relaxed">
                  {selectedOffence.howToAvoid}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedOffence(null);
                onOpenLesson('lesson-13');
              }}
              className="w-full py-3.5 bg-[#FF6B35] hover:bg-[#E85D04] text-white font-bold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              Open Lesson on Avoiding Traps
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
