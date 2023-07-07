import { useEffect, useState } from 'react';
import type { Plant } from '../types/api/plant.type';
import { plantTable } from '../services/offline.database';
import { PlantSite } from '../types/api/plant-site.type';
import { getFullPlantName } from '../utils/plant-name-decorator.util';

export function ClosestPlantInfoComponent(props: PlantSite) {
  const [plant, setPlant] = useState<Plant>();

  const getPlantInfo = async () => {
    const plant = await plantTable.get(props.plantId);

    if (!plant) return;

    setPlant(plant);
  };

  getPlantInfo();

  function renderPlantInfo() {
    if (!plant) return;

    return (
      <div className="flex">
        <div className="w-3/4 inline-block align-top">
          <h1 className="font-bold">Plant Species</h1>
          <p className="inline-block">{getFullPlantName(plant)}</p>
        </div>
      </div>
    );
  }

  return <div className="w-full mb-5">{renderPlantInfo()}</div>;
}
