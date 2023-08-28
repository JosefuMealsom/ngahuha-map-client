import { useEffect, useState } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteTable, plantTable } from '../../services/offline.database';
import { MapMarker } from './MapMarker';
import { SearchPlantSitesFilter } from '../../services/filter/search-plant-sites.filter';
import { SearchFilterMatch } from '../../types/filter.type';
import SearchComponent from '../../components/SearchComponent';
import { ActiveFilterLinkComponent } from '../../components/ActiveFilterLinkComponent';
import { NavigationBar } from '../Navigation';
import { useAppStore } from '../../store/app.store';

export function MapFilter() {
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());
  const plants = useLiveQuery(() => plantTable.toArray());
  const [filteredPlantSites, setFilteredPlantSites] = useState<PlantSite[]>();
  const [searchPlantSitesFilter, setSearchPlantSitesFilter] =
    useState<SearchPlantSitesFilter>(new SearchPlantSitesFilter([], []));
  const { searchQuery, setSearchQuery } = useAppStore();

  useEffect(() => {
    if (!plants || !plantSites) return;

    setSearchPlantSitesFilter(new SearchPlantSitesFilter(plantSites, plants));
  }, [plants, plantSites]);

  function filterPlantSites(matches: SearchFilterMatch<PlantSite>[]) {
    if (!plants || !plantSites) return;

    setFilteredPlantSites(matches.map((match) => match.data));
  }

  function resetFilter() {
    if (!plantSites) return;

    setFilteredPlantSites([]);
  }

  return (
    <div className="absolute w-full h-full top-0 left-0">
      {filteredPlantSites?.map((plantSite) => (
        <MapMarker key={plantSite.id} {...plantSite} />
      ))}
      <div
        className="absolute left-0 top-2 pt-safe w-full max-w-md px-4"
        data-cy="map-view-filter-container"
      >
        <div className="pb-2">
          <SearchComponent
            placeholder="Filter plant sites"
            searchFilter={searchPlantSitesFilter}
            suggestionText="Available"
            onMatchesChange={filterPlantSites}
            onClearHandler={resetFilter}
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
          />
        </div>
        <NavigationBar activePage="Map" />
      </div>
    </div>
  );
}
