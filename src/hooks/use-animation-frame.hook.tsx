import { useEffect } from 'react';

export function useAnimationFrame(onAnimationFrame: Function) {
  useEffect(() => {
    let animId: number;
    const runAnimation = () => {
      onAnimationFrame();
      animId = requestAnimationFrame(runAnimation);
    };

    animId = requestAnimationFrame(runAnimation);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);
}
