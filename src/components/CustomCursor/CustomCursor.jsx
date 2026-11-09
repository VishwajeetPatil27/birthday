import React, { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    let lastTime = 0;
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const now = Date.now();
      if (now - lastTime > 60) {
        lastTime = now;
        const newParticle = {
          id: now + Math.random(),
          x: e.clientX,
          y: e.clientY,
          symbol: Math.random() > 0.5 ? '✨' : '💖',
        };

        setTrail((prev) => [...prev.slice(-8), newParticle]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 180);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Primary subtle pink cursor ring */}
      <div
        className="pointer-events-none fixed w-6 h-6 rounded-full border-2 border-blush-400 bg-blush-200/20 z-[9999] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 backdrop-blur-[1px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      
      {/* Tiny sparkling trail */}
      {trail.map((item) => (
        <span
          key={item.id}
          className="pointer-events-none fixed z-[9998] text-xs select-none transition-all duration-300 opacity-60 -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </>
  );
};

