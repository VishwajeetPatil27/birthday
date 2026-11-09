import React from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../../utils/soundEffects';

/**
 * 1. Coquette Pink Ribbon Bow Sticker
 */
export const PinkBowSticker = ({ className = "", size = "md", onClick }) => {
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-16 h-16 sm:w-20 sm:h-20",
    lg: "w-24 h-24 sm:w-28 sm:h-28",
  };

  const handleClick = (e) => {
    soundFX.playPop();
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.12, rotate: 6 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`inline-block cursor-pointer select-none filter drop-shadow-[0_4px_8px_rgba(244,114,145,0.35)] ${sizeMap[size] || sizeMap.md} ${className}`}
      title="Coquette Ribbon Bow 🎀"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White Die-cut Sticker Border */}
        <path
          d="M50 42 C38 20 8 24 16 50 C22 66 44 56 48 50 L34 88 C32 94 42 96 46 90 L52 60 L58 90 C62 96 72 94 70 88 L56 50 C60 56 82 66 88 50 C96 24 66 20 54 42 Z"
          fill="white"
          stroke="white"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Left Loop */}
        <path
          d="M48 48 C36 24 12 28 18 50 C24 64 42 54 48 48 Z"
          fill="url(#pinkBowGrad1)"
        />
        {/* Left Loop Crease */}
        <path d="M28 38 C32 44 42 46 48 48" stroke="#F47291" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Right Loop */}
        <path
          d="M52 48 C64 24 88 28 82 50 C76 64 58 54 52 48 Z"
          fill="url(#pinkBowGrad2)"
        />
        {/* Right Loop Crease */}
        <path d="M72 38 C68 44 58 46 52 48" stroke="#F47291" strokeWidth="2.5" strokeLinecap="round" />

        {/* Center Knot */}
        <ellipse cx="50" cy="48" rx="8" ry="7" fill="#E8436E" stroke="white" strokeWidth="1.5" />
        <ellipse cx="49" cy="47" rx="6" ry="5" fill="#F47291" />

        {/* Left Ribbon Tail */}
        <path
          d="M47 54 L34 88 C33 92 40 94 43 89 L51 58 Z"
          fill="url(#pinkBowGrad1)"
        />
        {/* Right Ribbon Tail */}
        <path
          d="M53 54 L66 88 C67 92 60 94 57 89 L49 58 Z"
          fill="url(#pinkBowGrad2)"
        />

        <defs>
          <linearGradient id="pinkBowGrad1" x1="16" y1="28" x2="48" y2="88" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFCCD5" />
            <stop offset="0.6" stopColor="#F47291" />
            <stop offset="1" stopColor="#E8436E" />
          </linearGradient>
          <linearGradient id="pinkBowGrad2" x1="84" y1="28" x2="52" y2="88" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFCCD5" />
            <stop offset="0.6" stopColor="#F47291" />
            <stop offset="1" stopColor="#E8436E" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

/**
 * 2. Evil Eye Protection Amulet Sticker (Nazar)
 */
export const EvilEyeSticker = ({ className = "", size = "md", onClick }) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-14 h-14 sm:w-16 sm:h-16",
    lg: "w-20 h-20",
  };

  const handleClick = (e) => {
    soundFX.playChime();
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.15, rotate: -8 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`inline-block cursor-pointer select-none filter drop-shadow-[0_4px_10px_rgba(30,58,138,0.3)] ${sizeMap[size] || sizeMap.md} ${className}`}
      title="Evil Eye Protection Amulet 🧿"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Die Cut Outer White Outline */}
        <circle cx="50" cy="50" r="48" fill="white" />
        {/* Deep Royal Cobalt Blue Outer Ring */}
        <circle cx="50" cy="50" r="44" fill="#1E3A8A" />
        {/* White Inner Circle */}
        <circle cx="50" cy="50" r="32" fill="#FFFFFF" />
        {/* Light Turquoise / Sky Blue Circle */}
        <circle cx="50" cy="50" r="22" fill="#38BDF8" />
        {/* Center Black Pupil */}
        <circle cx="50" cy="50" r="11" fill="#0F172A" />
        {/* Glossy White Reflection Dot */}
        <circle cx="45" cy="45" r="4" fill="white" opacity="0.9" />
      </svg>
    </motion.div>
  );
};

/**
 * 3. Angel Number "11:11" Make A Wish Sticker
 */
