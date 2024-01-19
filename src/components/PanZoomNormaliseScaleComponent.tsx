import { ReactNode, useContext, useRef } from 'react';
import { PanZoomContext } from './PanZoomComponent';
import { useAnimationFrame } from '../hooks/use-animation-frame.hook';

export const PanZoomNormaliseScaleComponent = (props: {
  children: ReactNode;
}) => {
  const panZoomContext = useContext(PanZoomContext);
  const containerRef = useRef<HTMLDivElement>(null);

  useAnimationFrame(() => {
    if (!containerRef.current) return;

    const zoom = panZoomContext?.zoom;

    if (zoom) {
      containerRef.current.style.transform = `scale(${1 / zoom}, ${1 / zoom})`;
    }
  }, [panZoomContext]);

  return (
    <div className="absolute top-0 left-0" ref={containerRef}>
      {props.children}
    </div>
  );
};
