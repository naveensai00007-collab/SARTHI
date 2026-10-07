import React, { useState } from 'react';
import { TrafficSign, LanguageCode } from '../types';
import { TrafficSignSvg } from './TrafficSignSvg';
import { speakText, stopSpeech } from '../utils/speech';
import {
  Search,
  Volume2,
  X,
  ShieldAlert,
  ChevronLeft,
} from 'lucide-react';

interface SignsLibraryProps {
  signs: TrafficSign[];
  userLanguage: LanguageCode;
  onBack?: () => void;
}

type CategoryTab =
  | 'all'
  | 'mandatory'
  | 'cautionary'
  | 'informatory'
  | 'road_marking'
  | 'traffic_light';

export const SignsLibrary: React.FC<SignsLibraryProps> = ({
  signs,
  userLanguage,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSign, setSelectedSign] = useState<TrafficSign | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const tabs: { key: CategoryTab; label: string; count: number }[] = [
    { key: 'all', label: 'All Signs', count: signs.length },
    {
      key: 'mandatory',
      label: 'Mandatory',
      count: signs.filter((s) => s.category === 'mandatory').length,
    },
    {
      key: 'cautionary',
      label: 'Cautionary',
      count: signs.filter((s) => s.category === 'cautionary').length,
    },
    {
      key: 'informatory',
      label: 'Informatory',
      count: signs.filter((s) => s.category === 'informatory').length,
    },
    {
      key: 'road_marking',
      label: 'Markings',
      count: signs.filter((s) => s.category === 'road_marking').length,
    },
    {
      key: 'traffic_light',
      label: 'Signals',
      count: signs.filter((s) => s.category === 'traffic_light').length,
    },
  ];

  const filteredSigns = signs.filter((sign) => {
    const matchesTab = activeTab === 'all' || sign.category === activeTab;
    const matchesSearch =
      searchQuery.trim() === '' ||
      sign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenSign = (sign: TrafficSign) => {
    setSelectedSign(sign);
    setIsPlayingAudio(false);
  };

  const handleCloseModal = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    setSelectedSign(null);
  };

  const handlePlaySignAudio = () => {
    if (!selectedSign) return;
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const readText = `${selectedSign.name}. What it means: ${selectedSign.description}. Why it matters: ${selectedSign.whyItMatters}. ${selectedSign.challanAmount ? `Challan penalty: ${selectedSign.challanAmount}` : ''}`;
      setIsPlayingAudio(true);
      speakText(readText, userLanguage, () => setIsPlayingAudio(false));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-24 space-y-4 select-none">
      {/* Search & Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-white dark:bg-[#1C1F24] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider block">
                Visual Reference
              </span>
              <h2 className="text-xl font-black text-[#1A1A1A] dark:text-white tracking-tight">
                Signs & Markings Library
              </h2>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {filteredSigns.length} Signs
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search signs, rules, lines..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1C1F24] border border-gray-200 dark:border-gray-700 text-[#1A1A1A] dark:text-white placeholder-gray-400 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs (Horizontal Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] shadow-xs'
                  : 'bg-white dark:bg-[#1C1F24] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Signs 2-Column Grid */}
      {filteredSigns.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1C1F24] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 space-y-2">
          <div className="text-3xl">🔍</div>
          <div className="font-bold text-gray-700 dark:text-gray-200">No signs found</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Try searching for "Speed", "Stop", "Hospital", or "Overtaking".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredSigns.map((sign) => (
            <button
              key={sign.id}
              onClick={() => handleOpenSign(sign)}
              className="p-4 bg-white dark:bg-[#1C1F24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs hover:border-[#FF6B35] dark:hover:border-[#FF6B35] hover:shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-transform my-1">
                <TrafficSignSvg svgKey={sign.svgKey} size={70} />
              </div>
              <div className="mt-2 w-full">
                <h4 className="font-extrabold text-xs text-[#1A1A1A] dark:text-white line-clamp-1 group-hover:text-[#FF6B35] transition-colors">
                  {sign.name}
                </h4>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize block mt-0.5">
                  {sign.category.replace('_', ' ')}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Expanded Sign Detail Modal */}
      {selectedSign && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C1F24] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            {/* Header with Close and Audio */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B35] bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-full border border-orange-100 dark:border-orange-900/50">
                {selectedSign.category.replace('_', ' ')}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlaySignAudio}
                  className={`p-2 rounded-full border transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-[#FF6B35] text-white border-[#FF6B35] animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-[#FF6B35]'
                  }`}
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Vector Sign Centered */}
            <div className="flex justify-center py-3">
              <TrafficSignSvg svgKey={selectedSign.svgKey} size={140} />
            </div>

            {/* Sign Details */}
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-[#1A1A1A] dark:text-white">
                {selectedSign.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Official Shape: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedSign.shape}</span>
              </p>
            </div>

            {/* Explanation Boxes */}
            <div className="space-y-3 pt-2 text-left">
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                  What it means
                </span>
                <p className="text-xs text-gray-800 dark:text-gray-200 font-medium mt-0.5 leading-relaxed">
                  {selectedSign.description}
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[11px] font-bold text-[#1B5E20] dark:text-emerald-400 uppercase tracking-wider block">
                  Why it matters
                </span>
                <p className="text-xs text-emerald-950 dark:text-emerald-200 font-medium mt-0.5 leading-relaxed">
                  {selectedSign.whyItMatters}
                </p>
              </div>

              {selectedSign.challanAmount && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 dark:text-amber-200 leading-normal">
                    <span className="font-bold">Challan Penalty: </span>
                    {selectedSign.challanAmount}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCloseModal}
              className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#1A1A1A] dark:text-white font-bold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              Done Reading
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