export const AngelNumber1111 = ({ className = "", text = "11:11", onClick }) => {
  const handleClick = (e) => {
    soundFX.playChime();
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`inline-flex items-center justify-center cursor-pointer select-none px-3.5 py-1.5 bg-white text-gray-900 font-black text-lg sm:text-2xl tracking-widest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.12)] border-2 border-white ring-2 ring-pink-100 ${className}`}
      title="11:11 Make a wish! ✨"
    >
      <span className="font-serif tracking-tight drop-shadow-xs">{text}</span>
    </motion.div>
  );
};

/**
 * 4. "Birthday Girl" Calligraphy Sticker
 */
export const BirthdayGirlBadge = ({ className = "", text = "Birthday Girl", onClick }) => {
  const handleClick = (e) => {
    soundFX.playPop();
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 3 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className={`inline-flex flex-col items-center justify-center cursor-pointer select-none px-4 py-2 bg-gradient-to-r from-pink-50 via-white to-pink-50 text-gray-900 rounded-2xl shadow-[0_4px_14px_rgba(244,114,145,0.25)] border-3 border-white ring-2 ring-pink-200 transform -rotate-3 ${className}`}
      title="The Official Birthday Star 💖"
    >
      <span className="text-[9px] font-extrabold uppercase tracking-widest text-rose-500 font-sans -mb-1">
        ✨ OFFICIAL ✨
      </span>
      <span className="font-handwriting text-2xl sm:text-3xl font-bold text-gray-800 leading-none">
        {text}
      </span>
    </motion.div>
  );
};

/**
 * 5. Red Lipstick Kiss Marks Sticker
 */
export const LipstickKissSticker = ({ className = "", size = "md", onClick }) => {
  const sizeMap = {
    sm: "w-10 h-7",
    md: "w-16 h-11",
    lg: "w-22 h-15",
  };

  const handleClick = (e) => {
    soundFX.playPop();
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.2, rotate: 12 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`inline-block cursor-pointer select-none filter drop-shadow-[0_2px_6px_rgba(225,29,72,0.3)] ${sizeMap[size] || sizeMap.md} ${className}`}
      title="Sealed with a birthday kiss 💋"
    >
      <svg viewBox="0 0 100 70" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Upper Lip */}
        <path
          d="M10 32 C22 18 36 20 50 26 C64 20 78 18 90 32 C78 36 64 34 50 36 C36 34 22 36 10 32 Z"
          fill="#BE123C"
        />
        {/* Upper Lip Highlights/Texture */}
        <path d="M28 26 C38 24 62 24 72 26" stroke="#FDA4AF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        
        {/* Lower Lip */}
        <path
          d="M15 38 C32 40 44 42 50 42 C56 42 68 40 85 38 C75 58 65 64 50 64 C35 64 25 58 15 38 Z"
          fill="#9F1239"
        />
        {/* Center Plump highlight */}
        <ellipse cx="50" cy="50" rx="14" ry="4" fill="#E11D48" opacity="0.8" />
      </svg>
    </motion.div>
  );
};

/**
 * 6. Cherries with Pink Bow Sticker
 */
export const CherriesSticker = ({ className = "", size = "md", onClick }) => {
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-16 h-16 sm:w-18 sm:h-18",
    lg: "w-24 h-24",
  };

  const handleClick = (e) => {
    soundFX.playPop();
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.15, rotate: -8 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`inline-block cursor-pointer select-none filter drop-shadow-[0_4px_8px_rgba(225,29,72,0.3)] ${sizeMap[size] || sizeMap.md} ${className}`}
      title="Cherry on top 🍒"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White Sticker Die-cut Border */}
        <ellipse cx="32" cy="70" rx="18" ry="17" fill="white" />
        <ellipse cx="68" cy="74" rx="18" ry="17" fill="white" />
        <path d="M32 68 C34 40 44 26 50 20 C56 26 66 40 68 72" stroke="white" strokeWidth="8" strokeLinecap="round" />

        {/* Green Stems */}
        <path d="M32 68 C34 40 44 26 50 20" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
        <path d="M68 72 C66 40 56 26 50 20" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />

        {/* Small Pink Bow on Stem Join */}
        <ellipse cx="50" cy="22" rx="4" ry="3.5" fill="#F47291" />
        <path d="M50 22 C42 16 38 24 45 25 Z" fill="#F47291" />
        <path d="M50 22 C58 16 62 24 55 25 Z" fill="#F47291" />

        {/* Left Glossy Cherry */}
        <circle cx="32" cy="70" r="16" fill="url(#cherryGrad1)" />
        <ellipse cx="28" cy="65" rx="4" ry="7" fill="white" opacity="0.6" transform="rotate(-20 28 65)" />

        {/* Right Glossy Cherry */}
        <circle cx="68" cy="74" r="16" fill="url(#cherryGrad2)" />
        <ellipse cx="64" cy="69" rx="4" ry="7" fill="white" opacity="0.6" transform="rotate(-20 64 69)" />

        <defs>
          <radialGradient id="cherryGrad1" cx="30%" cy="30%" r="70%">
            <stop stopColor="#F43F5E" />
            <stop offset="0.7" stopColor="#BE123C" />
            <stop offset="1" stopColor="#881337" />
          </radialGradient>
          <radialGradient id="cherryGrad2" cx="30%" cy="30%" r="70%">
            <stop stopColor="#F43F5E" />
            <stop offset="0.7" stopColor="#BE123C" />
            <stop offset="1" stopColor="#881337" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

