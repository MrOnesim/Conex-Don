import { useEffect } from 'react';
import { Howl } from 'howler';

export function useAmbientSound(src: string, volume = 0.1) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sound = new Howl({
      src: [src],
      loop: true,
      volume,
      html5: true,
    });

    const playSound = () => {
      if (!sound.playing()) sound.play();
    };
    const stopSound = () => sound.stop();

    // Only play if user has not reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) playSound();
      else stopSound();
    };
    mediaQuery.addEventListener('change', handleChange);
    if (mediaQuery.matches) playSound();

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      sound.stop();
    };
  }, [src, volume]);
}
