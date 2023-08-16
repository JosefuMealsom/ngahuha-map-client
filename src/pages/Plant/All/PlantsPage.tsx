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
    <div className="w-full h-full bg-white">
      <div
        className="px-2 sticky z-10 top-0 w-full max-w-md sm:max-w-lg pt-safe"
        data-cy="plant-list-search"
      >
        <SearchComponent<Plant>
          searchFilter={searchPlantsFilter}
          placeholder="Search plants"
          onMatchesChange={onSearchPlants}
        />
        <div className="flex">
          <div data-cy="show-all-plants">
            <ActiveFilterLinkComponent
              text="Show all"
              link="/plants"
              active={true}
              replace={true}
            />
          </div>
          <div data-cy="show-closest-plants">
            <ActiveFilterLinkComponent
              text="Closest plants"
              link="/plants/closest"
              active={false}
              replace={true}
            />
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
