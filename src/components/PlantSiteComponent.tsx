import { useEffect, useState } from 'react';
import type { Plant } from '../types/api/plant.type';
import type { PlantSiteUpload } from '../types/api/upload/plant-site-upload.type';
import { ButtonComponent } from './ButtonComponent';
import {
  plantSitePhotoUploadTable,
  plantTable,
} from '../services/offline.database';
import { getFullPlantName } from '../utils/plant-name-decorator.util';
import blobToDataUrlService from '../services/blob-to-data-url.service';
import { deletePlantSite } from '../services/api/plant-site-upload.service';

export function PlantSiteComponent(props: PlantSiteUpload) {
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [plant, setPlant] = useState<Plant>();

  const getPlantInfo = async () => {
    const plant = await plantTable.get(props.plantId);
    if (!plant) {
      return;
    }

    const photo = await plantSitePhotoUploadTable.get({
      plantSiteId: props.id,
    });
    if (!photo) {
      return;
    }

    setPhotoDataUrl((await blobToDataUrlService.convert(photo.data)) || '');
    setPlant(plant);
  };

  function deletePhoto() {
    if (props.id) {
      deletePlantSite(props.id);
    }
  }

  useEffect(() => {
    getPlantInfo();
  }, [props]);

  function renderPlantInfo() {
    if (!plant) {
      return;
    }

    return (
      <div className="flex">
        <img
          src={photoDataUrl}
          className="w-1/4 h-full object-contain inline-block ml-8 pr-8"
        />
        <div className="w-3/4 inline-block align-top">
          <h1 className="font-bold">Plant Species</h1>
          <p className="block">{getFullPlantName(plant)}</p>
          <ButtonComponent
            onClickHandler={deletePhoto}
            className="block"
            text="Delete"
          ></ButtonComponent>
        </div>
      </div>
    );
  }

  return <div className="w-full mb-5">{renderPlantInfo()}</div>;
}
