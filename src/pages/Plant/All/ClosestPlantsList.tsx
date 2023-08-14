import { useEffect, useState } from 'react';
import { PlantSite } from '../../../types/api/plant-site.type';
import { getPlantSitesWithinDistance } from '../../../services/closest-plants.service';
import { ClosestPlantInfoComponent } from './ClosestPlantInfoComponent';

export function ClosestPlantsList(props: {
  position?: GeolocationCoordinates;
  plantSites: PlantSite[];
}) {
  const [closestPlants, setClosestPlants] =
    useState<(PlantSite & { distance: number })[]>();

  useEffect(() => {
    if (!props.plantSites || !props.position) return;

    setClosestPlants(
      getPlantSitesWithinDistance(20, props.position, props.plantSites),
    );
  }, [props.position, props.plantSites]);

  return (
    <div>
      <div className="mb-4 w-full h-full pt-safe bg-white">
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
