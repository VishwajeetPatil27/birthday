import { useEffect, useRef } from 'react';

/**
 * Custom hook to detect mobile swipe gestures for scrapbook page turns.
 * Ignores swipes originating from canvas (scratch card) or modals.
 */
export const useSwipeGesture = ({ onSwipeLeft, onSwipeRight, minSwipeDistance = 65 }) => {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      // Don't trigger swipe on canvas (scratch card), form inputs, or modal backdrops
      const target = e.target;
      if (
        target.tagName === 'CANVAS' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('.no-swipe') ||
        target.closest('[role="dialog"]')
      ) {
        touchStartX.current = null;
        touchStartY.current = null;
        return;
      }

      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      // Ensure horizontal swipe is more significant than vertical scroll
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX < 0) {
          // Swiped left -> Next page
          if (onSwipeLeft) onSwipeLeft();
        } else {
          // Swiped right -> Previous page
          if (onSwipeRight) onSwipeRight();
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, minSwipeDistance]);
};

