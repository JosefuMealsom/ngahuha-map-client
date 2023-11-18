import { useCallback, useEffect, useRef, useState } from 'react';
import { PanGestureHandler } from '../services/view/pan-gesture-handler.service';
import { ZoomGestureHandler } from '../services/view/zoom-gesture-handler.service';
import { compose, scale, toCSS, translate } from 'transformation-matrix';
import { useAnimationFrame } from '../hooks/use-animation-frame.hook';
import closeUrl from '../assets/svg/x-white.svg';

export function FullScreenImagePreviewComponent(props: {
  src: string;
  onClose: () => any;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [panGestureHandler, setPanGestureHandler] =
    useState<PanGestureHandler>();
  const [zoomGestureHandler, setZoomGestureHandler] =
    useState<ZoomGestureHandler>();

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
    if (!containerRef.current) return;
    const panHandler = new PanGestureHandler(containerRef.current, 0, 0);

    setPanGestureHandler(panHandler);

    const zoomHandler = new ZoomGestureHandler(containerRef.current, 1);

    setZoomGestureHandler(zoomHandler);

    return () => {
      panHandler.removeEventListeners();
      zoomHandler.removeEventListeners();
    };
  }, []);

  const onAnimationCallback = useCallback(() => {
    if (!panGestureHandler || !zoomGestureHandler) return;

    const pan = panGestureHandler.update();
    const zoom = zoomGestureHandler.update();

    const mapTransformation = compose(
      // translate(window.innerWidth / 2, window.innerHeight / 2),
      scale(zoom, zoom),
      translate(pan.x, pan.y),
    );

    const cssTransform = toCSS(mapTransformation);

    if (imageRef.current) imageRef.current.style.transform = cssTransform;
  }, [panGestureHandler, zoomGestureHandler]);

  useAnimationFrame(onAnimationCallback, [
    panGestureHandler,
    zoomGestureHandler,
  ]);

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
      className="fixed top-0 left-0 w-screen h-screen object-contain z-20
       duration-[350ms] ease-in-out translate-y-full"
    >
      <div className="bg-black absolute top-0 left-0 w-full h-full -z-10"></div>
      <img
        src={closeUrl}
        className="absolute top-safe mt-4 right-4 h-12 w-12 z-10 rounded-full bg-gray-400 p-3"
        onClick={() => onClose()}
      />
      <img
        src={props.src}
        className="w-full h-full object-contain cursor-pointer touch-none"
        ref={imageRef}
        draggable={false}
      />
    </div>
  );
}
