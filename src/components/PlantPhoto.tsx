export function PlantPhoto(props: PlantSitePhoto) {
  return (
    <div className="w-1/6">
      <img src={props.dataURL} className="object-contain h-40" />
      <p>{props.filename}</p>
    </div>
  );
}
