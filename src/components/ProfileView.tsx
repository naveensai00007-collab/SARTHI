import React, { useState } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { LANGUAGES, INDIAN_STATES, TRANSLATIONS } from '../data/translations';
import {
  Share2,
  Lock,
  Globe,
  MapPin,
  Volume2,
  Moon,
  Sun,
  ExternalLink,
  Edit2,
  Download,
  Upload,
  RotateCcw,
  X,
  Check,
} from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onViewCertificate?: (certId: string) => void;
  onResetProgress?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onViewCertificate,
  onResetProgress,
}) => {
  const [showShareCard, setShowShareCard] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.en;

  const totalLessons = 15;
  const completedLessons = profile.completedLessonIds.length;
  const completedQuizzes = profile.completedQuizIds.length;
  const rtoPercentage = Math.min(
    100,
    Math.round((completedLessons / 12) * 50 + (completedQuizzes / 8) * 30 + (profile.mockTestsTaken > 0 ? 20 : 0))
  );

  const badges = [
    {
      id: 'first_lesson',
      title: 'First Step',
      desc: 'Completed your first road safety lesson',
      icon: '🚗',
      unlocked: completedLessons >= 1,
    },
    {
      id: 'streak_5',
      title: '5-Day Streak',
      desc: 'Practiced road rules 5 days in a row',
      icon: '🔥',
      unlocked: profile.streakDays >= 5,
    },
    {
      id: 'rto_ready',
      title: 'RTO-Ready',
      desc: 'Achieved 60%+ in official STALL mock test',
      icon: '🏆',
      unlocked: profile.bestMockScore >= 9,
    },
    {
      id: 'sign_master',
      title: 'Sign Master',
      desc: 'Mastered all regulatory & warning signs',
      icon: '🚦',
      unlocked: completedLessons >= 5,
    },
    {
      id: 'challan_proof',
      title: 'Challan-Proof',
      desc: 'Completed penalties & rights modules',
      icon: '🛡️',
      unlocked: profile.completedLessonIds.includes('lesson-13'),
    },
    {
      id: 'perfect_quiz',
      title: 'Flawless Driver',
      desc: 'Scored 100% on a quiz with 5-streak bonus',
      icon: '⚡',
      unlocked: profile.xp >= 200,
    },
  ];

  const handleShareProgress = () => {
    const text = `I'm ${rtoPercentage}% RTO-Ready with Sarthi — India's Road Safety & Licensing platform! Learn rules, avoid challans, drive without fear: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Sarthi Driving Readiness',
        text: text,
        url: window.location.origin,
      }).catch(() => {
        setShowShareCard(true);
      });
    } else {
      setShowShareCard(true);
    }
  };

  const handleSaveName = () => {
    const clean = nameInput.trim();
    if (clean) {
      onUpdateProfile({ name: clean });
    }
    setIsEditingName(false);
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sarthi_progress_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExportNotice('Progress backup saved to your downloads!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.completedLessonIds) {
          onUpdateProfile(parsed);
          setExportNotice('Progress successfully restored!');
          setTimeout(() => setExportNotice(null), 3000);
        } else {
          setExportNotice('Invalid backup file. Please select a valid Sarthi JSON backup.');
          setTimeout(() => setExportNotice(null), 3500);
        }
      } catch (err) {
        setExportNotice('Could not parse backup file.');
        setTimeout(() => setExportNotice(null), 3500);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getInitials = (name: string) => {
    const clean = name.trim();
    if (!clean) return 'D';
    return clean.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-24 space-y-5 select-none">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-[#1C1F24] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
        {/* User Avatar Circle */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#E85D04] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
          {getInitials(profile.name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-1.5 w-full">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-[#1A1A1A] dark:text-white flex-1 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black text-[#1A1A1A] dark:text-white truncate">
                  {profile.name}
                </h2>
                <button
                  onClick={() => {
                    setNameInput(profile.name);
                    setIsEditingName(true);
                  }}
                  className="p-1 text-gray-400 hover:text-[#FF6B35] transition-colors cursor-pointer"
                  title="Edit Name"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 uppercase shrink-0">
                  Good Civilian
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>{profile.selectedState} RTO • {profile.vehicleType.toUpperCase()} LMV</span>
          </p>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300 text-center animate-in fade-in">
          {exportNotice}
        </div>
      )}

      {/* Driver Performance Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs text-center">
          <div className="text-xl font-black text-[#FF6B35]">{completedLessons}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Lessons</div>
        </div>

        <div className="p-3.5 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs text-center">
          <div className="text-xl font-black text-[#10B981]">{profile.streakDays} Days</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Streak</div>
        </div>

        <div className="p-3.5 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs text-center">
          <div className="text-xl font-black text-[#0EA5E9]">{profile.xp}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">XP Earned</div>
        </div>
      </div>

      {/* Share Progress Button */}
      <button
        onClick={handleShareProgress}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF6B35] to-[#E85D04] hover:from-[#E85D04] hover:to-[#D9480F] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        <span>Share My RTO-Ready Status ({rtoPercentage}%)</span>
      </button>

      {/* Badges Grid (Status Meter) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm text-[#1A1A1A] dark:text-white">
            Competence Badges
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
            {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-2xl border transition-all text-left flex items-start gap-3 ${
                badge.unlocked
                  ? 'bg-white dark:bg-[#1C1F24] border-emerald-200 dark:border-emerald-900 shadow-2xs'
                  : 'bg-gray-50 dark:bg-gray-900/40 border-gray-200/80 dark:border-gray-800 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  badge.unlocked ? 'bg-emerald-50 dark:bg-emerald-950/50' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {badge.unlocked ? badge.icon : <Lock className="w-4 h-4 text-gray-400" />}
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-xs text-[#1A1A1A] dark:text-white truncate">
                  {badge.title}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5 leading-snug">
                  {badge.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates Vault */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm text-[#1A1A1A] dark:text-white">
            Official Certificates ({profile.certificates.length})
          </h3>
        </div>

        <div className="space-y-2">
          {profile.certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => onViewCertificate && onViewCertificate(cert.id)}
              className="p-4 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex items-center justify-between gap-3 shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                  🏆
                </div>
                <div>
                  <div className="font-extrabold text-xs text-[#1A1A1A] dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    Sarthi RTO Qualification Certificate
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                    ID: {cert.id} • {cert.issuedAt}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                  {cert.score}/{cert.totalQuestions} ({cert.percentage}%)
                </span>
                <span className="text-[10px] text-gray-400 font-semibold flex items-center justify-end gap-0.5">
                  View <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings & State Jurisdiction Configuration */}
      <div className="bg-white dark:bg-[#1C1F24] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-[#1A1A1A] dark:text-white">
          Settings & Jurisdiction
        </h3>

        {/* State Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center justify-between">
            <span>RTO State Jurisdiction</span>
            <span className="text-[10px] text-[#FF6B35]">
              Adjusts official passing score
            </span>
          </label>
          <select
            value={profile.selectedState}
            onChange={(e) => onUpdateProfile({ selectedState: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35] cursor-pointer"
          >
            {INDIAN_STATES.map((state) => (
              <option key={state.stateCode} value={state.name} className="dark:bg-[#1C1F24]">
                {state.name} (Passing: {state.passingScore}/15)
              </option>
            ))}
          </select>
        </div>

        {/* Language Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center justify-between">
            <span>App Language (12 Indian Languages)</span>
            <Globe className="w-3.5 h-3.5 text-gray-400" />
          </label>
          <select
            value={profile.language}
            onChange={(e) =>
              onUpdateProfile({ language: e.target.value as LanguageCode })
            }
            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35] cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="dark:bg-[#1C1F24]">
                {lang.nativeLabel} ({lang.label})
              </option>
            ))}
          </select>
        </div>

        {/* Audio Narration Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span>Voice Narration</span>
            </div>
            <div className="text-[10px] text-gray-400">
              Web Speech reads lesson and sign text aloud
            </div>
          </div>
          <button
            onClick={() =>
              onUpdateProfile({ audioNarration: !profile.audioNarration })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              profile.audioNarration ? 'bg-[#FF6B35]' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                profile.audioNarration ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
              {profile.darkMode ? (
                <Moon className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>Warm Dark Mode</span>
            </div>
            <div className="text-[10px] text-gray-400">
              Comfortable night reading palette
            </div>
          </div>
          <button
            onClick={() => onUpdateProfile({ darkMode: !profile.darkMode })}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              profile.darkMode ? 'bg-amber-600' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                profile.darkMode ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Data Backup & Restore */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <div className="text-xs font-bold text-[#1A1A1A] dark:text-white">
            Data Portability (100% Offline / Local-first)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportBackup}
              className="py-2.5 px-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup</span>
            </button>

            <label className="py-2.5 px-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset Progress */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 text-center text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors pt-1 cursor-pointer"
          >
            Reset All Progress & Restart
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C1F24] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#1A1A1A] dark:text-white">
              Reset All Progress?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This will clear completed lessons, quizzes, and earned certificates, returning to initial onboarding.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-3 bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  if (onResetProgress) onResetProgress();
                }}
                className="py-3 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 cursor-pointer"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Progress Card Modal */}
      {showShareCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C1F24] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="p-6 bg-gradient-to-br from-[#FF6B35] to-[#1B5E20] rounded-2xl text-white space-y-3 shadow-md">
              <div className="text-xs uppercase font-extrabold tracking-widest text-amber-200">
                SARTHI DRIVER CERTIFICATION
              </div>
              <div className="text-3xl font-black">
                {profile.name} is {rtoPercentage}% RTO-Ready
              </div>
              <p className="text-xs text-white/90">
                "I learned road rules in 3 minutes a day and now drive without fear or fines."
              </p>
              <div className="text-[10px] font-mono bg-white/20 py-1 rounded">
                sarthi.app • {profile.selectedState} RTO
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Copy this status to share on WhatsApp or Instagram!
            </p>

            <button
              onClick={() => setShowShareCard(false)}
              className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-xs font-bold text-gray-800 dark:text-white rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
