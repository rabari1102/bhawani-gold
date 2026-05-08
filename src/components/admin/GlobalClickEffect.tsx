'use client';
import { useEffect, useState } from 'react';

interface ClickDot {
  id: number;
  x: number;
  y: number;
}

export default function GlobalClickEffect() {
  const [dots, setDots] = useState<ClickDot[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setDots((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);

      // Remove the dot after the animation duration (e.g., 600ms)
      setTimeout(() => {
        setDots((prev) => prev.filter((dot) => dot.id !== id));
      }, 600);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {dots.map((dot) => (
        <span
          key={dot.id}
          className="absolute rounded-full bg-black/30 dark:bg-white/30 animate-ping-short"
          style={{
            left: dot.x - 10,
            top: dot.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
    </div>
  );
}
