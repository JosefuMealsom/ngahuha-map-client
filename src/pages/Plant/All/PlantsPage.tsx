import { PlantItemComponent } from './PlantItemComponent';
import { useState } from 'react';
import { Plant } from '../../../types/api/plant.type';
import { SearchPlantsFilter } from '../../../services/filter/search-plants.filter';
import SearchComponent from '../../../components/SearchComponent';
import { SearchFilterMatch } from '../../../types/filter.type';
import { ActiveFilterLinkComponent } from '../../../components/ActiveFilterLinkComponent';
import { useLoaderData } from 'react-router-dom';
import { NavigationBar } from '../../Navigation';
import { useAppStore } from '../../../store/app.store';

export function AllPlantsPage() {
  const plants = useLoaderData() as Plant[];

  const [filteredPlants, setFilteredPlants] = useState<Plant[]>(plants);
  const [searchPlantsFilter, setSearchPlantsFilter] =
    useState<SearchPlantsFilter>(new SearchPlantsFilter(plants));
  const { searchQuery, setSearchQuery } = useAppStore();

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
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />
          </div>
          <NavigationBar activePage="All Plants" />
        </div>
      </div>

      <div className="mb-4 w-full h-full bg-white overflow-scroll ">
        <div className="sm:grid sm:grid-cols-4">
          {filteredPlants?.map((plant) => (
            <div key={plant.id} data-cy={`plant-item-${plant.id}`}>
              <PlantItemComponent {...plant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
