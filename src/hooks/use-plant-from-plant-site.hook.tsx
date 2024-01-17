import { useEffect, useState } from 'react';
import { Plant } from '../types/api/plant.type';
import { plantSiteTable, plantTable } from '../services/offline.database';

export function usePlantFromPlantSite(plantSiteId: string) {
  const [plant, setPlant] = useState<Plant>();

  const getPlantInfo = async () => {
    const plantSite = await plantSiteTable.get(plantSiteId);

    if (!plantSite) return;

    const plant = await plantTable.get(plantSite.plantId);
    setPlant(plant);
  };

  useEffect(() => {
    getPlantInfo();
  }, []);

  return plant;
}
