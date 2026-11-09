import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, RotateCcw, Award, CheckCircle2, Star, Share2, Download } from 'lucide-react';
import { useBirthday } from '../context/BirthdayContext';
import { triggerFireworksConfetti, triggerRomanticConfetti } from '../utils/confetti';
import { soundFX } from '../utils/soundEffects';
import { FireworksCanvas } from '../components/Fireworks/FireworksCanvas';
import { SecretHeartEasterEgg } from '../components/SecretHeart/SecretHeartEasterEgg';
import { MiniSpotifyCard, PinkBowSticker, TornPaperSticker } from '../components/Stickers/AestheticStickers';

export const FinalPage = () => {
  const { config, restartExperience, unlockedSurprises, secretHeartsFound, setIsCustomizerOpen } = useBirthday();
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);

  useEffect(() => {
    triggerFireworksConfetti();
  }, []);

  const photos = config.memoriesScrapbook.photos.slice(0, 4);

  // Generate and download high-res Keepsake Card
  const handleDownloadKeepsake = () => {
    setIsGeneratingCard(true);
    soundFX.playChime();
    triggerRomanticConfetti();

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      // Soft romantic gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
      bgGrad.addColorStop(0, '#FFF5F8');
      bgGrad.addColorStop(0.5, '#FFFDF8');
      bgGrad.addColorStop(1, '#F3EEFF');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1350);

      // Gold / Rose gold decorative frame
      ctx.strokeStyle = '#E0A96D';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, 1000, 1270);

      ctx.strokeStyle = '#F47291';
      ctx.lineWidth = 3;
      ctx.strokeRect(58, 58, 964, 1234);

      // Sparkle stars
      ctx.fillStyle = '#E0A96D';
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * 960 + 60;
        const y = Math.random() * 1230 + 60;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Title & Branding
      ctx.textAlign = 'center';
      ctx.fillStyle = '#E8436E';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('✨ A THOUSAND LITTLE REASONS ✨', 540, 150);

      ctx.fillStyle = '#6B7280';
      ctx.font = '22px sans-serif';
      ctx.fillText('LIFETIME FRIENDSHIP CERTIFICATE', 540, 200);

      // Main Birthday Headline
      ctx.fillStyle = '#D12255';
      ctx.font = 'bold 64px serif';
      ctx.fillText(`HAPPY BIRTHDAY, ${config.recipient.name.toUpperCase()}!`, 540, 310);

      // Heart Icon
      ctx.fillStyle = '#F47291';
      ctx.font = '50px sans-serif';
      ctx.fillText('💖', 540, 390);

      // Quote
      ctx.fillStyle = '#1F2937';
      ctx.font = 'italic 34px serif';
      const quoteWords = config.finalCelebration.favouriteQuote.split(' ');
      let line = '';
      let y = 480;
      for (let n = 0; n < quoteWords.length; n++) {
        const testLine = line + quoteWords[n] + ' ';
        if (ctx.measureText(testLine).width > 800 && n > 0) {
          ctx.fillText(`"${line.trim()}"`, 540, y);
          line = quoteWords[n] + ' ';
          y += 50;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(`"${line.trim()}"`, 540, y);

      // Dedication
      ctx.fillStyle = '#4B5563';
      ctx.font = '24px sans-serif';
      ctx.fillText('Of all the people in the universe, having you as my best friend', 540, y + 100);
      ctx.fillText('is the greatest adventure and the sweetest blessing.', 540, y + 140);

      // Signature & Date
      ctx.fillStyle = '#D12255';
      ctx.font = 'bold 36px cursive';
      ctx.fillText(`Always & Forever, ${config.sender.name} ✨`, 540, 1140);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '20px sans-serif';
      ctx.fillText(`Official Birthday Keepsake • ${config.recipient.birthDate}`, 540, 1200);

      // Trigger download
      const link = document.createElement('a');
      link.download = `Birthday-Keepsake-${config.recipient.name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.warn("Card generation:", e);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full py-8 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center text-center select-none z-20">
      
      {/* Real-time Canvas Fireworks in Background */}
      <FireworksCanvas />

      {/* Secret Heart Easter Egg #4 (Hidden in upper fireworks sparkles) */}
      <div className="absolute top-12 right-8 sm:right-16 z-30">
        <SecretHeartEasterEgg heartId="sh-4" />
      </div>

      {/* Washi Tapes & Aesthetic Scrapbook Stickers */}
      <div className="washi-tape washi-tape-gold -top-2 left-12 rotate-6 opacity-70" />
      <div className="washi-tape washi-tape-lavender -top-2 right-14 -rotate-6 opacity-70" />

      {config.stickers?.showStickers !== false && (
        <>
          <div className="absolute top-10 left-4 sm:left-12 z-30">
            <PinkBowSticker size="md" />
          </div>
          <div className="hidden sm:block absolute bottom-12 left-8 z-30">
            <MiniSpotifyCard
              song={config.stickers?.spotifySongQuote || "Day by day, I'm fallin' more in love with our friendship"}
            />
          </div>
          <div className="hidden sm:block absolute bottom-16 right-8 z-30">
            <TornPaperSticker text={config.stickers?.tornPaperText || "Happiness"} />
          </div>
        </>
      )}

      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-4"
      >
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest border border-pink-200 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          FOREVER MY FAVOURITE PERSON
        </span>
      </motion.div>

      {/* Glowing Typography */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-serif text-4xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent leading-tight py-2 drop-shadow-sm mb-4"
      >
        {config.finalCelebration.heroGreeting}
      </motion.h1>

      {/* Poetic Friendship Quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="font-handwriting text-2xl sm:text-4xl text-gray-800 max-w-2xl mx-auto leading-relaxed mb-8"
      >
        "{config.finalCelebration.favouriteQuote}"
      </motion.p>

      {/* Mini Polaroid Photo Collage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl mb-8"
      >
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className={`polaroid-card rounded-sm shadow-md bg-white transform ${
              i % 2 === 0 ? '-rotate-2' : 'rotate-2'
            } hover:rotate-0 hover:scale-105 transition-all`}
          >
            <div className="aspect-square w-full overflow-hidden rounded-xs bg-pink-50 mb-2">
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-handwriting text-xs sm:text-sm text-gray-700 font-bold truncate">
              {photo.title}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Lifetime Friendship Certificate Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-200 mb-8 relative"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center mx-auto mb-3 shadow-glow-pink">
          <Award className="w-6 h-6" />
        </div>

        <span className="text-[11px] font-bold text-rose-500 tracking-wider uppercase block mb-1">
          {config.finalCelebration.promiseBadge}
        </span>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Certificate of Eternal Friendship
        </h3>

        <p className="font-rounded text-sm text-gray-600 leading-relaxed max-w-md mx-auto mb-4">
          {config.finalCelebration.emotionalEnding}
        </p>

        {/* Discovery Summary Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-pink-100 text-xs">
          <div className="p-2.5 rounded-xl bg-pink-50 text-rose-700 font-semibold">
            <span className="block text-gray-500 text-[10px]">Surprises Unlocked</span>
            <span className="text-base font-bold">{unlockedSurprises.size} Moments</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 font-semibold">
            <span className="block text-gray-500 text-[10px]">Secret Hearts Discovered</span>
            <span className="text-base font-bold">{secretHeartsFound.length} of 4 Secrets</span>
          </div>
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={restartExperience}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-bold text-base shadow-soft-pink hover:shadow-glow-pink ring-4 ring-pink-100 transition flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{config.finalCelebration.replayButtonText}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleDownloadKeepsake}
          disabled={isGeneratingCard}
          className="px-6 py-4 rounded-full bg-white text-rose-600 border-2 border-pink-300 font-bold text-sm shadow-md hover:bg-pink-50 transition flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-rose-500" />
          <span>{isGeneratingCard ? "Creating Keepsake..." : "Save Keepsake Card 💌"}</span>
        </motion.button>

        <button
          onClick={() => setIsCustomizerOpen(true)}
          className="px-4 py-2.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-rose-600 border border-pink-200 shadow-sm flex items-center gap-1.5 transition"
        >
          <span>🔒 Creator Studio</span>
        </button>
      </motion.div>

      <p className="text-xs text-gray-500 mt-6 font-handwriting text-xl">
        Forever your cheerleader, {config.sender.name} 💖
      </p>
    </div>
  );
};

