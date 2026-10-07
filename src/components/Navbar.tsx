import React, { useState } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { LANGUAGES } from '../data/translations';
import { Globe, Moon, Sun, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile;
  activeView: string;
  onNavigate: (view: string) => void;
  onUpdateLanguage: (lang: LanguageCode) => void;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeView,
  onNavigate,
  onUpdateLanguage,
  onToggleDarkMode,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === profile.language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#181B20]/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 select-none">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#E85D04] text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            सा
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#1A1A1A] dark:text-white block leading-none">
              SARTHI
            </span>
            <span className="text-[9px] text-gray-400 font-semibold tracking-wide uppercase">
              National Road Safety
            </span>
          </div>
        </button>

        {/* Right Action Icons: Language, RTO Verify, Dark Mode */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={profile.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {profile.darkMode ? (
              <Sun className="w-4 h-4 fill-amber-400 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Government RTO Portal Quick Link */}
          <button
            onClick={() => onNavigate('verify')}
            className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeView === 'verify'
                ? 'bg-gray-900 text-emerald-400 dark:bg-emerald-950 dark:border dark:border-emerald-600 shadow-2xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-900'
            }`}
            title="Official RTO Certificate Verification Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xs:inline">RTO Verify</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-xs font-semibold transition-colors cursor-pointer"
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span className="text-[11px]">{currentLang.nativeLabel}</span>
            </button>

            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1E2228] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 z-50 grid grid-cols-2 gap-1 animate-in fade-in zoom-in-95 duration-150">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onUpdateLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`text-left px-2.5 py-2 rounded-xl text-xs font-medium transition-colors flex flex-col cursor-pointer ${
                        profile.language === lang.code
                          ? 'bg-[#FF6B35]/10 text-[#FF6B35] font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-xs font-semibold">{lang.nativeLabel}</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

