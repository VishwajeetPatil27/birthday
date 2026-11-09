import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Sparkles, X, Stamp, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useBirthday } from '../context/BirthdayContext';
import { triggerRomanticConfetti, triggerHeartShower } from '../utils/confetti';
import { SecretHeartEasterEgg } from '../components/SecretHeart/SecretHeartEasterEgg';
import { LipstickKissSticker, EvilEyeSticker, TornPaperSticker } from '../components/Stickers/AestheticStickers';

export const SecretMessagesPage = () => {
  const { config, nextPage, unlockSurprise, unlockedSurprises } = useBirthday();
  const [openedEnvelope, setOpenedEnvelope] = useState(null);
  const [readEnvelopes, setReadEnvelopes] = useState(() => new Set());

  const envelopes = config.secretEnvelopes || [];

  const handleOpenEnvelope = (envelope) => {
    setOpenedEnvelope(envelope);
    setReadEnvelopes((prev) => new Set(prev).add(envelope.id));
    unlockSurprise(`read_secret_${envelope.id}`, false);
    triggerHeartShower();
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full py-8 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col items-center select-none">
      
      {/* Decorative Washi Tapes */}
      <div className="washi-tape washi-tape-gold -top-2 left-12 rotate-3 opacity-60" />
      <div className="washi-tape washi-tape-lavender -top-2 right-16 -rotate-3 opacity-60" />

      {/* Secret Heart Easter Egg #2 (Placed near the top right stamp area) */}
      <div className="absolute top-12 right-6 sm:right-12 z-20">
        <SecretHeartEasterEgg heartId="sh-2" />
      </div>

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 relative">
        {config.stickers?.showStickers !== false && (
          <>
            <div className="absolute -top-6 -left-4 sm:-left-10 z-10 -rotate-6">
              <TornPaperSticker text={config.stickers?.favoritePersonText || "favorite person"} />
            </div>
            <div className="absolute -top-6 -right-4 sm:-right-8 z-10 rotate-12">
              <LipstickKissSticker size="sm" />
            </div>
          </>
        )}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>Chapter 4 • Words From The Heart</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
          Things I Never Told You
        </h1>
        <p className="font-rounded text-sm sm:text-base text-gray-600 mt-2">
          Pick an envelope to reveal a private message whispered from my soul to yours.
        </p>

        {/* Discovery Progress Pill */}
        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-white rounded-full border border-pink-200 text-xs font-semibold text-rose-600 shadow-sm">
          <span>Discovered:</span>
          <span>{readEnvelopes.size} of {envelopes.length} Letters</span>
        </div>
      </div>

      {/* Grid of Interactive Closed Envelopes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
        {envelopes.map((env, index) => {
          const isRead = readEnvelopes.has(env.id);
          return (
            <motion.div
              key={env.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenEnvelope(env)}
              className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all shadow-md hover:shadow-xl flex flex-col justify-between min-h-[200px] overflow-hidden ${
                isRead
                  ? 'bg-white/95 border-pink-300'
                  : 'bg-gradient-to-br from-pink-50 via-cream-50 to-pink-100/60 border-pink-200'
              }`}
            >
              {/* Vintage Stamp Accent */}
              <div className="absolute top-3 right-3 bg-white/90 border border-dashed border-rose-300 rounded px-2 py-0.5 text-[9px] font-bold text-rose-500 shadow-xs uppercase tracking-wider rotate-3">
                {env.stamp || "CONFIDENTIAL"}
              </div>

              {/* Envelope Flap Mock V-shape Line */}
              <div className="w-full h-8 border-b-2 border-dashed border-pink-200 flex items-center justify-center -mt-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-rose-500 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Preview */}
              <div className="flex-1">
                <h3 className="font-serif text-lg font-bold text-gray-800 leading-snug mb-2">
                  {env.title}
                </h3>
                <p className="text-xs text-gray-500 italic line-clamp-2">
                  "{env.letterPreview}"
                </p>
              </div>

              {/* Bottom status badge */}
              <div className="flex items-center justify-between pt-3 border-t border-pink-100 text-xs font-semibold">
                <span className={`flex items-center gap-1 ${isRead ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isRead ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Read
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Tap to Unseal
                    </>
                  )}
                </span>
                <span className="text-gray-400 text-[11px]">Letter #{index + 1}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Opened Envelope Handwritten Letter Modal */}
      <AnimatePresence>
        {openedEnvelope && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpenedEnvelope(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-xl w-full bg-[#FFFDF8] scrapbook-paper rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-pink-200 text-left overflow-hidden"
            >
              {/* Washi Tape on modal top */}
              <div className="washi-tape washi-tape-peach -top-3 left-1/2 -translate-x-1/2 -rotate-1" />

              {/* Close Button */}
              <button
                onClick={() => setOpenedEnvelope(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-pink-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Stamp Badge */}
              <div className="flex items-center justify-between border-b border-pink-200 pb-3 mb-6">
                <span className="text-[11px] font-bold text-rose-500 tracking-widest uppercase">
                  UNSEALED CONFESSION • FOR {config.recipient.name}
                </span>
                <span className="text-xs text-gray-400 font-serif">
                  {openedEnvelope.stamp}
                </span>
              </div>

              {/* Letter Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                {openedEnvelope.title}
              </h2>

              {/* Handwritten Content on Notebook Paper */}
              <div className="notebook-lines p-4 sm:p-6 rounded-2xl border border-pink-100 shadow-inner bg-white/70 mb-6">
                <p className="font-handwriting text-2xl sm:text-3xl text-gray-800 leading-relaxed">
                  "{openedEnvelope.fullLetter}"
                </p>
              </div>

              {/* Closing footer */}
              <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                <span className="font-handwriting text-xl text-rose-600 font-bold">
                  {config.sender.signature} {config.sender.name}
                </span>

                <button
                  onClick={() => setOpenedEnvelope(null)}
                  className="px-5 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold transition"
                >
                  Keep In Memory 💖
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Continue CTA */}
      <div className="text-center mt-2 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            unlockSurprise('completed_secret_letters');
            triggerRomanticConfetti();
            nextPage();
          }}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-soft-pink hover:shadow-glow-pink flex items-center gap-2 cursor-pointer mx-auto"
        >
          <span>Continue to The Mystery Gift Boxes</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

