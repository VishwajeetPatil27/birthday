import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Play, Pause, Disc3, Sparkles } from 'lucide-react';
import { useBirthday } from '../../context/BirthdayContext';

export const MusicPlayer = () => {
  const { isMusicPlaying, toggleMusic, audioVolume, updateVolume, config, audioMode } = useBirthday();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      <div className="flex items-center gap-2">
        {/* Expanded Controls Card */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-pink-200/80 flex items-center gap-3 text-xs"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 truncate max-w-[140px]">
                  {config.audio.title || "Birthday Melody"}
                </span>
                <span className="text-pink-500 font-medium text-[10px] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {audioMode === 'synth' ? "Acoustic Celesta Synth" : "Original Soundtrack"}
                </span>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-pink-100">
                <button
                  type="button"
                  onClick={() => updateVolume(audioVolume === 0 ? 0.6 : 0)}
                  className="text-gray-500 hover:text-pink-600 transition"
                  title="Mute / Unmute"
                >
                  {audioVolume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioVolume}
                  onChange={(e) => updateVolume(parseFloat(e.target.value))}
                  className="w-16 h-1.5 accent-pink-500 bg-pink-100 rounded-lg cursor-pointer"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Floating Play/Pause Bubble */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center"
        >
          <button
            type="button"
            onClick={toggleMusic}
            onContextMenu={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className={`w-13 h-13 p-3.5 rounded-full shadow-lg flex items-center justify-center transition-all ${
              isMusicPlaying
                ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-soft-pink ring-4 ring-pink-100'
                : 'bg-white text-gray-600 hover:text-pink-500 border border-pink-200 shadow-md'
            }`}
            title={isMusicPlaying ? "Pause music (Click) / Audio settings (Double click)" : "Play background music ✨"}
          >
            {isMusicPlaying ? (
              <Disc3 className="w-6 h-6 animate-spin text-white" style={{ animationDuration: '4s' }} />
            ) : (
              <Music className="w-6 h-6" />
            )}
          </button>

          {/* Settings mini toggle pill */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-100 border border-pink-300 text-pink-600 flex items-center justify-center text-[10px] hover:bg-pink-200 transition"
            title="Toggle music settings"
          >
            ⚙️
          </button>
        </motion.div>
      </div>
    </div>
  );
};

