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
        className="w-40 h-full object-contain inline-block ml-8 pr-8"
      />
      <div className="inline-block">
        <p>{props.filename}</p>
        <ButtonComponent
          onClickHandler={deletePhoto}
          className=""
          text="Delete"
        ></ButtonComponent>
      </div>
    </div>
  );
}
