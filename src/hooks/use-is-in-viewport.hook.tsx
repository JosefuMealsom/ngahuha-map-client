import { RefObject, useEffect, useMemo, useState } from 'react';

export const useIsInViewport = (ref: RefObject<HTMLElement>) => {
  const [inViewport, setInViewPort] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setInViewPort(entry.isIntersecting),
      ),
    [],
  );

  useEffect(() => {
    if (!ref.current) return;

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return inViewport;
};
