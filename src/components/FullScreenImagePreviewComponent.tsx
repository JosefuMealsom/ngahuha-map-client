import { useEffect, useRef, useState } from 'react';
import closeUrl from '../assets/svg/x-white.svg';
import { PanZoomComponent } from './PanZoomComponent';

export function FullScreenImagePreviewComponent(props: {
  src: string;
  onClose: () => any;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [panBounds, setPanBounds] = useState<{
    x: { min: number; max: number };
    y: { min: number; max: number };
  }>();

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // For some reason on some pages this is needed, for instance the
    // plant site form page
    setTimeout(() => {
      node.style.transform = 'translateY(0)';
    }, 0);
    return () => {
      node.style.transform = 'translateY(100%)';
    };
  }, []);

  useEffect(() => {
    setPanBounds(calculatePanBounds());
  }, []);

  function calculatePanBounds() {
    if (!imageRef.current) return;

    const imageWtoHRatio =
      imageRef.current.naturalWidth / imageRef.current.naturalHeight;

    const yBounds = imageRef.current.width / imageWtoHRatio / 2;

    return {
      x: {
        min: -imageRef.current.width / 2,
        max: imageRef.current.width / 2,
      },
      y: {
        min: -yBounds,
        max: yBounds,
      },
    };
  }

  function onClose() {
    const node = containerRef.current;
    if (node) {
      node.style.transform = 'translateY(100%)';
      setTimeout(() => props.onClose(), 350);
    } else {
      props.onClose();
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 object-contain z-20
       duration-[350ms] ease-in-out translate-y-full overflow-hidden"
    >
      <div className="bg-black absolute top-0 left-0 w-full h-full -z-10"></div>
      <img
        src={closeUrl}
        className="absolute top-safe mt-4 right-4 h-12 w-12 z-10 rounded-full bg-gray-400 p-3"
        onClick={() => onClose()}
      />
      <PanZoomComponent panBounds={panBounds}>
        <img
          src={props.src}
          className="h-screen w-screen object-contain cursor-pointer touch-none -translate-x-1/2 -translate-y-1/2"
          draggable={false}
          ref={imageRef}
        />
      </PanZoomComponent>
    </div>
  );
}
