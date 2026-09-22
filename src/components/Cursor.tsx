import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const follower = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      cursor.current!.style.left = `${e.pageX}px`;
      cursor.current!.style.top = `${e.pageY}px`;

      // slight delay for the follower (effet de traînée)
      setTimeout(() => {
        follower.current!.style.left = `${e.pageX}px`;
        follower.current!.style.top = `${e.pageY}px`;
      }, 50);
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  return (
    <>
      <div
        ref={cursor}
        className="pointer-none fixed left-[-10px] top-[-10px] w-4 h-4 bg-gold/50 rounded-full mix-blend-difference pointer-events-none z-[9999] transition-transform duration-200"
      />
      <div
        ref={follower}
        className="pointer-none fixed left-[-12px] top-[-12px] w-8 h-8 border-2 border-gold/30 rounded-full mix-blend-difference pointer-events-none z-[9998] opacity-0 transition-opacity duration-300"
      />
    </>
  );
}
