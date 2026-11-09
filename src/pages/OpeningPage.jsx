import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MailOpen, ArrowRight, Stamp } from 'lucide-react';
import { useBirthday } from '../context/BirthdayContext';
import { triggerRomanticConfetti, triggerHeartShower } from '../utils/confetti';
import { PinkBowSticker, EvilEyeSticker, LipstickKissSticker, AngelNumber1111 } from '../components/Stickers/AestheticStickers';

export const OpeningPage = () => {
  const { config, nextPage, unlockSurprise, isMusicPlaying, toggleMusic } = useBirthday();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    unlockSurprise('opened_secret_envelope', false);
    triggerRomanticConfetti();
    triggerHeartShower();

    // Start background music automatically if not already playing
    if (!isMusicPlaying) {
      toggleMusic();
    }

    // Smooth transition to next page after letter reveal animation
    setTimeout(() => {
      nextPage();
    }, 2400);
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] w-full flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
      {/* Decorative Washi Tapes & Aesthetic Stickers */}
      <div className="washi-tape washi-tape-lavender -top-2 left-6 -rotate-12 opacity-70" />
      <div className="washi-tape washi-tape-peach top-12 right-8 rotate-12 opacity-70" />

      {/* Aesthetic Stickers on Envelope Stage */}
      {config.stickers?.showStickers !== false && (
        <>
          <div className="absolute top-8 left-6 sm:left-14 z-20">
            <PinkBowSticker size="lg" />
          </div>
          <div className="absolute top-20 right-8 sm:right-20 z-20">
            <EvilEyeSticker size="md" />
          </div>
        </>
      )}

      {/* Top Teaser Headers */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center max-w-xl mx-auto mb-8 z-20"
      >
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/90 text-rose-600 text-xs font-semibold tracking-wider uppercase mb-3 border border-pink-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
          A Little Universe Created Just For You
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-gray-800 tracking-tight leading-tight mb-3">
          {config.envelope.teaserText}
        </h1>

        <p className="font-rounded text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
          {config.envelope.subTeaserText}
        </p>
      </motion.div>

      {/* 3D Realistic Envelope Container */}
      <div className="relative z-20 w-full max-w-md sm:max-w-lg flex flex-col items-center">
        <motion.div
          animate={{
            y: isOpen ? 0 : [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: isOpen ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full aspect-[4/3] max-w-[420px] envelope-perspective"
        >
          {/* Envelope Body Base */}
          <div className="relative w-full h-full bg-gradient-to-b from-[#fcd9e2] to-[#f7b6c8] rounded-2xl shadow-envelope border border-pink-200/80 overflow-visible flex items-center justify-center">
            
            {/* Postal Stamp Badge & Stickers */}
            <div className="absolute top-4 right-4 bg-white/90 border border-dashed border-rose-300 rounded-lg p-2 shadow-sm rotate-6 flex flex-col items-center select-none pointer-events-none">
              <span className="text-[9px] font-bold text-rose-500 tracking-widest uppercase">AIR MAIL</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-400 my-0.5" />
              <span className="text-[8px] text-gray-500 font-serif">100% LOVE</span>
            </div>

            {/* Lipstick Kiss Sticker on Envelope Bottom Corner */}
            <div className="absolute bottom-2 left-3 z-15 rotate-12">
              <LipstickKissSticker size="sm" />
            </div>

            {/* Angel Number 11:11 Badge */}
            <div className="absolute top-4 left-4 z-15 -rotate-6">
              <AngelNumber1111 text={config.stickers?.angelNumberText || "11:11"} />
            </div>

            {/* Recipient Handwritten Label Card */}
            <div className="absolute inset-x-8 bottom-10 py-4 px-6 bg-white/95 rounded-xl shadow-md border border-pink-100 text-center transform -rotate-1 pointer-events-none z-10">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-pink-500">
                STRICTLY CONFIDENTIAL • FOR
              </span>
              <span className="font-handwriting text-3xl sm:text-4xl text-rose-600 font-bold block mt-0.5">
                {config.recipient.name}
              </span>
              <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                ✨ Handle with maximum affection & birthday joy ✨
              </span>
            </div>

            {/* Emerging Letter on Click */}
            <motion.div
              initial={false}
              animate={{
                y: isOpen ? -110 : 0,
                opacity: isOpen ? 1 : 0,
                scale: isOpen ? 1.05 : 0.85,
              }}
              transition={{
                duration: 1.2,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="absolute inset-x-5 top-4 h-[90%] bg-gradient-to-b from-[#fffefc] to-[#fff8f0] rounded-xl shadow-2xl p-6 border border-pink-200 z-30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-pink-100 pb-2 mb-3">
                  <span className="text-[10px] font-bold tracking-wider text-rose-500 uppercase">
                    OFFICIAL INVITATION
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
                  Welcome to Your Birthday Universe!
                </h3>
                <p className="font-handwriting text-lg text-rose-600 mt-2">
                  "Today is all about celebrating you, my favourite person."
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-pink-100 text-xs text-gray-500 font-medium">
                <span>Created with infinite love</span>
                <span className="font-bold text-rose-500">Entering... ✨</span>
              </div>
            </motion.div>

            {/* Envelope Flap (3D Flip Animation) */}
            <motion.div
              initial={false}
              animate={{
                rotateX: isOpen ? 180 : 0,
                zIndex: isOpen ? 5 : 25,
              }}
              transition={{
                duration: 0.9,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "top" }}
              className="absolute top-0 inset-x-0 h-[52%] bg-gradient-to-b from-[#f9a8ba] to-[#f47291] rounded-t-2xl shadow-md clip-path-triangle"
            >
              {/* Decorative flap stitch pattern */}
              <div className="w-full h-full border-b border-pink-200/40 relative">
                {/* Wax Seal on Flap */}
                {!isOpen && (
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenEnvelope}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full wax-seal flex items-center justify-center cursor-pointer shadow-lg z-30 group"
                    title="Click the wax seal to open"
                  >
                    <Heart className="w-7 h-7 text-white fill-white/90 drop-shadow group-hover:scale-110 transition-transform" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Button below envelope */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-12 text-center"
        >
          <motion.button
            type="button"
            onClick={handleOpenEnvelope}
            disabled={isOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className={`px-8 py-4 rounded-full font-rounded font-bold text-sm sm:text-base tracking-wide shadow-soft-pink transition-all flex items-center gap-3 ${
              isOpen
                ? 'bg-rose-400 text-white cursor-wait'
                : 'bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white hover:shadow-glow-pink ring-4 ring-pink-100 hover:ring-pink-200'
            }`}
          >
            {isOpen ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>UNFOLDING YOUR SURPRISE...</span>
              </>
            ) : (
              <>
                <MailOpen className="w-5 h-5" />
                <span>{config.envelope.buttonText}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </motion.button>

          <p className="text-xs text-gray-500 mt-3 font-medium">
            {config.envelope.hintText}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

