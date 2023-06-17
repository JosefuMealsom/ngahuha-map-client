import { useEffect } from 'react';

export function useAnimationFrame(onAnimationFrame: Function) {
  useEffect(() => {
    const runAnimation = () => {
      onAnimationFrame();
      requestAnimationFrame(runAnimation);
    };

    const animId = requestAnimationFrame(runAnimation);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);
}
