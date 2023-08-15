import { ReactNode, useEffect, useState } from 'react';
import { PlantSite } from '../../../types/api/plant-site.type';
import { getPlantSitesWithinDistance } from '../../../services/closest-plants.service';
import { ClosestPlantInfoComponent } from './ClosestPlantInfoComponent';
import SearchComponent from '../../../components/SearchComponent';
import { SearchPlantSitesFilter } from '../../../services/filter/search-plant-sites.fiiter';
import { SearchFilterMatch } from '../../../types/filter.type';
import { GeolocationLockOnComponent } from '../../../components/GeolocationLockOnComponent';
import { plantSiteTable, plantTable } from '../../../services/offline.database';
import { Plant } from '../../../types/api/plant.type';
import { ActiveFilterLinkComponent } from '../ActiveFilterLinkComponent';

export function ClosestPlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [plantSites, setPlantSites] = useState<PlantSite[]>([]);
  const [position, setPosition] = useState<GeolocationCoordinates>();

  const [closestPlants, setClosestPlants] =
    useState<(PlantSite & { distance: number })[]>();
  const [visiblePlantSites, setVisiblePlantSites] =
    useState<(PlantSite & { distance: number })[]>();

  const [searchPlantSitesFilter, setSearchPlantSitesFilter] =
    useState<SearchPlantSitesFilter>(new SearchPlantSitesFilter([], []));

  function onSearchPlantSites(matches: SearchFilterMatch<PlantSite>[]) {
    setPlantSites(matches.map((match) => match.data));
  }

  useEffect(() => {
    initSearchablePlantSites();
  }, []);

  useEffect(() => {
    if (!plantSites || !position) return;

    const closestPlantSites = getPlantSitesWithinDistance(
      20,
      position,
      plantSites,
    );

    setClosestPlants(closestPlantSites);
    setSearchPlantSitesFilter(
      new SearchPlantSitesFilter(closestPlantSites, plants),
    );
  }, [position, plantSites]);

  async function initSearchablePlantSites() {
    const allPlants = await plantTable.toArray();
    const allPlantSites = await plantSiteTable.toArray();

    setPlants(allPlants);
    setSearchPlantSitesFilter(
      new SearchPlantSitesFilter(allPlantSites, allPlants),
    );
  }

  return (
    <div>
      <div className="mb-4 w-full h-full pt-safe bg-white">
        <div
          className="px-2 sticky z-10 top-0 w-full max-w-md sm:max-w-lg pt-safe"
          data-cy="plant-list-search"
        >
          <SearchComponent<PlantSite>
            searchFilter={searchPlantSitesFilter}
            placeholder="Search plants"
            onMatchesChange={onSearchPlantSites}
          />
          <div className="flex">
            <ActiveFilterLinkComponent
              text="Show all"
              link="/plants"
              active={false}
              replace={true}
            />
            <ActiveFilterLinkComponent
              text="Closest plants"
              link="/plants/closest"
              active={true}
              replace={true}
            />
            <GeolocationLockOnComponent
              onGeolocationLocked={(position) => setPosition(position)}
              targetAccuracy={10}
            />
          </div>
        </div>
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