/**
 * 7. Groovy Layered Pink Heart Sticker
 */
export const GroovyHeartSticker = ({ className = "", size = "md", onClick }) => {
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-16 h-16 sm:w-20 sm:h-20",
    lg: "w-24 h-24",
  };

  const handleClick = (e) => {
    soundFX.playPop();
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.15, rotate: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`inline-block cursor-pointer select-none filter drop-shadow-[0_4px_10px_rgba(244,114,145,0.3)] ${sizeMap[size] || sizeMap.md} ${className}`}
      title="Groovy Love Heart 💖"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Layer 1: White Die-cut Border */}
        <path
          d="M50 88 C20 70 8 48 8 30 C8 16 20 8 32 8 C40 8 46 12 50 18 C54 12 60 8 68 8 C80 8 92 16 92 30 C92 48 80 70 50 88 Z"
          fill="white"
        />
        {/* Layer 2: Deep Rose/Red */}
        <path
          d="M50 84 C22 67 12 47 12 31 C12 19 22 12 32 12 C40 12 45 16 50 21 C55 16 60 12 68 12 C78 12 88 19 88 31 C88 47 78 67 50 84 Z"
          fill="#E11D48"
        />
        {/* Layer 3: Vibrant Hot Pink */}
        <path
          d="M50 78 C26 63 18 46 18 33 C18 23 26 17 34 17 C41 17 46 20 50 25 C54 20 59 17 66 17 C74 17 82 23 82 33 C82 46 74 63 50 78 Z"
          fill="#FB7185"
        />
        {/* Layer 4: Soft Baby Pink */}
        <path
          d="M50 72 C30 59 24 45 24 35 C24 27 30 22 36 22 C42 22 47 25 50 29 C53 25 58 22 64 22 C70 22 76 27 76 35 C76 45 70 59 50 72 Z"
          fill="#FECDD3"
        />
        {/* Layer 5: Center Heart */}
        <path
          d="M50 65 C34 54 30 43 30 36 C30 31 34 27 38 27 C43 27 47 30 50 33 C53 30 57 27 62 27 C66 27 70 31 70 36 C70 43 66 54 50 65 Z"
          fill="#E11D48"
        />
      </svg>
    </motion.div>
  );
};

/**
 * 8. Torn Kraft Paper Sticker with Custom Text ("Happiness", "Memories", etc.)
 */
export const TornPaperSticker = ({ text = "Happiness", className = "", onClick }) => {
  const handleClick = (e) => {
    soundFX.playPop();
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`inline-block cursor-pointer select-none px-4 py-2 bg-[#EAD8C0] text-[#4A3928] font-serif italic text-base sm:text-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] border border-[#D5C2AA] rounded-sm transform rotate-2 ${className}`}
      style={{
        clipPath: "polygon(0% 4%, 5% 0%, 95% 2%, 100% 6%, 98% 95%, 94% 100%, 4% 97%, 0% 92%)",
      }}
      title={text}
    >
      <span className="font-serif tracking-wider">{text}</span>
    </motion.div>
  );
};

/**
 * 9. Shiny Metallic Foil Number Balloons (Configurable Age, e.g. "16", "21", "24")
 */
