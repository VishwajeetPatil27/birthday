import { useEffect, useState } from 'react';
import { soundFX } from '../utils/soundEffects';

/**
 * Hook to protect birthday surprise content from Inspect Element, Right-Click,
 * and DevTools keyboard shortcuts.
 */
export const useSecurityProtection = () => {
  const [securityWarning, setSecurityWarning] = useState(null);

  const triggerWarning = (message = "✨ No peeking! Birthday surprises are secret! 💖") => {
    soundFX.playPop();
    setSecurityWarning(message);
    setTimeout(() => {
      setSecurityWarning(null);
    }, 2400);
  };

  useEffect(() => {
    // 1. Disable Right Click Context Menu
    const handleContextMenu = (e) => {
      // Allow right-click only inside inputs/textareas if needed
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      triggerWarning("✨ Right-click is locked to protect the surprises! 🔒💖");
    };

    // 2. Disable DevTools & View Source Keyboard Shortcuts
    const handleKeyDown = (e) => {
      // F12 key
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        triggerWarning("🔒 Inspect is disabled! Keep the surprises magical ✨");
        return false;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd) {
        // Ctrl + Shift + I (Inspect)
        // Ctrl + Shift + J (Console)
        // Ctrl + Shift + C (Element picker)
        if (e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
          e.preventDefault();
          triggerWarning("🔒 Developer tools are locked! No peeking allowed ✨");
          return false;
        }

        // Ctrl + U (View Source)
        if (e.key === 'U' || e.key === 'u') {
          e.preventDefault();
          triggerWarning("🔒 Page source is locked to protect secret notes! ✨");
          return false;
        }

        // Ctrl + S (Save Page)
        if (e.key === 'S' || e.key === 's') {
          if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            triggerWarning("✨ Everything is safely preserved in our universe! 💖");
            return false;
          }
        }
      }
    };

    // 3. Prevent dragging images onto desktop
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    // 4. Console greeting in case DevTools is accessed
    console.clear();
    console.log(
      "%c✨ A THOUSAND LITTLE REASONS ✨\n%cHey curious friend! This digital universe was crafted exclusively for her birthday.\nPlease let her discover every surprise herself! 💖",
      "color: #F47291; font-size: 20px; font-weight: bold; font-family: serif;",
      "color: #6B7280; font-size: 13px; font-family: sans-serif;"
    );

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return { securityWarning };
};

