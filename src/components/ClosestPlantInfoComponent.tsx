import { useEffect, useState } from 'react';
import type { Plant } from '../types/api/plant.type';
import { plantTable, plantSitePhotoTable } from '../services/offline.database';
import { PlantSite } from '../types/api/plant-site.type';
import { getFullPlantName } from '../utils/plant-name-decorator.util';
import blobToDataUrlService from '../services/blob-to-data-url.service';

export function ClosestPlantInfoComponent(props: PlantSite) {
  const [plant, setPlant] = useState<Plant>();
  const [photoDataUrl, setPhotoDataUrl] = useState('');

  const getPlantInfo = async () => {
    const plant = await plantTable.get(props.plantId);

    if (!plant) return;

    setPlant(plant);

    const photo = await plantSitePhotoTable
      .where({
        plantSiteId: props.id,
      })
      .first();

    if (!photo) return;

    setPhotoDataUrl((await blobToDataUrlService.convert(photo.data)) || '');
  };

  getPlantInfo();

  function renderPlantInfo() {
    if (!plant) return;

    return (
      <div className="flex">
        <div className="w-3/4 inline-block align-top">
          <h1 className="font-bold">Plant Species</h1>
          <img
            src={photoDataUrl}
            className="w-1/4 h-full object-contain inline-block ml-2 pr-8"
          />
          <p className="inline-block">{getFullPlantName(plant)}</p>
        </div>
      </div>
    );
  }

  return <div className="w-full mb-5">{renderPlantInfo()}</div>;
}
