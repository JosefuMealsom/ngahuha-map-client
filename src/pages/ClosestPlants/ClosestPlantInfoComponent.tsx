import { useEffect, useState } from 'react';
import type { Plant } from '../../types/api/plant.type';
import {
  plantTable,
  plantSitePhotoTable,
} from '../../services/offline.database';
import { PlantSite } from '../../types/api/plant-site.type';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
import blobToDataUrlService from '../../services/blob-to-data-url.service';

export function ClosestPlantInfoComponent(
  props: PlantSite & { distance: number },
) {
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
    const blobData = new Blob([photo.data]);
    setPhotoDataUrl((await blobToDataUrlService.convert(blobData)) || '');
  };

  useEffect(() => {
    getPlantInfo();
  }, []);

  function renderPlantInfo() {
    if (!plant) return;

    return (
      <div className="h-full sm:h-96 cursor-pointer hover:opacity-90 bg-white">
        <div className="w-full h-full align-top relative">
          <img src={photoDataUrl} className="w-full h-full object-cover" />

          <div className="absolute top-0 p-3 bg-black bg-opacity-40 w-full">
            <p className="text-white font-bold text-2xl">
              {getFullPlantName(plant)}
            </p>
            <p className="text-white">{props.distance.toFixed(1)}m away</p>
          </div>
        </div>
      </div>
    );
  }

  return <div className="w-full">{renderPlantInfo()}</div>;
}
