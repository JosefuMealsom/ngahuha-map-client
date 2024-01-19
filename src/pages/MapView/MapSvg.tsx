import mapUrl from '../../assets/svg/ngahuha-3.svg';
import { PlantSite } from '../../types/api/plant-site.type';
import { ReactNode } from 'react';

export function MapSvg(props: { children?: ReactNode | ReactNode[] }) {
  return (
    <div className="min-w-[640px] bg-[#96AF98]">
      <img draggable={false} src={mapUrl} className="pointer-events-none" />
      {props.children}
    </div>
  );
}
