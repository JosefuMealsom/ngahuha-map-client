import { useEffect, useState } from 'react';
import { AllPlantsList } from './AllPlantsList';
import { ClosestPlantsList } from './ClosestPlantsList';
import { ActiveFilterButtonComponent } from './ActiveFilterButtonComponent';
import { SearchFilterMatch } from '../../../types/filter.type';
import { Plant } from '../../../types/api/plant.type';
import SearchComponent from '../../../components/SearchComponent';
import { SearchPlantsFilter } from '../../../services/filter/search-plants.filter';
import { plantSiteTable, plantTable } from '../../../services/offline.database';
import { GeolocationLockOnComponent } from '../../../components/GeolocationLockOnComponent';
import { PlantSite } from '../../../types/api/plant-site.type';
import { SearchPlantSitesFilter } from '../../../services/filter/search-plant-sites.fiiter';

type PlantListViews = 'AllPlants' | 'ClosestPlants';

export function PlantsPage() {
  const [currentView, setCurrentView] = useState<PlantListViews>('AllPlants');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [plantSites, setPlantSites] = useState<PlantSite[]>([]);

  const [position, setPosition] = useState<GeolocationCoordinates>();
  const [searchPlantsFilter, setSearchPlantsFilter] =
    useState<SearchPlantsFilter>(new SearchPlantsFilter([]));
  const [searchPlantSitesFilter, setSearchPlantSitesFilter] =
    useState<SearchPlantSitesFilter>(new SearchPlantSitesFilter([], []));

  useEffect(() => {
    getAllPlantsAndSites();
  }, []);

  async function getAllPlantsAndSites() {
    const allPlants = await plantTable.toArray();
    setPlants(allPlants);
    setSearchPlantsFilter(new SearchPlantsFilter(allPlants));

    const allPlantSites = await plantSiteTable.toArray();
    setPlantSites(allPlantSites);
    setSearchPlantSitesFilter(
      new SearchPlantSitesFilter(allPlantSites, allPlants),
    );
  }

  function onSearchPlants(matches: SearchFilterMatch<Plant>[]) {
    setPlants(matches.map((match) => match.data));
  }

  function onSearchPlantSites(matches: SearchFilterMatch<PlantSite>[]) {
    setPlantSites(matches.map((match) => match.data));
  }

  function renderSearchPlant() {
    return (
      <div className={`${currentView !== 'AllPlants' ? 'hidden' : ''} mb-1`}>
        <SearchComponent<Plant>
          searchFilter={searchPlantsFilter}
          placeholder="Search plants"
          onMatchesChange={onSearchPlants}
        />
      </div>
    );
  }

  function renderSearchClosestPlants() {
    return (
      <div
        className={`${currentView !== 'ClosestPlants' ? 'hidden' : ''} mb-1`}
      >
        <SearchComponent<PlantSite>
          searchFilter={searchPlantSitesFilter}
          placeholder="Search plants"
          onMatchesChange={onSearchPlantSites}
        />
      </div>
    );
  }

  function renderView() {
    switch (currentView) {
      case 'AllPlants':
        return <AllPlantsList plants={plants} />;
      case 'ClosestPlants':
        return (
          <ClosestPlantsList position={position} plantSites={plantSites} />
        );
      default:
        return <AllPlantsList plants={plants} />;
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white overflow-scroll">
      <div
        className="px-2 sticky z-10 top-0 w-full max-w-md sm:max-w-lg"
        data-cy="plant-list-search"
      >
        <div>
          {renderSearchPlant()}
          {renderSearchClosestPlants()}
          <div className="flex">
            <ActiveFilterButtonComponent
              text="Show All"
              onClickHandler={() => setCurrentView('AllPlants')}
              active={currentView === 'AllPlants'}
              data-cy="show-all"
            />
            <ActiveFilterButtonComponent
              text="Show closest"
              onClickHandler={() => setCurrentView('ClosestPlants')}
              active={currentView === 'ClosestPlants'}
              data-cy="show-closest"
            />
            <div
              className={`${currentView !== 'ClosestPlants' ? 'hidden' : ''}`}
            >
              <GeolocationLockOnComponent
                onGeolocationLocked={(position) => setPosition(position)}
                targetAccuracy={10}
              />
            </div>
          </div>
        </div>
      </div>
      {renderView()}
    </div>
  );
}
