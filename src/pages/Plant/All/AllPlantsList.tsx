import { plantSiteTable } from '../../../services/offline.database';
import { PlantItemComponent } from './PlantItemComponent';
import { useEffect, useState } from 'react';
import { Plant } from '../../../types/api/plant.type';

export function AllPlantsList(props: { plants: Plant[] }) {
  const { plants } = props;
  const [visiblePlants, setVisiblePlants] = useState<Plant[]>([]);

  async function getPlants() {
    const plantSites = await plantSiteTable.toArray();

    const plantIdsWithPlantSites = Array.from(
      new Set(plantSites.map((plantSite) => plantSite.plantId)),
    );

    const plantsWithPhotos = plants.filter((plant) =>
      plantIdsWithPlantSites.includes(plant.id),
    );

    const remainingPlants = plants.filter(
      (plant) => !plantIdsWithPlantSites.includes(plant.id),
    );

    const sortedPlants = plantsWithPhotos.concat(remainingPlants);
    setVisiblePlants(sortedPlants);
  }

  useEffect(() => {
    getPlants();
  }, [plants]);

  return (
    <div>
      <div className="mb-4 w-full h-full pt-safe bg-white">
        <div className="sm:grid sm:grid-cols-4">
          {visiblePlants?.map((plant) => (
            <div data-cy={`plant-item-${plant.id}`}>
              <PlantItemComponent key={plant.id} {...plant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
