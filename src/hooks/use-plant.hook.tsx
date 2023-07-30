import { useEffect, useState } from 'react';
import { Plant } from '../types/api/plant.type';
import { plantTable } from '../services/offline.database';

export function usePlant(plantId: string) {
  const [plant, setPlant] = useState<Plant>();

  const getPlantInfo = async () => {
    const plant = await plantTable.get(plantId);

    if (!plant) return;

    setPlant(plant);
  };

  useEffect(() => {
    getPlantInfo();
  }, []);

  return plant;
}
