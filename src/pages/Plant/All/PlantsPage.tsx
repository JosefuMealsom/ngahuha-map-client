import { PlantItemComponent } from './PlantItemComponent';
import { useState } from 'react';
import { Plant } from '../../../types/api/plant.type';
import SearchComponent from '../../../components/SearchComponent';
import { SearchFilterMatch } from '../../../types/filter.type';
import { useLoaderData } from 'react-router-dom';
import { NavigationBar } from '../../Navigation/NavigationBar';
import { useAppStore } from '../../../store/app.store';
import { Feature } from '../../../types/api/feature.type';
import { FeatureItemComponent } from './FeatureItemComponent';
import { SearchPlantsAndFeaturesFilter } from '../../../services/filter/search-plants-and-features.filter';

export function AllPlantsPage() {
  const { plants, features } = useLoaderData() as {
    plants: Plant[];
    features: Feature[];
  };

  const items = [...plants, ...features];

  const [filteredItems, setFilteredPlants] = useState<(Plant | Feature)[]>([
    ...plants,
    ...features,
  ]);
  const [searchPlantsFilter] = useState<SearchPlantsAndFeaturesFilter>(
    new SearchPlantsAndFeaturesFilter(items),
  );
  const { searchQuery, setSearchQuery } = useAppStore();

  function onSearchPlantAndFeatures(
    matches: SearchFilterMatch<Plant | Feature>[],
  ) {
    setFilteredPlants(matches.map((match) => match.data));
  }

  function renderPlantOrFeatureItem(item: Plant | Feature) {
    if (isPlant(item)) {
      return (
        <div key={item.id} data-cy={`plant-item-${item.id}`}>
          <PlantItemComponent {...item} />
        </div>
      );
    }
    return (
      <div key={item.id} data-cy={`feature-item-${item.id}`}>
        <FeatureItemComponent {...item} />
      </div>
    );
  }

  function isPlant(item: Plant | Feature): item is Plant {
    return (item as Plant).species !== undefined;
  }

  return (
    <div className="w-full h-full bg-background pt-safe">
      <div className="sticky top-safe z-10">
        <div className="px-4 z-10 pt-2 w-full max-w-md sm:max-w-lg">
          <div data-cy="plant-list-search" className="pb-2">
            <SearchComponent<Plant | Feature>
              searchFilter={searchPlantsFilter}
              placeholder="Search plants"
              onMatchesChange={onSearchPlantAndFeatures}
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />
          </div>
          <NavigationBar activePage="All Plants" />
        </div>
      </div>

      <div className="mb-4 w-full h-full bg-white overflow-scroll ">
        <div className="sm:grid sm:grid-cols-4">
          {filteredItems?.map((item) => renderPlantOrFeatureItem(item))}
        </div>
      </div>
    </div>
  );
}
