import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { triggerRomanticConfetti } from '../../utils/confetti';

export const ScratchCard = ({
  hiddenMessage,
  title,
  subtitle,
  onComplete,
}) => {
  const canvasRef = useRef(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawingRef = useRef(false);

  // Initialize or reset canvas coating
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Luxurious rose-gold / shimmering metallic gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#E0A96D');
    gradient.addColorStop(0.3, '#F5D0C5');
    gradient.addColorStop(0.7, '#D4AF37');
    gradient.addColorStop(1, '#B76E79');

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add decorative sparkle pattern and text on top of scratch surface
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 3 + 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.fillStyle = '#6D3847';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE TO REVEAL ✨', width / 2, height / 2 - 10);
    ctx.font = '12px "Quicksand", sans-serif';
    ctx.fillText('Swipe or drag to uncover your wish', width / 2, height / 2 + 14);

    setIsCompleted(false);
    setScratchPercent(0);
  };

  useEffect(() => {
    initCanvas();
  }, []);

  const calculateScratch = () => {
    const canvas = canvasRef.current;
    if (!canvas || isCompleted) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    // Count transparent pixels (alpha < 128)
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] < 128) {
        transparentCount++;
      }
    }

    const currentPercent = Math.min(100, Math.floor((transparentCount / (totalPixels / 4)) * 100));
    setScratchPercent(currentPercent);

    if (currentPercent >= 50 && !isCompleted) {
      setIsCompleted(true);
      triggerRomanticConfetti();
      if (onComplete) onComplete();
    }
  };

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isCompleted) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    calculateScratch();
  };

  // Mouse Handlers
  const handleMouseDown = (e) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e) => {
    isDrawingRef.current = true;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDrawingRef.current) return;
    if (e.cancelable) e.preventDefault();
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-pink-50 via-cream-50 to-lavender-50 p-5 rounded-3xl border-2 border-pink-200 shadow-xl text-center select-none">
      <div className="mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-100 text-rose-600 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          {title || "Birthday Mystery Scratch Ticket"}
        </span>
        <p className="text-xs text-gray-500 mt-1">
          {subtitle || "Rub or drag your finger across the golden cover to reveal your surprise!"}
        </p>
      </div>

      {/* Scratch Container */}
      <div className="relative w-full aspect-[16/9] max-h-[220px] rounded-2xl overflow-hidden shadow-inner border border-pink-200 bg-white flex items-center justify-center p-4">
        {/* Hidden Message Layer Underneath */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-tr from-rose-50 via-white to-pink-50">
          <Trophy className="w-8 h-8 text-amber-500 mb-1 animate-bounce-soft" />
          <p className="font-handwriting text-xl sm:text-2xl font-bold text-gray-800 leading-snug whitespace-pre-line">
            {hiddenMessage}
          </p>
        </div>

        {/* Scratchable Canvas Layer */}
        {!isCompleted && (
          <canvas
            ref={canvasRef}
            width={480}
            height={260}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10 transition-opacity duration-500"
          />
        )}
      </div>

      {/* Progress & Reset Option */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-3 px-2">
        <span className="font-semibold text-rose-500">
          {isCompleted ? "🎉 100% Revealed!" : `Scratched: ${scratchPercent}%`}
        </span>
        {isCompleted && (
          <button
            onClick={initCanvas}
            className="flex items-center gap-1 text-gray-500 hover:text-rose-600 text-[11px] font-semibold transition"
          >
            <RotateCcw className="w-3 h-3" /> Scratch Again
          </button>
        )}
      </div>
    </div>
  );
};

