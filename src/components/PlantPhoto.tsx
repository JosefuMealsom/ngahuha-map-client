import type { PlantSitePhoto } from '../types/plant-site-photo.type';

export function PlantPhoto(props: PlantSitePhoto) {
  return (
    <div className="w-1/6">
      <img src={props.dataURL} className="object-contain h-40" />
      <p>{props.filename}</p>
      <p>{props.latitude}</p>
      <p>{props.longitude}</p>
      <p>{props.accuracy}</p>
    </div>
  );
}
