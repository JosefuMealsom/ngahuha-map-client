import { useEffect, useState } from 'react';
import {
  PlantSite,
  PlantSiteWithinDistance,
} from '../../../types/api/plant-site.type';
import { getPlantSitesWithinDistance } from '../../../services/closest-plants.service';
import { ClosestPlantInfoComponent } from './ClosestPlantInfoComponent';
import SearchComponent from '../../../components/SearchComponent';
import { SearchPlantSitesFilter } from '../../../services/filter/search-plant-sites.filter';
import { SearchFilterMatch } from '../../../types/filter.type';
import { GeolocationLockOnComponent } from '../../../components/GeolocationLockOnComponent';
import { plantSiteTable, plantTable } from '../../../services/offline.database';
import { Plant } from '../../../types/api/plant.type';
import { ActiveFilterLinkComponent } from '../ActiveFilterLinkComponent';

export function ClosestPlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [plantSites, setPlantSites] = useState<PlantSite[]>([]);
  const [position, setPosition] = useState<GeolocationCoordinates>();
  const [visiblePlantSites, setVisiblePlantSites] =
    useState<PlantSiteWithinDistance[]>();
  const [searchPlantSitesFilter, setSearchPlantSitesFilter] = useState<
    SearchPlantSitesFilter<PlantSiteWithinDistance>
  >(new SearchPlantSitesFilter<PlantSiteWithinDistance>([], []));

  function onSearchPlantSites(
    matches: SearchFilterMatch<PlantSiteWithinDistance>[],
  ) {
    setVisiblePlantSites(matches.map((match) => match.data));
  }

  async function initSearchablePlantSites() {
    setPlants(await plantTable.toArray());
    setPlantSites(await plantSiteTable.toArray());
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

    setSearchPlantSitesFilter(
      new SearchPlantSitesFilter(closestPlantSites, plants),
    );

    setVisiblePlantSites(closestPlantSites);
  }, [position]);

  return (
    <div>
      <div className="mb-4 w-full h-full bg-white">
        <div
          className="px-2 sticky z-10 top-0 w-full max-w-md sm:max-w-lg pt-safe"
          data-cy="plant-list-search"
        >
          <SearchComponent<PlantSiteWithinDistance>
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
              triggerOnView={true}
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-4">
          {visiblePlantSites?.map((plantSite) => (
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
