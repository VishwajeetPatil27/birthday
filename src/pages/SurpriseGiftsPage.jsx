import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Heart, ArrowRight, CheckCircle2, Ticket, Award, Smile } from 'lucide-react';
import { useBirthday } from '../context/BirthdayContext';
import { triggerRomanticConfetti, triggerHeartShower } from '../utils/confetti';
import { ScratchCard } from '../components/ScratchCard/ScratchCard';

export const SurpriseGiftsPage = () => {
  const { config, nextPage, unlockSurprise } = useBirthday();
  const [openedBoxes, setOpenedBoxes] = useState(() => new Set());
  const [activeGiftModal, setActiveGiftModal] = useState(null);

  const gifts = config.mysteryGifts || [];

  const handleOpenGift = (gift) => {
    setOpenedBoxes((prev) => new Set(prev).add(gift.id));
    unlockSurprise(`opened_gift_${gift.id}`);
    triggerRomanticConfetti();
    triggerHeartShower();
    setActiveGiftModal(gift);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full py-8 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col items-center select-none">
      
      {/* Decorative Washi Tapes */}
      <div className="washi-tape washi-tape-lavender -top-2 left-8 -rotate-6 opacity-60" />
      <div className="washi-tape washi-tape-peach -top-2 right-10 rotate-6 opacity-60" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Gift className="w-3.5 h-3.5 text-rose-500 animate-bounce-soft" />
          <span>Chapter 5 • The Mystery Gift Collection</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-800 tracking-tight">
          Unwrap Your Birthday Gifts
        </h1>
        <p className="font-rounded text-sm sm:text-base text-gray-600 mt-2">
          Four mysterious boxes packed with promises, laughter, and a golden surprise ticket.
        </p>

        {/* Unwrapped Count */}
        <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-white rounded-full border border-pink-200 text-xs font-semibold text-rose-600 shadow-sm">
          <span>Unwrapped: {openedBoxes.size} of {gifts.length} Boxes</span>
        </div>
      </div>

      {/* 4 Interactive Gift Boxes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
        {gifts.map((gift, idx) => {
          const isOpened = openedBoxes.has(gift.id);
          return (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -6 }}
              className="flex flex-col items-center"
            >
              {/* Gift Box Card Container */}
              <div
                onClick={() => handleOpenGift(gift)}
                className="relative w-full aspect-square max-w-[220px] rounded-3xl bg-white/80 p-4 border-2 border-pink-200 shadow-md hover:shadow-xl cursor-pointer flex flex-col items-center justify-center transition-all group overflow-visible"
              >
                {/* 3D Animated Gift Box Graphic */}
                <div className="relative w-28 h-28 flex flex-col items-center justify-end">
                  
                  {/* Floating Box Lid */}
                  <motion.div
                    animate={
                      isOpened
                        ? { y: -28, rotate: -18, scale: 1.05 }
                        : { y: [0, -3, 0] }
                    }
                    transition={{
                      duration: isOpened ? 0.6 : 2.5,
                      repeat: isOpened ? 0 : Infinity,
                      ease: "easeInOut",
                    }}
                    className={`w-28 h-8 rounded-lg shadow-md z-20 flex items-center justify-center ${gift.lidBg || 'bg-rose-400'}`}
                  >
                    {/* Ribbon Bow on top */}
                    <div className="absolute -top-3 w-8 h-4 bg-yellow-300 rounded-full shadow-sm flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                    {/* Vertical ribbon on lid */}
                    <div className="w-4 h-full bg-yellow-300/80" />
                  </motion.div>

                  {/* Gift Box Lower Body */}
                  <div className={`w-24 h-18 rounded-b-xl shadow-lg relative flex justify-center overflow-hidden ${gift.boxBg || 'bg-gradient-to-br from-pink-300 to-rose-400'}`}>
                    {/* Vertical Ribbon */}
                    <div className="w-4 h-full bg-yellow-300/80" />
                    {/* Horizontal Ribbon */}
                    <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-4 bg-yellow-300/80" />
                  </div>

                  {/* Bursting Heart Particles when opened */}
                  {isOpened && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [1, 1.4, 1.2], opacity: [0, 1, 0.8] }}
                      className="absolute -top-10 text-2xl pointer-events-none select-none z-30"
                    >
                      {gift.sticker || '✨'}
                    </motion.div>
                  )}
                </div>

                {/* Box Title */}
                <span className="font-serif font-bold text-sm text-gray-800 text-center mt-3 line-clamp-1">
                  {gift.boxTitle}
                </span>

                {/* Status indicator */}
                <span className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${isOpened ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isOpened ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> Unwrapped
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" /> Tap to Open
                    </>
                  )}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Scratch Card Feature Section */}
      <div className="w-full my-4">
        <ScratchCard
          title={config.scratchCard.title}
          subtitle={config.scratchCard.subtitle}
          hiddenMessage={config.scratchCard.hiddenMessage}
          onComplete={() => unlockSurprise('completed_scratch_card')}
        />
      </div>

      {/* Gift Details Modal when opened */}
      <AnimatePresence>
        {activeGiftModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setActiveGiftModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-200 text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveGiftModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-pink-100 transition"
              >
                ✕
              </button>

              {/* Gift Icon Badge */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center text-3xl shadow-glow-pink">
                {activeGiftModal.sticker || '🎁'}
              </div>

              <span className="text-[10px] font-bold tracking-widest uppercase text-rose-500 mb-1 block">
                {activeGiftModal.boxTitle}
              </span>

              <h3 className="font-serif text-2xl font-bold text-gray-800 mb-3">
                {activeGiftModal.surpriseTitle}
              </h3>

              <div className="bg-pink-50/60 p-5 rounded-2xl border border-pink-100 shadow-inner mb-6 text-left">
                <p className="font-rounded text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {activeGiftModal.content}
                </p>
              </div>

              <button
                onClick={() => setActiveGiftModal(null)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold shadow-soft-pink hover:opacity-95 transition"
              >
                Claim This Birthday Gift 💖
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation to Cake Page */}
      <div className="text-center mt-6 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            unlockSurprise('completed_gifts_chapter');
            nextPage();
          }}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-soft-pink hover:shadow-glow-pink flex items-center gap-2 cursor-pointer mx-auto"
        >
          <span>Continue to The Birthday Cake Experience</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

