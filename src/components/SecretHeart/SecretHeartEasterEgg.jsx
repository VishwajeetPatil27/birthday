import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X } from 'lucide-react';
import { useBirthday } from '../../context/BirthdayContext';

export const SecretHeartEasterEgg = ({ heartId, className = "" }) => {
  const { findSecretHeart, secretHeartsFound } = useBirthday();
  const isFound = secretHeartsFound.includes(heartId);

  return (
    <motion.button
      type="button"
      onClick={() => findSecretHeart(heartId)}
      whileHover={{ scale: 1.35, rotate: 12 }}
      whileTap={{ scale: 0.9 }}
      className={`group relative cursor-pointer focus:outline-none transition-all ${className}`}
      title={isFound ? "Secret Heart Unlocked! ✨" : "A secret sparkle is hidden here..."}
    >
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`p-1.5 rounded-full ${
          isFound 
            ? 'bg-rose-100 text-rose-500 shadow-sm border border-rose-300' 
            : 'bg-pink-100/60 hover:bg-pink-200 text-pink-400 hover:text-pink-600'
        }`}
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${isFound ? 'fill-rose-500 text-rose-500' : 'fill-pink-300/40 text-pink-400'}`} 
        />
      </motion.div>

      {/* Tiny pulse ping */}
      {!isFound && (
        <span className="absolute -inset-1 rounded-full bg-pink-300 opacity-30 animate-ping pointer-events-none" />
      )}
    </motion.button>
  );
};

export const SecretHeartModal = () => {
  const { activeSecretHeartNote, setActiveSecretHeartNote, secretHeartsFound, config } = useBirthday();

  if (!activeSecretHeartNote) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className="relative max-w-md w-full bg-gradient-to-br from-pink-50 via-cream-50 to-lavender-50 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-200 text-center"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveSecretHeartNote(null)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-pink-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative Header Badge */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-glow-pink">
            <Heart className="w-8 h-8 fill-white animate-bounce-soft" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-xs font-semibold text-pink-600 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>YOU DISCOVERED A SECRET HEART!</span>
          </div>

          <h3 className="font-serif text-2xl font-bold text-gray-800 mb-4">
            A Whispered Secret Just For You
          </h3>

          <div className="bg-white/80 p-5 rounded-2xl border border-pink-100 shadow-inner mb-6 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-pink-100/50 rounded-bl-full pointer-events-none" />
            <p className="font-handwriting text-xl sm:text-2xl text-gray-800 leading-relaxed">
              "{activeSecretHeartNote.message}"
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-5 px-2">
            <span>Hidden discovery progress:</span>
            <span className="font-semibold text-rose-500">
              {secretHeartsFound.length} of {config.secretHearts?.length || 4} Unlocked
            </span>
          </div>

          <button
            onClick={() => setActiveSecretHeartNote(null)}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold shadow-soft-pink hover:opacity-95 transition transform active:scale-95"
          >
            Keep In My Heart 💖
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

