import React from 'react';
import { BookOpen, HelpCircle, Compass, Shield, User } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { LanguageCode } from '../types';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: LanguageCode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const items = [
    { key: 'home', label: t.navLearn, icon: BookOpen },
    { key: 'quiz_hub', label: t.navQuiz, icon: HelpCircle },
    { key: 'signs', label: t.navSigns, icon: Compass },
    { key: 'challan', label: t.navChallan, icon: Shield },
    { key: 'profile', label: t.navProfile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#181B20]/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 select-none pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.key ||
            (item.key === 'quiz_hub' && (activeTab === 'quiz' || activeTab === 'quiz_hub'));

          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
                isActive ? 'text-[#FF6B35]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {isActive && (
                <div className="absolute -top-1 w-8 h-1 bg-[#FF6B35] rounded-full" />
              )}
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                }`}
              />
              <span
                className={`text-[10px] tracking-tight leading-none ${
                  isActive ? 'font-black text-[#FF6B35]' : 'font-semibold'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
