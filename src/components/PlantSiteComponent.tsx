import { useEffect, useState } from 'react';
import type { Plant } from '../types/api/plant.type';
import type { PlantSiteUpload } from '../types/api/upload/plant-site-upload.type';
import {
  plantSitePhotoUploadTable,
  plantTable,
} from '../services/offline.database';
import { getFullPlantName } from '../utils/plant-name-decorator.util';
import blobToDataUrlService from '../services/blob-to-data-url.service';
import { deletePlantSite } from '../services/api/plant-site-upload.service';
import trashSvg from '../assets/svg/trash-2.svg';

export function PlantSiteComponent(
  props: PlantSiteUpload & { isUploading: boolean },
) {
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [plant, setPlant] = useState<Plant>();

  const getPlantInfo = async () => {
    const plant = await plantTable.get(props.plantId);

    if (!plant) return;

    const photo = await plantSitePhotoUploadTable.get({
      plantSiteUploadId: props.id,
    });

    if (!photo) return;

    const blobData = new Blob([photo.data]);
    setPhotoDataUrl((await blobToDataUrlService.convert(blobData)) || '');

    setPlant(plant);
  };

  function deletePhoto() {
    if (props.id) deletePlantSite(props.id);
  }

  useEffect(() => {
    getPlantInfo();
  });

  function renderDelete() {
    if (props.isUploading) return;

    return (
      <img
        src={trashSvg}
        className="h-6 inline-block ml-6 cursor-pointer"
        onClick={deletePhoto}
        data-cy={`delete-plant-${props.id}`}
      />
    );
  }

  function renderPlantInfo() {
    if (!plant) return;

    return (
      <div className="flex">
        <img
          src={photoDataUrl}
          className="w-1/4 h-full object-contain inline-block ml-2 pr-8"
        />
        <div className="w-3/4 inline-block align-top">
          <h1 className="font-bold">Plant Species</h1>
          <p className="inline-block">{getFullPlantName(plant)}</p>
          {renderDelete()}
        </div>
      </div>
    );
  }

  return <div className="w-full mb-5">{renderPlantInfo()}</div>;
}
