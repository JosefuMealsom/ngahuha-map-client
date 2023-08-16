import { useEffect, useState } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import AutocompleteComponent from '../../components/AutocompleteComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteTable, plantTable } from '../../services/offline.database';
import { MapMarker } from './MapMarker';
import { SearchPlantSitesFilter } from '../../services/filter/search-plant-sites.filter';
import { SearchFilterMatch } from '../../types/filter.type';
import SearchComponent from '../../components/SearchComponent';

export function MapFilter() {
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());
  const plants = useLiveQuery(() => plantTable.toArray());
  const [filteredPlantSites, setFilteredPlantSites] = useState<PlantSite[]>();
  const [searchPlantSitesFilter, setSearchPlantSitesFilter] =
    useState<SearchPlantSitesFilter>(new SearchPlantSitesFilter([], []));

  useEffect(() => {
    if (!plants || !plantSites) return;

    setFilteredPlantSites(plantSites);
    setSearchPlantSitesFilter(new SearchPlantSitesFilter(plantSites, plants));
  }, [plants, plantSites]);

  function filterPlantSites(matches: SearchFilterMatch<PlantSite>[]) {
    if (!plants || !plantSites) return;

    setFilteredPlantSites(matches.map((match) => match.data));
  }

  function onChange(text: string) {
    if (text === '') {
      resetFilter();
    }
  }

  function resetFilter() {
    if (!plantSites) return;

    setFilteredPlantSites(plantSites);
  }

  return (
    <div className="absolute w-full h-full top-0 left-0">
      {filteredPlantSites?.map((plantSite) => (
        <MapMarker key={plantSite.id} {...plantSite} />
      ))}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-4 pt-safe flex w-full max-w-md px-3"
        data-cy="map-view-filter-container"
      >
        <SearchComponent
          placeholder="Filter plant sites"
          searchFilter={searchPlantSitesFilter}
          suggestionText="Available"
          onMatchesChange={filterPlantSites}
          onClearHandler={resetFilter}
        />
      </div>
    </div>
  );
}
