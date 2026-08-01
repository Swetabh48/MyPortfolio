import { useEffect, useState } from 'react';

export function InteractionLayer() {
  const [progress, setProgress] = useState(0);
  const [cursor, setCursor] = useState({ x: -100, y: -100, active: false });

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setProgress(window.scrollY / max);
    };
    const onMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      setCursor({
        x: event.clientX,
        y: event.clientY,
        active: Boolean(target?.closest('a, button, [data-cursor]')),
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <>
      <div className="fixed right-5 top-1/2 z-[60] hidden h-32 -translate-y-1/2 md:block">
        <span className="absolute right-0 top-0 h-full w-px bg-white/15" />
        <span
          className="absolute right-0 top-0 w-px bg-cyan-300 transition-[height] duration-150"
          style={{ height: `${progress * 100}%` }}
        />
        <span className="absolute -right-1.5 -bottom-7 text-[9px] tracking-[0.16em] text-white/35">
          {String(Math.round(progress * 100)).padStart(2, '0')}
        </span>
      </div>
      <div
        className={`pointer-events-none fixed left-0 top-0 z-[100] hidden rounded-full border mix-blend-difference md:block ${
          cursor.active
            ? 'h-14 w-14 border-white bg-white/20'
            : 'h-3 w-3 border-white/70 bg-white'
        }`}
        style={{
          transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate(-50%, -50%)`,
          transition: 'width 180ms ease, height 180ms ease, background 180ms ease',
        }}
      />
    </>
  );
}
