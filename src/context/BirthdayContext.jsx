import React, { createContext, useContext, useState, useEffect } from 'react';
import { birthdayConfig } from '../data/birthdayConfig';
import { dreamSynth } from '../utils/audioSynthesizer';
import { soundFX } from '../utils/soundEffects';
import { triggerRomanticConfetti, triggerHeartShower } from '../utils/confetti';

const BirthdayContext = createContext(null);

export const BirthdayProvider = ({ children }) => {
  // Load config or use default
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_custom_config');
      return saved ? JSON.parse(saved) : birthdayConfig;
    } catch {
      return birthdayConfig;
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [unlockedSurprises, setUnlockedSurprises] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_unlocked');
      return saved ? new Set(JSON.parse(saved)) : new Set(['welcome']);
    } catch {
      return new Set(['welcome']);
    }
  });

  const [secretHeartsFound, setSecretHeartsFound] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_secret_hearts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active modal or lightbox
  const [activeSecretModal, setActiveSecretModal] = useState(null);
  const [activeSecretHeartNote, setActiveSecretHeartNote] = useState(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Audio State
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.6);
  const [audioMode, setAudioMode] = useState('synth'); // 'mp3' or 'synth'
  const [audioElement, setAudioElement] = useState(null);

  // Initialize HTML5 Audio element for MP3 check
  useEffect(() => {
    const audio = new Audio(config.audio.src);
    audio.loop = true;
    audio.volume = audioVolume;

    audio.addEventListener('error', () => {
      // MP3 not found or format error -> gracefully fallback to dream synth
      console.info("MP3 audio not found or blocked. Defaulting to built-in Dream Celesta Synthesizer.");
      setAudioMode('synth');
    });

    audio.addEventListener('canplaythrough', () => {
      setAudioMode('mp3');
    });

    setAudioElement(audio);

    return () => {
      audio.pause();
    };
  }, [config.audio.src]);

  // Handle Play / Pause
  const toggleMusic = () => {
    if (isMusicPlaying) {
      if (audioElement && audioMode === 'mp3') {
        audioElement.pause();
      }
      dreamSynth.stop();
      setIsMusicPlaying(false);
    } else {
      if (audioElement && audioMode === 'mp3') {
        audioElement.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(() => {
          // Fallback to synth if autoplay blocked
          dreamSynth.start();
          setIsMusicPlaying(true);
        });
      } else {
        dreamSynth.start();
        setIsMusicPlaying(true);
      }
    }
  };

  const updateVolume = (val) => {
    setAudioVolume(val);
    if (audioElement) {
      audioElement.volume = val;
    }
    dreamSynth.setVolume(val);
  };

  // Unlock surprise tracking
  const unlockSurprise = (surpriseId, celebration = true) => {
    setUnlockedSurprises((prev) => {
      if (prev.has(surpriseId)) return prev;
      const updated = new Set(prev).add(surpriseId);
      try {
        localStorage.setItem('birthday_unlocked', JSON.stringify([...updated]));
      } catch (e) {
        console.warn(e);
      }
      if (celebration) {
        triggerRomanticConfetti();
      }
      return updated;
    });
  };

  // Find secret heart easter egg
  const findSecretHeart = (heartId) => {
    if (secretHeartsFound.includes(heartId)) return;
    const heartData = config.secretHearts.find(h => h.id === heartId);
    if (heartData) {
      const updated = [...secretHeartsFound, heartId];
      setSecretHeartsFound(updated);
      try {
        localStorage.setItem('birthday_secret_hearts', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      unlockSurprise(`secret_heart_${heartId}`, false);
      soundFX.playChime();
      triggerHeartShower();
      setActiveSecretHeartNote(heartData);
    }
  };

  // Navigation handlers
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= 8) {
      soundFX.playPageTurn();
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextPage = () => {
    if (currentPage < 8) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const restartExperience = () => {
    soundFX.playChime();
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerRomanticConfetti();
  };

  // Save customized config
  const updateCustomConfig = (newConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('birthday_custom_config', JSON.stringify(newConfig));
    } catch (e) {
      console.warn(e);
    }
  };

  const resetCustomConfig = () => {
    setConfig(birthdayConfig);
    try {
      localStorage.removeItem('birthday_custom_config');
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <BirthdayContext.Provider
      value={{
        config,
        updateCustomConfig,
        resetCustomConfig,
        currentPage,
        goToPage,
        nextPage,
        prevPage,
        restartExperience,
        unlockedSurprises,
        unlockSurprise,
        secretHeartsFound,
        findSecretHeart,
        activeSecretHeartNote,
        setActiveSecretHeartNote,
        activeSecretModal,
        setActiveSecretModal,
        isCustomizerOpen,
        setIsCustomizerOpen,
        isMusicPlaying,
        toggleMusic,
        audioVolume,
        updateVolume,
        audioMode,
      }}
    >
      {children}
    </BirthdayContext.Provider>
  );
};

export const useBirthday = () => {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error('useBirthday must be used within a BirthdayProvider');
  }
  return context;
};

