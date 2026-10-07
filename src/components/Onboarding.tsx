import React, { useState } from 'react';
import { LanguageCode, VehicleType, GoalType } from '../types';
import { LANGUAGES, TRANSLATIONS } from '../data/translations';
import { Bike, Car, Shield, CheckCircle2, ChevronRight, Globe, Award, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: {
    name: string;
    language: LanguageCode;
    vehicleType: VehicleType;
    goal: GoalType;
    selectedState: string;
  }) => void;
  initialLanguage?: LanguageCode;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  onComplete,
  initialLanguage = 'en',
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(initialLanguage);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('both');
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('both');
  const [userName, setUserName] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const handleQuickEnter = () => {
    onComplete({
      name: userName.trim() || 'Driver',
      language: selectedLanguage,
      vehicleType: 'both',
      goal: 'both',
      selectedState: 'Karnataka',
    });
  };

  const handleStartLearning = () => {
    setStep(2);
  };

  const handleVehicleSelect = (type: VehicleType) => {
    setSelectedVehicle(type);
    setStep(3);
  };

  const handleFinish = (goal: GoalType) => {
    setSelectedGoal(goal);
    onComplete({
      name: userName.trim() || 'Driver',
      language: selectedLanguage,
      vehicleType: selectedVehicle,
      goal: goal,
      selectedState: 'Karnataka',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] via-[#FFF3E0] to-[#E8F5E9] text-[#1A1A1A] flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Bar with Language Selector */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#E85D04] flex items-center justify-center text-white font-black text-sm shadow-md">
            सा
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#1A1A1A]">
            SARTHI
          </span>
        </div>

        {/* Language selector chip */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#1A1A1A] border border-[#FF6B35]/20 shadow-xs hover:border-[#FF6B35] transition-all cursor-pointer"
            aria-label="Select Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>
              {LANGUAGES.find((l) => l.code === selectedLanguage)?.nativeLabel}
            </span>
          </button>

          {showLanguageDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowLanguageDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 grid grid-cols-2 gap-1 animate-in fade-in zoom-in-95 duration-150">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setShowLanguageDropdown(false);
                    }}
                    className={`text-left px-2.5 py-2 rounded-xl text-xs font-medium transition-colors flex flex-col ${
                      selectedLanguage === lang.code
                        ? 'bg-[#FF6B35]/10 text-[#FF6B35] font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs font-semibold">{lang.nativeLabel}</span>
                    <span className="text-[10px] text-gray-500">{lang.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Flat Indian Road Vector Graphic */}
            <div className="relative w-64 h-48 mx-auto my-2">
              <svg viewBox="0 0 280 200" className="w-full h-full drop-shadow-sm">
                <defs>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFE0B2" />
                    <stop offset="100%" stopColor="#FFF8F0" />
                  </linearGradient>
                </defs>
                {/* Sun and Sky */}
                <rect x="0" y="0" width="280" height="200" rx="20" fill="url(#skyGrad)" />
                <circle cx="140" cy="80" r="36" fill="#FFA726" opacity="0.4" />
                <circle cx="140" cy="80" r="24" fill="#FFB74D" opacity="0.7" />

                {/* Road Perspective */}
                <polygon points="110,110 170,110 240,190 40,190" fill="#37474F" />
                <line x1="140" y1="115" x2="140" y2="130" stroke="#FFF" strokeWidth="3" strokeDasharray="6 4" />
                <line x1="140" y1="140" x2="140" y2="160" stroke="#FFF" strokeWidth="4" />
                <line x1="140" y1="170" x2="140" y2="190" stroke="#FFF" strokeWidth="5" />

                {/* Traffic Light on Left */}
                <rect x="52" y="55" width="14" height="38" rx="4" fill="#212121" />
                <circle cx="59" cy="62" r="3.5" fill="#EF5350" />
                <circle cx="59" cy="74" r="3.5" fill="#FFA726" />
                <circle cx="59" cy="86" r="3.5" fill="#66BB6A" />
                <line x1="59" y1="93" x2="59" y2="140" stroke="#424242" strokeWidth="3" />

                {/* Scooter on Left Lane */}
                <g transform="translate(75, 130)">
                  <circle cx="10" cy="22" r="6" fill="#263238" />
                  <circle cx="34" cy="22" r="6" fill="#263238" />
                  <path d="M10,20 L22,20 L28,14 L34,20" stroke="#FF6B35" strokeWidth="4" fill="none" strokeLinecap="round" />
                  {/* Rider with ISI Helmet */}
                  <circle cx="22" cy="4" r="5" fill="#FF6B35" />
                  <path d="M22,9 L22,17" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* Modern Car on Right Lane */}
                <g transform="translate(145, 126)">
                  <rect x="8" y="10" width="44" height="16" rx="4" fill="#1B5E20" />
                  <path d="M16,10 L24,2 L38,2 L44,10 Z" fill="#2E7D32" />
                  <circle cx="16" cy="26" r="5" fill="#212121" />
                  <circle cx="44" cy="26" r="5" fill="#212121" />
                  <circle cx="16" cy="26" r="2" fill="#ECEFF1" />
                  <circle cx="44" cy="26" r="2" fill="#ECEFF1" />
                </g>

                {/* Pedestrian Crossing symbol on right */}
                <g transform="translate(210, 80)">
                  <polygon points="18,0 36,30 0,30" fill="#FFF" stroke="#D32F2F" strokeWidth="3" />
                  <circle cx="18" cy="14" r="2" fill="#1A1A1A" />
                  <line x1="18" y1="16" x2="18" y2="24" stroke="#1A1A1A" strokeWidth="2" />
                </g>
              </svg>
            </div>

            {/* Headline and Emotional Promise */}
            <div className="space-y-2 px-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20">
                <Sparkles className="w-3 h-3" />
                {t.taglineHindi}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                {t.onboardingHeadline}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto leading-relaxed">
                {t.onboardingSubhead}
              </p>
            </div>

            {/* Fast Optional Name Input */}
            <div className="w-full px-2">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name (optional)"
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all shadow-xs"
              />
            </div>

            {/* Primary Action Button: Start Learning */}
            <div className="w-full space-y-3 px-2 pt-2">
              <button
                onClick={handleStartLearning}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#FF6B35] to-[#E85D04] hover:from-[#E85D04] hover:to-[#D9480F] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#FF6B35]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.startLearning}</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleQuickEnter}
                className="text-xs text-gray-500 font-medium hover:text-[#1A1A1A] transition-colors py-1 cursor-pointer"
              >
                {t.alreadyAccount}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: What are you learning for? */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 px-2">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
                Step 1 of 2
              </span>
              <h2 className="text-2xl font-extrabold text-[#1A1A1A]">
                {t.question1}
              </h2>
              <p className="text-xs text-gray-500">
                We'll tailor your signs, rules, and mock test questions.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleVehicleSelect('bike')}
                className="w-full p-4.5 bg-white rounded-2xl border-2 border-gray-100 hover:border-[#FF6B35] active:bg-[#FFF8F0] shadow-xs transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-orange-50 text-[#FF6B35] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Bike className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#1A1A1A] text-base">
                    {t.vehicleBike}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Motorcycles, Scooters, LMV Two-Wheelers
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#FF6B35] transition-colors" />
              </button>

              <button
                onClick={() => handleVehicleSelect('car')}
                className="w-full p-4.5 bg-white rounded-2xl border-2 border-gray-100 hover:border-[#FF6B35] active:bg-[#FFF8F0] shadow-xs transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-[#1B5E20] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Car className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#1A1A1A] text-base">
                    {t.vehicleCar}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Hatchbacks, Sedans, SUVs (LMV Four-Wheelers)
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#FF6B35] transition-colors" />
              </button>

              <button
                onClick={() => handleVehicleSelect('both')}
                className="w-full p-4.5 bg-white rounded-2xl border-2 border-gray-100 hover:border-[#FF6B35] active:bg-[#FFF8F0] shadow-xs transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-sky-50 text-[#0EA5E9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <div className="flex gap-1">
                    <Bike className="w-5 h-5" />
                    <Car className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#1A1A1A] text-base">
                    {t.vehicleBoth}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Complete Road Safety for all vehicle types
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#FF6B35] transition-colors" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: What is your goal? */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 px-2">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider">
                Step 2 of 2
              </span>
              <h2 className="text-2xl font-extrabold text-[#1A1A1A]">
                {t.question2}
              </h2>
              <p className="text-xs text-gray-500">
                Pick your focus. You will have full access to all features.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleFinish('learner_license')}
                className="w-full p-4.5 bg-white rounded-2xl border-2 border-gray-100 hover:border-[#1B5E20] active:bg-[#E8F5E9] shadow-xs transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-[#1B5E20] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Award className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#1A1A1A] text-base">
                    {t.goalLearner}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Pass official STALL test on first try & get Sarthi Certificate
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-gray-300 group-hover:text-[#1B5E20] transition-colors" />
              </button>

              <button
                onClick={() => handleFinish('challan_proof')}
                className="w-full p-4.5 bg-white rounded-2xl border-2 border-gray-100 hover:border-[#FF6B35] active:bg-[#FFF8F0] shadow-xs transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-orange-50 text-[#FF6B35] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Shield className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#1A1A1A] text-base">
                    {t.goalChallan}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Master common penalties, fines & your legal rights
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-gray-300 group-hover:text-[#FF6B35] transition-colors" />
              </button>

              <button
                onClick={() => handleFinish('both')}
                className="w-full p-4.5 bg-white rounded-2xl border-2 border-[#FF6B35]/30 hover:border-[#FF6B35] active:bg-[#FFF8F0] shadow-xs transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#1A1A1A] text-base">
                    {t.goalBoth}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Complete transformation into a confident, responsible citizen
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-amber-500 transition-colors" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust & Privacy Guarantee (Bedrock principle: zero tracking, zero ads) */}
      <div className="w-full max-w-md mx-auto text-center pt-2 pb-1">
        <p className="text-[11px] text-gray-500 font-medium flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#1B5E20]" />
          <span>100% Private • Offline Ready • No Ads • No Telemetry</span>
        </p>
      </div>
    </div>
  );
};