export const FoilAgeBalloons = ({ age = 16, className = "", onClick }) => {
  const handleClick = (e) => {
    soundFX.playPop();
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 cursor-pointer select-none filter drop-shadow-[0_8px_16px_rgba(185,28,28,0.4)] ${className}`}
      title={`Age ${age} Foil Balloons 🎈`}
    >
      <div className="relative px-3.5 py-1.5 rounded-2xl bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#991B1B] text-white font-serif font-black text-3xl sm:text-5xl tracking-tighter border-2 border-red-300 shadow-inner flex items-center justify-center">
        {/* Foil Shine Highlights */}
        <div className="absolute top-1 left-2 right-2 h-2.5 rounded-full bg-white/40 blur-[0.5px]" />
        <span className="relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">{age}</span>
      </div>
    </motion.div>
  );
};

/**
 * 10. Mini Spotify Song Player Card Sticker
 */
export const MiniSpotifyCard = ({
  song = "Day by day, I'm fallin' more in love with our friendship",
  artist = "Spotify • Your Universe",
  className = "",
  onClick
}) => {
  const handleClick = (e) => {
    soundFX.playChime();
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04, rotate: 1 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className={`inline-flex flex-col cursor-pointer select-none p-3 rounded-2xl bg-[#526D5B] text-white max-w-[240px] shadow-[0_6px_16px_rgba(0,0,0,0.18)] border-2 border-white/60 transform -rotate-1 ${className}`}
      title="A Little Soundtrack For You 🎵"
    >
      <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-green-200 font-bold mb-1">
        <span>{artist}</span>
        <span className="text-xs">🎧</span>
      </div>
      <p className="font-serif italic text-xs leading-snug line-clamp-2 text-white/95">
        "{song}"
      </p>
      <div className="w-full bg-white/30 h-1 rounded-full mt-2 overflow-hidden">
        <div className="w-2/3 h-full bg-white rounded-full" />
      </div>
    </motion.div>
  );
};

/**
 * 11. Cute Hugging Ghost Besties Sticker
 */
export const CuteGhostsSticker = ({ className = "", size = "md", onClick }) => {
  const sizeMap = {
    sm: "w-10 h-8",
    md: "w-16 h-12 sm:w-20 sm:h-14",
    lg: "w-24 h-18",
  };

  const handleClick = (e) => {
    soundFX.playPop();
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.12, rotate: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`inline-block cursor-pointer select-none filter drop-shadow-[0_4px_8px_rgba(244,114,145,0.3)] ${sizeMap[size] || sizeMap.md} ${className}`}
      title="Ghost Besties Hugging! 👻💖"
    >
      <svg viewBox="0 0 120 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pink Outline */}
        <path
          d="M10 70 C10 20 45 15 55 40 C65 15 105 20 105 70 C95 65 85 75 75 68 C65 75 55 65 45 72 C35 65 25 75 10 70 Z"
          fill="#FB7185"
        />
        {/* Left Ghost Body */}
        <path
          d="M14 66 C14 24 45 20 52 42 C45 68 35 62 14 66 Z"
          fill="white"
        />
        {/* Left Ghost Eyes & Smile */}
        <ellipse cx="30" cy="40" rx="2" ry="2.5" fill="#1F2937" />
        <ellipse cx="40" cy="40" rx="2" ry="2.5" fill="#1F2937" />
        <path d="M33 45 Q35 48 37 45" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
        {/* Left Blush */}
        <circle cx="26" cy="43" r="2.5" fill="#FDA4AF" />
        <circle cx="44" cy="43" r="2.5" fill="#FDA4AF" />

        {/* Right Ghost Body */}
        <path
          d="M50 42 C56 20 95 24 95 66 C75 62 60 68 50 42 Z"
          fill="white"
        />
        {/* Right Ghost Eyes & Smile */}
        <ellipse cx="68" cy="40" rx="2" ry="2.5" fill="#1F2937" />
        <ellipse cx="78" cy="40" rx="2" ry="2.5" fill="#1F2937" />
        <path d="M71 45 Q73 48 75 45" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
        {/* Right Blush */}
        <circle cx="64" cy="43" r="2.5" fill="#FDA4AF" />
        <circle cx="82" cy="43" r="2.5" fill="#FDA4AF" />

        {/* Little Heart Between Them */}
        <path
          d="M55 36 C52 32 48 35 50 38 L55 43 L60 38 C62 35 58 32 55 36 Z"
          fill="#E11D48"
        />
      </svg>
    </motion.div>
  );
};

