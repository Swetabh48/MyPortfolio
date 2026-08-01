import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const update = () => {
      setReduced(motionQuery.matches);
      setIsMobile(mobileQuery.matches);
    };

    update();
    motionQuery.addEventListener('change', update);
    mobileQuery.addEventListener('change', update);
    return () => {
      motionQuery.removeEventListener('change', update);
      mobileQuery.removeEventListener('change', update);
    };
  }, []);

  return { reduced, isMobile, disableHeavy3D: reduced || isMobile };
}
