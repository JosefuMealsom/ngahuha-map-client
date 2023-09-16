import { useRef } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import { interpolateToCanvasPosition } from '../../services/map-position-interpolator.service';
import pinSvg from '../../assets/svg/map-pin.svg';
import selectedPinSvg from '../../assets/svg/map-pin-red.svg';
import { useMapStore } from '../../store/map.store';
import { useAnimationFrame } from '../../hooks/use-animation-frame.hook';

export function MapMarker(props: PlantSite & { active: boolean }) {
  const marker = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const position = {
    latitude: props.latitude,
    longitude: props.longitude,
    accuracy: props.accuracy,
  };

  useAnimationFrame(() => {
    if (!marker.current || !imageRef.current) return;

    const newPosition = interpolateToCanvasPosition(
      position,
      useMapStore.getState(),
    );

    if (!newPosition) return;

    const zoom = useMapStore.getState().zoom;

    marker.current.classList.remove('hidden');
    marker.current.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;

    imageRef.current.style.transform = `scale(${1 / zoom}, ${1 / zoom})`;
  }, []);

  return (
    <div
      id={props.id}
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
