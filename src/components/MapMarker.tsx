import { useRef } from 'react';
import { PlantSite } from '../types/api/plant-site.type';

export function MapMarker(props: PlantSite) {
  const marker = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={marker}
      className="w-4 h-4 bg-purple-500 absolute top-20 right-20 rounded-full"
    ></div>
  );
}
