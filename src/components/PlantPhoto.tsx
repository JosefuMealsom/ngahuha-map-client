import plantSitePhotoDatabaseService from '../services/plant-site-photo-database.service';
import type { PlantSitePhoto } from '../types/plant-site-photo.type';
import { ButtonComponent } from './ButtonComponent';

export function PlantPhoto(props: PlantSitePhoto) {
  function deletePhoto() {
    if (props.id) {
      plantSitePhotoDatabaseService.delete(props.id);
    }
  }

  return (
    <div className="w-full h-40 mb-5">
      <img
        src={props.dataURL}
        className="w-1/3 h-full object-contain inline-block ml-8 pr-8"
      />
      <div className="inline-block align-middle">
        <h1 className="font-bold">Genus</h1>
        <p>{props.species.genusName}</p>
        <h1 className="font-bold">Species</h1>
        <p>{props.species.speciesName}</p>
        <h1 className="font-bold">Cultivar</h1>
        <p>{props.species.cultivarName}</p>
      </div>
      <ButtonComponent
        onClickHandler={deletePhoto}
        className="inline-block align-middle ml-8"
        text="Delete"
      ></ButtonComponent>
    </div>
  );
}
