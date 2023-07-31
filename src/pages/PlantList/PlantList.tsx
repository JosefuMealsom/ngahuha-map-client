import { plantSiteTable, plantTable } from '../../services/offline.database';
import { PlantItemComponent } from './PlantItemComponent';
import { useEffect, useState } from 'react';
import { Plant } from '../../types/api/plant.type';
import AutocompleteComponent from '../../components/AutocompleteComponent';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
import SearchComponent from '../../components/SearchComponent';

export function PlantList() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [visiblePlants, setVisiblePlants] = useState<Plant[]>([]);
  const [filterItems, setFilterItems] = useState<string[]>([]);

  async function getPlants() {
    const plantSites = await plantSiteTable.toArray();

    const plantIdsWithPlantSites = Array.from(
      new Set(plantSites.map((plantSite) => plantSite.plantId)),
    );

    const allPlants = await plantTable.toArray();
    const plantsWithPhotos = allPlants.filter((plant) =>
      plantIdsWithPlantSites.includes(plant.id),
    );

    const remainingPlants = allPlants.filter(
      (plant) => !plantIdsWithPlantSites.includes(plant.id),
    );

    const sortedPlants = plantsWithPhotos.concat(remainingPlants);
    setPlants(sortedPlants);
    setVisiblePlants(sortedPlants);
    setFilterItems(sortedPlants.map((plant) => getFullPlantName(plant)));
  }

  useEffect(() => {
    getPlants();
  }, []);

  function searchPlants(textMatches: string[]) {
    if (textMatches.length === 0) {
      setVisiblePlants(plants);
      return;
    }

    const visiblePlants = plants.filter((plant) =>
      textMatches.includes(getFullPlantName(plant)),
    );

    setVisiblePlants(visiblePlants);
  }

  return (
    <div>
      <div className="mb-4 w-full h-full overflow-scroll absolute top-0 left-0 pt-safe bg-white">
        <div
          className="px-2 sticky top-1 z-10 w-full max-w-md"
          data-cy="plant-list-search"
        >
          <SearchComponent
            items={filterItems}
            placeholder="Search plants"
            onTextMatchesChange={searchPlants}
          />
        </div>
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
