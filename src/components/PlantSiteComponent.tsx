import { useEffect, useState } from 'react';
import type { Plant } from '../types/api/plant.type';
import type { PlantSite } from '../types/api/plant-site.type';
import { ButtonComponent } from './ButtonComponent';
import offlineDatabase, { plantTable } from '../services/offline.database';
import { getFullPlantName } from '../utils/plant-name-decorator.util';

export function PlantSiteComponent(props: PlantSite) {
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [plant, setPlant] = useState<Plant>();

  const getPlantInfo = async () => {
    const plant = await plantTable.get(props.plantId);

    if (!plant) {
      return;
    }

    setPlant(plant);
  };

  function editPhoto() {}

  useEffect(() => {
    getPlantInfo();
  }, []);

  function renderPlantInfo() {
    if (!plant) {
      return;
    }

    return (
      <div>
        <h1 className="font-bold">Species</h1>
        <p>
          <span>{getFullPlantName(plant)}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-40 mb-5">
      <div className="inline-block align-middle">{renderPlantInfo()}</div>
      <ButtonComponent
        onClickHandler={editPhoto}
        className="absolute right-4 text-right"
        text="Edit"
      ></ButtonComponent>
    </div>
  );
}
