import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const FloatingParticles = ({ variant = 'default', count = 18 }) => {
  // Generate stable random items
  const items = useMemo(() => {
    const emojis = ['🌸', '✨', '💖', '🎀', '⭐', '🦋', '🌷', '🤍'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: `${(i * (100 / count) + Math.random() * 8) % 96}%`,
      top: `${(i * 17 + Math.random() * 20) % 90}%`,
      size: 14 + Math.floor(Math.random() * 16),
      duration: 5 + (i % 5) * 2,
      delay: (i % 6) * 0.7,
      yOffset: 15 + (i % 3) * 10,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute select-none opacity-40 hover:opacity-80 transition-opacity"
          style={{
            left: item.left,
            top: item.top,
            fontSize: `${item.size}px`,
          }}
          animate={{
            y: [-item.yOffset, item.yOffset, -item.yOffset],
            x: [-8, 8, -8],
            rotate: [-10, 10, -10],
            opacity: [0.3, 0.65, 0.3],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
};

