import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift, Heart, ChevronLeft, ChevronRight, Music, Edit3 } from 'lucide-react';
import { useBirthday } from '../../context/BirthdayContext';

export const ExperienceHeader = ({ onOpenCustomizer }) => {
  const {
    currentPage,
    goToPage,
    prevPage,
    nextPage,
    unlockedSurprises,
    secretHeartsFound,
    isMusicPlaying,
    toggleMusic,
    config
  } = useBirthday();

  const totalPages = 8;
  const pageNames = [
    "Secret Envelope",
    "Grand Entrance",
    "Our Universe",
    "Secret Messages",
    "Mystery Gifts",
    "Birthday Cake",
    "Heartfelt Letter",
    "Final Celebration"
  ];

  return (
    <header className="sticky top-0 z-30 w-full px-3 sm:px-6 py-2.5 backdrop-blur-md bg-white/70 border-b border-pink-100 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Project Brand & Recipient */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(1)}
            className="flex items-center gap-1.5 text-left group"
            title="Return to start"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xs sm:text-sm font-bold text-gray-800 tracking-wide block leading-tight">
                A Thousand Little Reasons
              </span>
              <span className="text-[10px] text-pink-500 font-medium block truncate max-w-[120px] sm:max-w-none">
                For {config.recipient.name} ✨
              </span>
            </div>
          </button>
        </div>

        {/* Center: Storybook Page Steps Navigation */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-full transition ${
              currentPage === 1 ? 'opacity-30 cursor-not-allowed text-gray-400' : 'text-gray-600 hover:bg-pink-100 hover:text-pink-600'
            }`}
            title="Previous chapter"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Page Indicators */}
          <div className="flex items-center gap-1 bg-pink-50/80 px-2.5 py-1 rounded-full border border-pink-200/60 shadow-inner">
            <span className="text-xs font-semibold text-rose-600 mr-1 sm:mr-2">
              Ch. {currentPage}/{totalPages}
            </span>
            <div className="hidden md:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => goToPage(num)}
                  className={`h-2 rounded-full transition-all ${
                    num === currentPage
                      ? 'w-6 bg-rose-500'
                      : num < currentPage
                      ? 'w-2 bg-pink-300'
                      : 'w-2 bg-pink-200/60 hover:bg-pink-300'
                  }`}
                  title={`Go to ${pageNames[num - 1]}`}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-500 font-medium hidden sm:inline ml-1 truncate max-w-[110px]">
              {pageNames[currentPage - 1]}
            </span>
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`p-1.5 rounded-full transition ${
              currentPage === totalPages ? 'opacity-30 cursor-not-allowed text-gray-400' : 'text-gray-600 hover:bg-pink-100 hover:text-pink-600'
            }`}
            title="Next chapter"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Right: Surprise Counter & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Surprise Counter Pill */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 text-rose-700 text-xs font-semibold border border-pink-200 shadow-sm"
            title="Total interactive surprises and secrets you have unlocked!"
          >
            <Gift className="w-3.5 h-3.5 text-rose-500 animate-bounce-soft" />
            <span className="hidden xs:inline">Surprises:</span>
            <span>{unlockedSurprises.size}</span>
          </div>

          {/* Quick Sound Toggle */}
          <button
            onClick={toggleMusic}
            className={`p-1.5 rounded-full border transition ${
              isMusicPlaying 
                ? 'bg-rose-50 border-rose-300 text-rose-600' 
                : 'bg-white border-gray-200 text-gray-500 hover:text-rose-500'
            }`}
            title={isMusicPlaying ? "Music Playing (Click to mute)" : "Play Music"}
          >
            <Music className={`w-4 h-4 ${isMusicPlaying ? 'animate-pulse' : ''}`} />
          </button>

          {/* Customize / Edit Drawer trigger (Password Protected) */}
          <button
            onClick={onOpenCustomizer}
            className="relative p-1.5 rounded-full bg-white border border-pink-200 text-pink-500 hover:bg-pink-50 hover:text-pink-700 transition group"
            title="Customize Experience"
          >
            <Edit3 className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[7px] font-bold shadow-xs">
              🔒
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

