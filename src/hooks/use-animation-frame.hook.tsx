import { useEffect } from 'react';

export function useAnimationFrame(
  onAnimationFrame: () => any,
  dependencies: any[],
) {
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
  }, dependencies);
}
