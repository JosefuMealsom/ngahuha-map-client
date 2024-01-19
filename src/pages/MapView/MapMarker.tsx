import { useContext, useRef } from 'react';
import { interpolateToCanvasPosition } from '../../services/map-position-interpolator.service';
import pinSvg from '../../assets/svg/map-pin.svg';
import selectedPinSvg from '../../assets/svg/map-pin-red.svg';
import { useMapStore } from '../../store/map.store';
import { useAnimationFrame } from '../../hooks/use-animation-frame.hook';
import { PanZoomContext } from '../../components/PanZoomComponent';
import { LatLong } from '../../types/lat-long.type';

export function MapMarker(props: LatLong & { active: boolean }) {
  const marker = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const position = {
    latitude: props.latitude,
    longitude: props.longitude,
    accuracy: props.accuracy,
  };

  const panZoomContext = useContext(PanZoomContext);

  useAnimationFrame(() => {
    if (!marker.current || !imageRef.current) return;

    const newPosition = interpolateToCanvasPosition(
      position,
      useMapStore.getState(),
    );

    if (!newPosition) return;

    const zoom = panZoomContext?.zoom;

    marker.current.classList.remove('hidden');
    marker.current.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;

    if (zoom) {
      imageRef.current.style.transform = `scale(${1 / zoom}, ${1 / zoom})`;
    }
  }, [panZoomContext]);

  return (
    <div
      ref={marker}
      className={`fill-white absolute -top-6 -left-3 h-6 w-6 hidden ${
        props.active ? 'z-10' : ''
      }`}
      data-cy="map-marker"
    >
      <img
        ref={imageRef}
        src={props.active ? selectedPinSvg : pinSvg}
        className="select-none h-full pointer-events-none origin-center"
      />
    </div>
  );
}
