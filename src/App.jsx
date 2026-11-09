import React, { useState } from 'react';
import { BirthdayProvider, useBirthday } from './context/BirthdayContext';
import { ExperienceHeader } from './components/Navbar/ExperienceHeader';
import { FloatingParticles } from './components/FloatingDecorations/FloatingParticles';
import { CustomCursor } from './components/CustomCursor/CustomCursor';
import { MusicPlayer } from './components/MusicPlayer/MusicPlayer';
import { SecretHeartModal } from './components/SecretHeart/SecretHeartEasterEgg';
import { CustomizerModal } from './components/CustomizerModal/CustomizerModal';
import { PageTransition } from './components/PageTransition/PageTransition';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import { useSecurityProtection } from './hooks/useSecurityProtection';
import { motion, AnimatePresence } from 'framer-motion';

// The 8 Pages
import { OpeningPage } from './pages/OpeningPage';
import { BirthdayPage } from './pages/BirthdayPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { SecretMessagesPage } from './pages/SecretMessagesPage';
import { SurpriseGiftsPage } from './pages/SurpriseGiftsPage';
import { CakePage } from './pages/CakePage';
import { LetterPage } from './pages/LetterPage';
import { FinalPage } from './pages/FinalPage';

const ExperienceContent = () => {
  const { currentPage, nextPage, prevPage, isCustomizerOpen, setIsCustomizerOpen, isCloudLoading } = useBirthday();
  const { securityWarning } = useSecurityProtection();

  // Mobile Touch Swipe Gesture: Swipe left to turn page, swipe right to go back
  useSwipeGesture({
    onSwipeLeft: () => {
      if (currentPage < 8) nextPage();
    },
    onSwipeRight: () => {
      if (currentPage > 1) prevPage();
    },
  });

  if (isCloudLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blush-50 via-cream-50 to-lavender-50 select-none p-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-400 via-rose-400 to-lavender-400 flex items-center justify-center text-white shadow-glow-pink mb-4"
        >
          <span className="text-3xl animate-pulse">💖</span>
        </motion.div>
        <span className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-1">
          A THOUSAND LITTLE REASONS
        </span>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-800">
          Unfolding your little universe... ✨
        </h2>
        <p className="text-xs text-gray-400 mt-2">Loading birthday memories across the stars</p>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return <OpeningPage />;
      case 2:
        return <BirthdayPage />;
      case 3:
        return <MemoriesPage />;
      case 4:
        return <SecretMessagesPage />;
      case 5:
        return <SurpriseGiftsPage />;
      case 6:
        return <CakePage />;
      case 7:
        return <LetterPage />;
      case 8:
        return <FinalPage />;
      default:
        return <OpeningPage />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-pink-200 selection:text-rose-700">
      {/* Desktop Sparkle Trail Cursor */}
      <CustomCursor />

      {/* Subtle Floating Ambient Particles */}
      <FloatingParticles count={16} />

      {/* Sticky Header with Navigation & Counters */}
      <ExperienceHeader onOpenCustomizer={() => setIsCustomizerOpen(true)} />

      {/* Main Storybook Canvas */}
      <main className="flex-1 flex flex-col justify-center items-center w-full z-10">
        <PageTransition pageKey={currentPage}>
          {renderCurrentPage()}
        </PageTransition>
      </main>

      {/* Floating Music Player */}
      <MusicPlayer />

      {/* Secret Heart Easter Egg Modal Note */}
      <SecretHeartModal />

      {/* Live Customizer Modal Drawer */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />

      {/* Security Protection Warning Toast */}
      <AnimatePresence>
        {securityWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white font-bold text-xs sm:text-sm shadow-glow-pink border border-white/50 backdrop-blur-md flex items-center gap-2"
          >
            <span>🔒</span>
            <span>{securityWarning}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <BirthdayProvider>
      <ExperienceContent />
    </BirthdayProvider>
  );
}

