import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Feather, Calendar, Compass, PhoneCall, Car, HeartHandshake, PartyPopper, ArrowRight } from 'lucide-react';
import { useBirthday } from '../context/BirthdayContext';
import { triggerRomanticConfetti, triggerHeartShower } from '../utils/confetti';

const iconMap = {
  Compass,
  PhoneCall,
  Car,
  HeartHandshake,
  PartyPopper,
};

export const LetterPage = () => {
  const { config, nextPage, unlockSurprise } = useBirthday();
  const [revealedIndex, setRevealedIndex] = useState(1);

  const paragraphs = config.letter.paragraphs || [];
  const timeline = config.timeline || [];

  const handleRevealNext = () => {
    if (revealedIndex < paragraphs.length) {
      setRevealedIndex((prev) => prev + 1);
      triggerHeartShower();
    }
  };

  const handleRevealAll = () => {
    setRevealedIndex(paragraphs.length);
    triggerHeartShower();
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full py-8 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col items-center select-none">

      {/* Decorative Washi Tapes */}
      <div className="washi-tape washi-tape-peach -top-2 left-10 -rotate-3 opacity-70" />
      <div className="washi-tape washi-tape-lavender -top-2 right-12 rotate-3 opacity-70" />

      {/* Header Badge */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Feather className="w-3.5 h-3.5 text-rose-500" />
          <span>Chapter 7 • The Letter From My Heart</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-800 tracking-tight">
          Words Only You Can Hear
        </h1>
        <p className="font-rounded text-sm sm:text-base text-gray-600 mt-2">
          Written on elegant parchment, straight from one soul to another.
        </p>
      </div>

      {/* Elegant Handwritten Letter Stationery */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full bg-[#FFFDF8] scrapbook-paper rounded-3xl p-6 sm:p-12 shadow-2xl border-2 border-pink-200/90 mb-12 overflow-hidden"
      >
        {/* Ribbon decoration top-right */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
          <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white text-[9px] font-bold py-1 w-32 text-center absolute top-5 -right-7 rotate-45 shadow-sm">
            FOREVER BESTIE
          </div>
        </div>

        {/* Delicate Header info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-pink-100 pb-4 mb-6">
          <span className="font-serif italic text-sm text-pink-600">
            {config.letter.header}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            {config.letter.dateText}
          </span>
        </div>

        {/* Salutation */}
        <h2 className="font-handwriting text-3xl sm:text-4xl text-rose-600 font-bold mb-6">
          {config.letter.salutation}
        </h2>

        {/* Letter Paragraphs Container with notebook lines */}
        <div className="space-y-6 notebook-lines p-4 sm:p-6 rounded-2xl bg-white/70 border border-pink-100 shadow-inner">
          {paragraphs.slice(0, revealedIndex).map((p, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-handwriting text-2xl sm:text-3xl text-gray-800 leading-relaxed tracking-wide"
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Progressive Reading Buttons */}
        {revealedIndex < paragraphs.length && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={handleRevealNext}
              className="px-5 py-2.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Read Next Thought ({revealedIndex}/{paragraphs.length})</span>
            </button>
            <button
              onClick={handleRevealAll}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-pink-50 text-gray-500 hover:text-pink-600 font-medium text-xs border border-pink-200 transition"
            >
              Unfold Entire Letter
            </button>
          </div>
        )}

        {/* Closing & Signature */}
        {revealedIndex >= paragraphs.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-8 pt-6 border-t border-pink-100 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
          >
            <div>
              <p className="text-xs text-gray-500 font-medium">
                {config.letter.closing}
              </p>
              <p className="font-handwriting text-3xl text-rose-600 font-bold mt-1">
                {config.letter.signature}
              </p>
            </div>

            <p className="font-handwriting text-lg text-gray-600 italic">
              {config.letter.postscript}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Memory Timeline Section */}
      <div className="w-full my-6">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-100 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Our Friendship Milestones</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-800">
            The Story of Us
          </h2>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-pink-300 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
          {timeline.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Heart;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Timeline node icon */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-9 h-9 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Milestone card */}
                <div className="bg-white/85 backdrop-blur-sm p-5 rounded-2xl border border-pink-200/80 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-rose-600 uppercase tracking-wider">
                      {item.year} • {item.date}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold text-[10px]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-gray-800 mb-1">
                    {item.title}
                  </h3>

                  <p className="font-rounded text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation to Final Page */}
      <div className="text-center mt-10 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            unlockSurprise('completed_heartfelt_letter');
            triggerRomanticConfetti();
            nextPage();
          }}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-soft-pink hover:shadow-glow-pink flex items-center gap-2 cursor-pointer mx-auto"
        >
          <span>Continue to The Grand Finale</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
