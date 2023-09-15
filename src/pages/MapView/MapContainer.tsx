import { useEffect, useRef, useState } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import { SearchFilterMatch } from '../../types/filter.type';
import { useAppStore } from '../../store/app.store';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteTable, plantTable } from '../../services/offline.database';
import SearchComponent from '../../components/SearchComponent';
import { NavigationBar } from '../Navigation/NavigationBar';
import { MapResultCarousel } from './MapResultCarousel';
import { MapSearchFilter } from '../../services/filter/map-search-filter';
import { MapSvg } from './MapSvg';

export function MapContainer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());
  const plants = useLiveQuery(() => plantTable.toArray());
  const [filteredPlantSites, setFilteredPlantSites] = useState<PlantSite[]>([]);
  const [searchPlantSitesFilter, setSearchPlantSitesFilter] =
    useState<MapSearchFilter>(new MapSearchFilter([], []));
  const { searchQuery, setSearchQuery } = useAppStore();
  const [selectedResultId, setSelectedResultId] = useState<string>();

  useEffect(() => {
    if (!plants || !plantSites) return;

    setSearchPlantSitesFilter(new MapSearchFilter(plantSites, plants));
  }, [plants, plantSites]);

  function filterPlantSites(matches: SearchFilterMatch<PlantSite>[]) {
    if (!plants || !plantSites) return;

    setFilteredPlantSites(matches.map((match) => match.data));
  }

  function resetFilter() {
    if (!plantSites) return;

    setFilteredPlantSites([]);
  }

  function setSelectedMarker(id: string) {
    setSelectedResultId(id);
  }

  return (
    <div
      ref={mapContainerRef}
      className="h-full top-0 left-0 overflow-hidden w-full bg-background"
    >
      <div className="h-screen">
        <div className="relative touch-none inline-block select-none overflow-hidden w-full">
          <div className="fixed left-0 top-2 pt-safe w-full max-w-md px-4 z-20">
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
          <MapSvg
            plantSites={filteredPlantSites}
            selectedPlantSiteId={selectedResultId}
          />
        </div>
        <div className="fixed bottom-3 left-0 w-full z-20">
          <MapResultCarousel
            plantSites={filteredPlantSites}
            onActiveResultChange={setSelectedMarker}
          />
        </div>
      </div>
    </div>
  );
}
