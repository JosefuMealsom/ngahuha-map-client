import { plantSiteTable, plantTable } from '../../../services/offline.database';
import { PlantItemComponent } from './PlantItemComponent';
import { useEffect, useState } from 'react';
import { Plant } from '../../../types/api/plant.type';
import { SearchPlantsFilter } from '../../../services/filter/search-plants.filter';
import SearchComponent from '../../../components/SearchComponent';
import { SearchFilterMatch } from '../../../types/filter.type';
import { partition } from 'underscore';
import { ActiveFilterLinkComponent } from '../ActiveFilterLinkComponent';

export function AllPlantsPage() {
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [searchPlantsFilter, setSearchPlantsFilter] =
    useState<SearchPlantsFilter>(new SearchPlantsFilter([]));
  const [visiblePlants, setVisiblePlants] = useState<Plant[]>([]);

  useEffect(() => {
    initSearchablePlants();
  }, []);

  useEffect(() => {
    updateVisiblePlants();
  }, [filteredPlants]);

  async function initSearchablePlants() {
    const allPlants = await plantTable.toArray();
    setFilteredPlants(allPlants);
    setSearchPlantsFilter(new SearchPlantsFilter(allPlants));
  }

  async function updateVisiblePlants() {
    const plantSites = await plantSiteTable.toArray();

    const plantIdsWithPhotos = Array.from(
      new Set(plantSites.map((plantSite) => plantSite.plantId)),
    );

    const [plantsWithPhotos, plantsWithoutPhotos] = partition(
      filteredPlants,
      (plant) => plantIdsWithPhotos.includes(plant.id),
    );

    const sortedPlants = plantsWithPhotos.concat(plantsWithoutPhotos);
    setVisiblePlants(sortedPlants);
  }

  function onSearchPlants(matches: SearchFilterMatch<Plant>[]) {
    setFilteredPlants(matches.map((match) => match.data));
  }

  return (
    <div className="w-full h-full bg-background pt-safe">
      <div className="sticky top-safe z-10">
        <div className="px-4 z-10 pt-2 w-full max-w-md sm:max-w-lg">
          <div data-cy="plant-list-search" className="pb-2">
            <SearchComponent<Plant>
              searchFilter={searchPlantsFilter}
              placeholder="Search plants"
              onMatchesChange={onSearchPlants}
            />
          </div>
          <div className="flex mb-2">
            <div className="mr-1">
              <ActiveFilterLinkComponent
                text="All"
                link="/plants"
                active={true}
                replace={true}
              />
            </div>
            <div>
              <ActiveFilterLinkComponent
                text="Closest"
                link="/plants/closest"
                active={false}
                replace={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 w-full h-full bg-white overflow-scroll ">
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
