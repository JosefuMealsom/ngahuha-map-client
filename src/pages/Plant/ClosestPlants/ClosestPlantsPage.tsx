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
import { Plant } from '../../../types/api/plant.type';
import { NavigationBar } from '../../Navigation/NavigationBar';
import { LatLong } from '../../../types/lat-long.type';
import { useAppStore } from '../../../store/app.store';
import { useLoaderData } from 'react-router-dom';

type LoaderData = { plants: Plant[]; plantSites: PlantSite[] };

export function ClosestPlantsPage() {
  const { plants, plantSites } = useLoaderData() as LoaderData;
  const [position, setPosition] = useState<LatLong>();
  const [visiblePlantSites, setVisiblePlantSites] =
    useState<PlantSiteWithinDistance[]>();
  const [searchPlantSitesFilter, setSearchPlantSitesFilter] = useState<
    SearchPlantSitesFilter<PlantSiteWithinDistance>
  >(new SearchPlantSitesFilter<PlantSiteWithinDistance>([], []));
  const { searchQuery, setSearchQuery } = useAppStore();

  function onSearchPlantSites(
    matches: SearchFilterMatch<PlantSiteWithinDistance>[],
  ) {
    setVisiblePlantSites(matches.map((match) => match.data));
  }

  function onLocationLocked(position: LatLong) {
    setPosition(position);
  }

  useEffect(() => {
    if (!position) return;

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
    <div className="w-full h-full bg-background pt-safe">
      <div className="w-full">
        <div className="px-4 pt-2 sticky z-10 top-safe w-full max-w-md sm:max-w-lg">
          <div className="mb-2" data-cy="plant-list-search">
            <SearchComponent<PlantSiteWithinDistance>
              searchFilter={searchPlantSitesFilter}
              placeholder="Search plants"
              onMatchesChange={onSearchPlantSites}
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />
          </div>
          <NavigationBar activePage="Closest Plants">
            <div className="mb-1 absolute right-4">
              <GeolocationLockOnComponent
                onGeolocationLocked={onLocationLocked}
                targetAccuracy={10}
                triggerOnView={true}
              />
            </div>
          </NavigationBar>
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
