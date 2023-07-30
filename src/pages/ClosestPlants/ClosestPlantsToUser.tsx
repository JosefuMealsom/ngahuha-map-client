import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteTable } from '../../services/offline.database';
import { usePosition } from '../../hooks/use-position.hook';
import { useEffect, useRef, useState } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import { getPlantSitesWithinDistance } from '../../services/closest-plants.service';
import { ClosestPlantInfoComponent } from './ClosestPlantInfoComponent';

export function ClosestPlantsToUser() {
  const [closestPlants, setClosestPlants] =
    useState<(PlantSite & { distance: number })[]>();
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());
  const position = usePosition();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getClosestPlants();
  }, [position]);

  function getClosestPlants() {
    if (!position || !plantSites) return;

    setClosestPlants(getPlantSitesWithinDistance(20, position, plantSites));
  }

  return (
    <div>
      <div
        className={
          'mb-4 w-full h-full overflow-scroll absolute top-0 left-0 pt-safe bg-white'
        }
        ref={pageRef}
      >
        <div className="sm:grid sm:grid-cols-4">
          {closestPlants?.map((plantSite) => (
            <ClosestPlantInfoComponent
              key={plantSite.id}
              {...plantSite}
            ></ClosestPlantInfoComponent>
          ))}
        </div>
      </div>
    </div>
  );
}
