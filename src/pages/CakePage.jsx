import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Wind, Mic, MicOff, Heart, ArrowRight } from 'lucide-react';
import { useBirthday } from '../context/BirthdayContext';
import { soundFX } from '../utils/soundEffects';
import { triggerFireworksConfetti, triggerRomanticConfetti } from '../utils/confetti';
import { SecretHeartEasterEgg } from '../components/SecretHeart/SecretHeartEasterEgg';

export const CakePage = () => {
  const { config, nextPage, unlockSurprise } = useBirthday();
  const candlesCount = config.cake.candlesCount || 5;
  const [litCandles, setLitCandles] = useState(() => new Set());
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [micError, setMicError] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const areAllCandlesLit = litCandles.size >= candlesCount;

  // Handle lighting individual candle
  const handleToggleCandle = (idx) => {
    if (candlesBlown) return;
    setLitCandles((prev) => {
      const updated = new Set(prev);
      if (updated.has(idx)) {
        updated.delete(idx);
      } else {
        updated.add(idx);
        soundFX.playChime();
      }
      if (updated.size >= candlesCount) {
        unlockSurprise('lit_birthday_candles', false);
      }
      return updated;
    });
  };

  // Handle lighting all candles at once
  const handleLightAllCandles = () => {
    const all = new Set(Array.from({ length: candlesCount }, (_, i) => i));
    setLitCandles(all);
    soundFX.playChime();
    unlockSurprise('lit_birthday_candles', false);
  };

  // Handle extinguishing candles
  const handleBlowOutCandles = () => {
    if (litCandles.size === 0 || candlesBlown) return;
    soundFX.playBlowWind();
    setCandlesBlown(true);
    triggerFireworksConfetti();
    triggerRomanticConfetti();
    unlockSurprise('blew_birthday_candles');

    // Stop mic if active
    stopMic();
  };

  // Optional Microphone Blowing detection
  const startMic = async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const microphone = audioCtx.createMediaStreamSource(stream);
      microphone.connect(analyser);

      setMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Average frequency volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setAudioLevel(Math.min(100, Math.floor(avg * 1.5)));

        // Blowing creates a distinctive low-frequency wind puff (> 45-50 threshold)
        if (avg > 42) {
          handleBlowOutCandles();
          return;
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn("Microphone access error:", err);
      setMicError("Microphone not available or permission denied. Please use the button below!");
      setMicActive(false);
    }
  };

  const stopMic = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setMicActive(false);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full py-8 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col items-center select-none">
      
      {/* Decorative Washi Tapes */}
      <div className="washi-tape washi-tape-gold -top-2 left-10 -rotate-3 opacity-60" />
      <div className="washi-tape washi-tape-peach -top-2 right-12 rotate-3 opacity-60" />

      {/* Secret Heart Easter Egg #3 (Hidden in cake flower area) */}
      <div className="absolute top-16 left-6 sm:left-12 z-20">
        <SecretHeartEasterEgg heartId="sh-3" />
      </div>

      {/* Page Title & Instructions */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Chapter 6 • The Birthday Wish</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-800 tracking-tight">
          Make a Birthday Wish, {config.recipient.name}
        </h1>
        <p className="font-rounded text-sm sm:text-base text-gray-600 mt-2">
          {candlesBlown
            ? "Your wish has taken flight to the stars! 🌟"
            : !areAllCandlesLit
            ? `Step 2: Tap the candles to light them (${litCandles.size}/${candlesCount} lit) 🕯️`
            : config.cake.instructionBlow}
        </p>
      </div>

      {/* 3D Multi-Layer Cake Stage */}
      <div className="relative w-full max-w-md flex flex-col items-center my-6">
        
        {/* Floating Candles Row */}
        <div className="flex items-end justify-center gap-4 sm:gap-6 z-20 -mb-2">
          {Array.from({ length: candlesCount }, (_, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {/* Flame or Smoke */}
              <div className="h-8 flex items-end justify-center">
                {litCandles.has(idx) && !candlesBlown && (
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 0.95, 1.15, 1],
                      rotate: [-3, 3, -2, 2, 0],
                    }}
                    transition={{
                      duration: 0.8 + (idx % 3) * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-4 h-6 rounded-t-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_15px_rgba(251,191,36,0.9)]"
                  />
                )}
                {candlesBlown && (
                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -20, x: (idx % 2 === 0 ? 6 : -6) }}
                    transition={{ duration: 1.5 }}
                    className="text-xs text-gray-400 select-none"
                  >
                    💨
                  </motion.div>
                )}
              </div>

              {/* Candle Wick */}
              <div className="w-0.5 h-2 bg-gray-800" />

              {/* Candle Body */}
              <div
                onClick={() => handleToggleCandle(idx)}
                className={`w-3 sm:w-3.5 h-12 sm:h-14 rounded-t-sm shadow-md cursor-pointer transition-all hover:scale-110 ${
                  idx % 2 === 0
                    ? 'bg-gradient-to-b from-pink-200 via-rose-300 to-pink-300'
                    : 'bg-gradient-to-b from-purple-200 via-lavender-300 to-purple-300'
                }`}
                title={litCandles.has(idx) ? "Lit Candle (Click to blow out individually)" : "Click to light candle! 🕯️"}
              >
                {/* Candle spiral stripes */}
                <div className="w-full h-full bg-white/30 clip-path-stripes" />
              </div>
            </div>
          ))}
        </div>

        {/* Multi-Layered Cake Structure */}
        <div className="w-full flex flex-col items-center">
          
          {/* Top Layer */}
          <div className="w-44 sm:w-52 h-14 bg-gradient-to-b from-[#FFF5F8] to-[#FCE7ED] rounded-t-3xl border-2 border-pink-200 shadow-md relative flex items-center justify-center">
            {/* Strawberries and floral decorations */}
            <div className="absolute -top-3 flex items-center justify-center gap-3 text-lg select-none">
              <span>🍓</span>
              <span>🌸</span>
              <span>🍓</span>
              <span>🌸</span>
              <span>🍓</span>
            </div>
            {/* White cream frosting drips */}
            <div className="absolute top-0 inset-x-0 h-4 bg-white/90 rounded-b-xl shadow-xs" />
          </div>

          {/* Middle Layer */}
          <div className="w-60 sm:w-72 h-16 bg-gradient-to-b from-[#FCE7ED] to-[#F9A8BA] rounded-t-2xl border-x-2 border-t-2 border-pink-300 shadow-lg relative flex items-center justify-center">
            {/* Cream rosettes */}
            <div className="absolute top-0 inset-x-0 h-5 bg-white/95 rounded-b-xl flex items-center justify-around px-2 text-xs">
              <span>🍦</span>
              <span>🎀</span>
              <span>🍦</span>
              <span>🎀</span>
              <span>🍦</span>
            </div>
            <span className="font-handwriting text-2xl text-rose-600 font-bold mt-2">
              Happy Birthday {config.recipient.name}
            </span>
          </div>

          {/* Bottom Layer Base */}
          <div className="w-76 sm:w-92 h-18 bg-gradient-to-b from-[#F9A8BA] to-[#F47291] rounded-t-xl border-x-2 border-t-2 border-pink-400 shadow-xl relative flex items-center justify-center">
            {/* Cream piping border */}
            <div className="absolute top-0 inset-x-0 h-5 bg-white rounded-b-2xl shadow-xs" />
            <div className="flex items-center gap-4 text-white/90 font-serif text-sm tracking-wider font-semibold mt-3">
              <span>✨ 100% LOVE ✨</span>
            </div>
          </div>

          {/* Cake Stand / Plate */}
          <div className="w-84 sm:w-[400px] h-4 bg-gradient-to-r from-gray-200 via-white to-gray-200 rounded-full shadow-2xl border border-gray-300 -mt-1" />
        </div>
      </div>

      {/* Interactive Controls Section */}
      <div className="w-full max-w-md text-center mt-6 space-y-4">
        {!areAllCandlesLit ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLightAllCandles}
            className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white font-bold text-base shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
          >
            <Flame className="w-5 h-5 fill-white" />
            <span>LIGHT ALL {candlesCount} CANDLES 🕯️</span>
          </motion.button>
        ) : !candlesBlown ? (
          <div className="space-y-3">
            {/* Primary Blow Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleBlowOutCandles}
              className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-bold text-base shadow-soft-pink hover:shadow-glow-pink transition flex items-center justify-center gap-2"
            >
              <Wind className="w-5 h-5 animate-bounce-soft" />
              <span>BLOW OUT THE CANDLES! 💨🎂</span>
            </motion.button>

            {/* Optional Mic Blowing Toggle */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={micActive ? stopMic : startMic}
                className={`text-xs px-4 py-2 rounded-full border transition flex items-center gap-1.5 ${
                  micActive
                    ? 'bg-rose-100 border-rose-300 text-rose-700'
                    : 'bg-white border-pink-200 text-gray-600 hover:text-pink-600'
                }`}
              >
                {micActive ? (
                  <>
                    <Mic className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                    <span>Listening for blow... (Puff into mic)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Or blow into microphone (Click to enable)</span>
                  </>
                )}
              </button>

              {micActive && (
                <div className="w-32 bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full transition-all duration-75"
                    style={{ width: `${audioLevel}%` }}
                  />
                </div>
              )}

              {micError && (
                <p className="text-[11px] text-amber-600 mt-1">{micError}</p>
              )}
            </div>
          </div>
        ) : (
          /* Wish Granted Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-gradient-to-br from-pink-50 via-white to-lavender-50 rounded-3xl border-2 border-pink-200 shadow-xl"
          >
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-bounce-soft" />
            <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
              {config.cake.blewMessage}
            </h3>
            <p className="font-handwriting text-2xl text-rose-600 leading-relaxed">
              "{config.cake.subBlewMessage}"
            </p>
          </motion.div>
        )}
      </div>

      {/* Navigation to Letter Page */}
      <div className="text-center mt-8 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            unlockSurprise('completed_cake_chapter');
            nextPage();
          }}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-soft-pink hover:shadow-glow-pink flex items-center gap-2 cursor-pointer mx-auto"
        >
          <span>Continue to The Letter From My Heart</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

