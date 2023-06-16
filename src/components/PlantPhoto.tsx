import type { PlantSitePhoto } from '../types/plant-site-photo-type';

export function PlantPhoto(props: PlantSitePhoto) {
  return (
    <div className="w-1/6">
      <img src={props.dataURL} className="object-contain h-40" />
      <p>{props.filename}</p>
      <p>{props.lat}</p>
      <p>{props.long}</p>
      <p>{props.accuracy}</p>
    </div>
  );
}
