import { useState } from 'react';
import { Plant } from '../../../types/api/plant.type';
import SearchComponent from '../../../components/SearchComponent';
import { SearchFilterMatch } from '../../../types/filter.type';
import { useLoaderData } from 'react-router-dom';
import { SearchPlantSitesFilter } from '../../../services/filter/search-plant-sites.filter';
import { PlantSite } from '../../../types/api/plant-site.type';
import { PlantSiteListItemComponent } from '../PlantSiteListItemComponent';

export function AllPlantSitesPage() {
  const { plants, plantSites } = useLoaderData() as {
    plants: Plant[];
    plantSites: PlantSite[];
  };

  const [searchPlantsFilter] = useState<SearchPlantSitesFilter>(
    new SearchPlantSitesFilter(plantSites, plants),
  );

  const [filteredPlantSites, setFilteredPlantSites] =
    useState<PlantSite[]>(plantSites);

  function onSearchAllPlantSites(matches: SearchFilterMatch<PlantSite>[]) {
    setFilteredPlantSites(matches.map((match) => match.data));
  }

  return (
    <div className="w-full h-full bg-background pt-safe">
      <div className="sticky top-safe z-10">
        <div className="px-4 z-10 pt-2 w-full max-w-md sm:max-w-lg">
          <div data-cy="plant-list-search" className="pb-2">
            <SearchComponent<PlantSite>
              searchFilter={searchPlantsFilter}
              placeholder="Search all plant sites"
              onMatchesChange={onSearchAllPlantSites}
            />
          </div>
        </div>
      </div>

      <div className="mb-4 w-full h-full bg-white overflow-scroll ">
        <div className="sm:grid sm:grid-cols-4">
          {filteredPlantSites?.map((plantSite) => (
            <div key={plantSite.id} data-cy={`plant-item-${plantSite.id}`}>
              <PlantSiteListItemComponent {...plantSite} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
