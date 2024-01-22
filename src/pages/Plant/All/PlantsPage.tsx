import { PlantItemComponent } from './PlantItemComponent';
import { useState } from 'react';
import { Plant } from '../../../types/api/plant.type';
import SearchComponent from '../../../components/SearchComponent';
import { SearchFilterMatch } from '../../../types/filter.type';
import { useLoaderData } from 'react-router-dom';
import { NavigationBar } from '../../Navigation/NavigationBar';
import { useAppStore } from '../../../store/app.store';
import { SearchPlantsFilter } from '../../../services/filter/search-plants.filter';
import { useMapStore } from '../../../store/map.store';

export function AllPlantsPage() {
  const { plants } = useLoaderData() as {
    plants: Plant[];
  };

  const [filteredItems, setFilteredItems] = useState<Plant[]>([...plants]);
  const [searchPlantsFilter] = useState<SearchPlantsFilter>(
    new SearchPlantsFilter(plants),
  );
  const { searchQuery, setSearchQuery } = useAppStore();
  const { setMapCarouselPosition } = useMapStore();

  function onSearchPlantAndFeatures(matches: SearchFilterMatch<Plant>[]) {
    setFilteredItems(matches.map((match) => match.data));
  }

  return (
    <div className="w-full h-full pt-safe relative">
      <div className="sticky top-safe z-10">
        <div className="bg-forest pt-safe absolute top-0 left-0 w-full -translate-y-full"></div>
        <div className="px-4 z-10 pt-2 w-full max-w-md sm:max-w-lg">
          <div data-cy="plant-list-search" className="pb-2">
            <SearchComponent<Plant>
              searchFilter={searchPlantsFilter}
              placeholder="Search plants"
              onMatchesChange={onSearchPlantAndFeatures}
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(value);
                setMapCarouselPosition(0);
              }}
            />
          </div>
          <NavigationBar activePage="All Plants" />
        </div>
      </div>

      <div className="mb-4 w-full h-full bg-white overflow-scroll">
        <div className="sm:grid sm:grid-cols-4">
          {filteredItems?.map((item) => (
            <div key={item.id} data-cy={`plant-item-${item.id}`}>
              <PlantItemComponent {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
