import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PartyPopper, Heart, Music, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useBirthday } from '../context/BirthdayContext';
import { triggerRomanticConfetti, triggerFireworksConfetti } from '../utils/confetti';
import { soundFX } from '../utils/soundEffects';
import { SecretHeartEasterEgg } from '../components/SecretHeart/SecretHeartEasterEgg';
import { BirthdayGirlBadge, FoilAgeBalloons, CherriesSticker, CuteGhostsSticker } from '../components/Stickers/AestheticStickers';

export const BirthdayPage = () => {
  const { config, nextPage, unlockSurprise, isMusicPlaying, toggleMusic } = useBirthday();
  const [countdown, setCountdown] = useState(3);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [poppedBalloons, setPoppedBalloons] = useState(() => new Set());
  const [poppedCompliment, setPoppedCompliment] = useState(null);

  useEffect(() => {
    // Initial entrance celebration
    triggerRomanticConfetti();
    unlockSurprise('birthday_entrance_celebration');

    // Quick celebratory countdown for excitement
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCelebrationActive(true);
          triggerFireworksConfetti();
          return 0;
        }
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  // Generate colorful floating balloons with cute compliments
  const balloons = [
    { id: 1, color: 'from-pink-400 to-rose-500', left: '8%', delay: 0.2, speed: 7, compliment: "Pure Sunshine! ☀️" },
    { id: 2, color: 'from-purple-300 to-lavender-400', left: '22%', delay: 1.4, speed: 8.5, compliment: "Most Radiant Smile! ✨" },
    { id: 3, color: 'from-peach-300 to-rose-400', left: '78%', delay: 0.6, speed: 7.5, compliment: "Warmest Heart! 🌸" },
    { id: 4, color: 'from-pink-300 to-pink-400', left: '90%', delay: 1.8, speed: 9, compliment: "100% Irreplaceable! 💖" },
    { id: 5, color: 'from-rose-400 to-purple-400', left: '4%', delay: 2.5, speed: 8, compliment: "Galaxy of Joy! 🌟" },
    { id: 6, color: 'from-amber-200 to-peach-300', left: '85%', delay: 3.0, speed: 7.8, compliment: "Cutest Bestie Forever! 🎀" },
  ];

  const handlePopBalloon = (balloon, e) => {
    e.stopPropagation();
    if (poppedBalloons.has(balloon.id)) return;
    setPoppedBalloons((prev) => new Set(prev).add(balloon.id));
    soundFX.playPop();
    triggerRomanticConfetti();
    unlockSurprise(`popped_balloon_${balloon.id}`, false);
    setPoppedCompliment({ text: balloon.compliment, x: e.clientX, y: e.clientY });
    setTimeout(() => {
      setPoppedCompliment(null);
    }, 2200);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
      
      {/* Animated Rising Balloons in Background (Click to Pop!) */}
      {balloons.map((balloon) => {
        const isPopped = poppedBalloons.has(balloon.id);
        if (isPopped) return null;

        return (
          <motion.div
            key={balloon.id}
            className="absolute z-20 flex flex-col items-center cursor-pointer group"
            style={{ left: balloon.left, bottom: '-120px' }}
            animate={{
              y: ['0vh', '-130vh'],
              x: [-12, 12, -12],
              rotate: [-8, 8, -8],
            }}
            transition={{
              duration: balloon.speed,
              repeat: Infinity,
              delay: balloon.delay,
              ease: "easeInOut",
            }}
            onClick={(e) => handlePopBalloon(balloon, e)}
            whileHover={{ scale: 1.15 }}
            title="Tap to pop balloon! 🎈"
          >
            {/* Balloon Oval */}
            <div className={`w-14 h-18 sm:w-16 sm:h-22 rounded-[50%] bg-gradient-to-tr ${balloon.color} shadow-lg relative flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity`}>
              {/* Balloon Shine Highlight */}
              <div className="absolute top-2 left-3 w-4 h-6 rounded-full bg-white/40 rotate-12 blur-[1px]" />
              <span className="text-[10px] text-white font-bold opacity-0 group-hover:opacity-90 select-none">POP!</span>
            </div>
            {/* Balloon knot and thread */}
            <div className="w-1.5 h-1.5 bg-rose-400 rounded-full -mt-0.5" />
            <div className="w-0.5 h-16 bg-pink-300/60" />
          </motion.div>
        );
      })}

      {/* Floating Compliment Toast when Balloon is Popped */}
      {poppedCompliment && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -45, scale: 1.1 }}
          exit={{ opacity: 0 }}
          className="fixed z-50 pointer-events-none px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs sm:text-sm shadow-glow-pink flex items-center gap-1.5"
          style={{
            left: poppedCompliment.x ? `${poppedCompliment.x}px` : '50%',
            top: poppedCompliment.y ? `${poppedCompliment.y}px` : '40%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span>🎈</span>
          <span>{poppedCompliment.text}</span>
        </motion.div>
      )}

      {/* Secret Heart Easter Egg #1 (Hidden in balloon area) */}
      <div className="absolute top-16 right-8 sm:right-16 z-20">
        <SecretHeartEasterEgg heartId="sh-1" />
      </div>

      {/* Main Hero Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative z-20 max-w-3xl w-full bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-12 shadow-2xl border-2 border-pink-200/80 text-center"
      >
        {/* Top Washi Tape & Floating Stickers */}
        <div className="washi-tape washi-tape-gold -top-3 left-1/2 -translate-x-1/2 -rotate-1" />

        {/* Floating Aesthetic Stickers on Hero */}
        {config.stickers?.showStickers !== false && (
          <>
            <div className="absolute -top-6 -left-4 sm:-left-8 z-30">
              <BirthdayGirlBadge text={config.stickers?.birthdayGirlBadgeText || "Birthday Girl"} />
            </div>
            <div className="absolute -top-8 -right-4 sm:-right-6 z-30">
              <FoilAgeBalloons age={config.stickers?.foilBalloonAge || config.recipient.age || 24} />
            </div>
            <div className="absolute -bottom-6 -left-3 sm:-left-6 z-30">
              <CherriesSticker size="md" />
            </div>
            <div className="absolute -bottom-6 -right-3 sm:-right-6 z-30">
              <CuteGhostsSticker size="md" />
            </div>
          </>
        )}

        {/* Celebratory Icon Badge */}
        <motion.div
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-pink-400 via-rose-400 to-lavender-400 p-0.5 shadow-glow-pink"
        >
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
            <PartyPopper className="w-10 h-10 text-rose-500" />
          </div>
        </motion.div>

        {/* Small sparkling badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-100/90 text-rose-600 font-semibold text-xs mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span>SPECIAL BIRTHDAY EDITION • {config.recipient.birthDate}</span>
        </div>

        {/* Grand Typography: HAPPY BIRTHDAY, [HER NAME]! */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="font-rounded font-extrabold text-sm sm:text-lg tracking-widest text-pink-500 uppercase mb-1">
            {config.entrance.celebrationHeadline}
          </h2>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent leading-none py-2 drop-shadow-sm">
            {config.recipient.name}!
          </h1>
        </motion.div>

        {/* Poetic Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-handwriting text-2xl sm:text-3xl md:text-4xl text-gray-700 mt-4 max-w-xl mx-auto leading-relaxed"
        >
          "{config.entrance.subtitle}"
        </motion.p>

        {/* Interactive Music Toggle Highlight */}
        <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-pink-50/80 border border-pink-200 text-xs text-gray-600 shadow-sm">
          <div className="flex items-center gap-1.5">
            <Music className="w-4 h-4 text-pink-500" />
            <span className="font-medium">Soundtrack:</span>
          </div>
          <button
            onClick={toggleMusic}
            className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition ${
              isMusicPlaying
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-rose-600 border border-pink-200'
            }`}
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse" /> Playing Melody
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" /> Turn Music ON ✨
              </>
            )}
          </button>
        </div>

        {/* Main CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              triggerFireworksConfetti();
              nextPage();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-bold text-base shadow-soft-pink hover:shadow-glow-pink ring-4 ring-pink-100 transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{config.entrance.buttonText}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        <p className="text-[11px] text-gray-400 mt-4">
          ✨ Tip: Keep an eye out for glowing secret hearts hidden along the way!
        </p>
      </motion.div>
    </div>
  );
};

