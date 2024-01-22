import { useEffect, useState } from 'react';
import { Plant } from '../types/api/plant.type';
import { plantSiteTable, plantTable } from '../services/offline.database';
import { useLiveQuery } from 'dexie-react-hooks';
import { partition } from 'underscore';

export function usePlantsWithPhotos() {
  const plants = useLiveQuery(() => plantTable.toArray());
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());

  const [plantsWithPhotos, setPlantsWithPhotos] = useState<Plant[]>([]);

  useEffect(() => {
    if (!plants || !plantSites) return;

    const plantIdsWithPhotos = Array.from(
      new Set(plantSites.map((plantSite) => plantSite.plantId)),
    );

    const [plantsWithPhotos, _] = partition(plants, (plant) =>
      plantIdsWithPhotos.includes(plant.id),
    );

    setPlantsWithPhotos(plantsWithPhotos);
  }, [plantSites]);

  return plantsWithPhotos;
}
