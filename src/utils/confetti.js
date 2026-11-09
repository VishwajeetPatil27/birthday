import confetti from 'canvas-confetti';

/**
 * Triggers a lovely romantic pink & gold confetti celebration
 */
export const triggerRomanticConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      colors: ['#F47291', '#EC4899', '#CFBAFF', '#FFE4E9', '#FFBAA6', '#D4AF37'],
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

/**
 * Fireworks style explosion for grand moments
 */
export const triggerFireworksConfetti = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 },
      colors: ['#F47291', '#B28FFF', '#FFD7CC', '#FCD0D9', '#E0A96D']
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 },
      colors: ['#F47291', '#B28FFF', '#FFD7CC', '#FCD0D9', '#E0A96D']
    });
  }, 250);
};

/**
 * Heart-shaped particle shower
 */
export const triggerHeartShower = () => {
  const scalar = 2;
  const heart = confetti.shapeFromText({ text: '💖', scalar });
  const sparkle = confetti.shapeFromText({ text: '✨', scalar });
  const flower = confetti.shapeFromText({ text: '🌸', scalar });

  confetti({
    shapes: [heart, sparkle, flower],
    scalar,
    particleCount: 35,
    spread: 80,
    origin: { y: 0.6 },
    zIndex: 9999,
  });
};

