import { useCallback, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

interface TiltOptions {
  /** Maximum rotation in degrees on each axis. */
  strength?: number;
  /** Distance the highlight travels, as a share of the element size. */
  glow?: boolean;
}

/**
 * Gives an element a subtle cursor-tracked tilt plus a highlight that follows the
 * pointer, so hovering feels physical instead of static.
 */
export function usePointerTilt({ strength = 6, glow = true }: TiltOptions = {}) {
  const frame = useRef<number | undefined>(undefined);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        element.style.transform = `perspective(1100px) translateY(-6px) rotateY(${(x - 0.5) * strength}deg) rotateX(${(0.5 - y) * strength}deg)`;
        if (glow) {
          element.style.setProperty('--tilt-x', `${x * 100}%`);
          element.style.setProperty('--tilt-y', `${y * 100}%`);
        }
      });
    },
    [glow, strength],
  );

  const onPointerLeave = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const element = event.currentTarget;
    if (frame.current) cancelAnimationFrame(frame.current);
    element.style.transform = 'perspective(1100px) translateY(0px) rotateY(0deg) rotateX(0deg)';
  }, []);

  return { onPointerMove, onPointerLeave };
}
