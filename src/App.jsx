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
  const { currentPage, nextPage, prevPage, isCustomizerOpen, setIsCustomizerOpen } = useBirthday();
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

