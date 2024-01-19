import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ZoomGestureHandler } from '../services/view/zoom-gesture-handler.service';
import { PanGestureHandler } from '../services/view/pan-gesture-handler.service';
import { compose, scale, toCSS, translate } from 'transformation-matrix';
import { useAnimationFrame } from '../hooks/use-animation-frame.hook';

type PanBounds = {
  x: { min: number; max: number };
  y: { min: number; max: number };
};

type PanZoomContextProperties = {
  zoom?: number;
} | null;

export const PanZoomContext = createContext<PanZoomContextProperties>(null);

export const PanZoomComponent = (props: {
  children: ReactNode;
  pan?: { x: number; y: number };
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  panBounds?: PanBounds;
  className?: string;
}) => {
  const gestureHandlerContainerRef = useRef<HTMLDivElement>(null);
  const [panGestureHandler, setPanGestureHandler] =
    useState<PanGestureHandler>();
  const [zoomGestureHandler, setZoomGestureHandler] =
    useState<ZoomGestureHandler>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>();

  useEffect(() => {
    if (!gestureHandlerContainerRef.current) return;

    const panHandler = new PanGestureHandler(
      gestureHandlerContainerRef.current,
      props.pan?.x || 0,
      props.pan?.y || 0,
      props.panBounds,
    );

    setPanGestureHandler(panHandler);

    const zoomHandler = new ZoomGestureHandler(
      gestureHandlerContainerRef.current,
      props.zoom || 1,
      { minZoom: props.minZoom, maxZoom: props.maxZoom },
    );

    setZoomGestureHandler(zoomHandler);

    return () => {
      panHandler.removeEventListeners();
      zoomHandler.removeEventListeners();
    };
  }, []);

  useEffect(() => {
    if (!props.panBounds || !panGestureHandler) return;

    panGestureHandler.bounds = props.panBounds;
  }, [props.panBounds]);

  const onAnimationCallback = useCallback(() => {
    if (!panGestureHandler || !zoomGestureHandler) return;

    const zoom = zoomGestureHandler.update();
    // When zooming in, the panning moves too rapidly, so
    // scale it based on the zoom level.
    panGestureHandler.sensitivity = 1 / zoom + 0.2;
    const pan = panGestureHandler.update();

    const transformation = compose(
      translate(
        gestureHandlerContainerRef.current!.clientWidth / 2,
        gestureHandlerContainerRef.current!.clientHeight / 2,
      ),
      scale(zoom, zoom),
      translate(pan.x, pan.y),
    );

    const cssTransform = toCSS(transformation);

    setZoom(zoom);

    if (containerRef.current)
      containerRef.current.style.transform = cssTransform;
  }, [panGestureHandler, zoomGestureHandler]);

  useAnimationFrame(onAnimationCallback, [
    panGestureHandler,
    zoomGestureHandler,
  ]);

  return (
    <PanZoomContext.Provider value={{ zoom: zoom }}>
      <div
        draggable={false}
        className={`${
          props.className || ''
        } touch-none h-screen w-screen relative`}
        ref={gestureHandlerContainerRef}
      >
        <div ref={containerRef} className="origin-top-left relative">
          {props.children}
        </div>
      </div>
    </PanZoomContext.Provider>
  );
};
