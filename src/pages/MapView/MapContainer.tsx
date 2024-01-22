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
import { PanZoomComponent } from '../../components/PanZoomComponent';
import { useMapStore } from '../../store/map.store';
import { LocationMarker } from './LocationMarker';
import { MapMarker } from './MapMarker';
import { interpolateToCanvasPosition } from '../../services/map-position-interpolator.service';
import { LatLong } from '../../types/lat-long.type';

export function MapContainer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());
  const plants = useLiveQuery(() => plantTable.toArray());
  const [filteredPlantSites, setFilteredPlantSites] = useState<PlantSite[]>([]);
  const [searchPlantSitesFilter, setSearchPlantSitesFilter] =
    useState<MapSearchFilter>(new MapSearchFilter([], []));
  const { searchQuery, setSearchQuery } = useAppStore();
  const { setMapCarouselPosition } = useMapStore();
  const [selectedResultId, setSelectedResultId] = useState<string>();

  const [pan, setPan] = useState(useMapStore.getState().pan);
  const [zoom, setZoom] = useState(useMapStore.getState().zoom);

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
    if (!plantSites) return;

    const plantSite = plantSites.find((plantSite) => id === plantSite.id);

    if (!plantSite) return;

    centerMapOnPosition(plantSite);
    setSelectedResultId(id);
  }

  function centerMapOnPosition(position: LatLong) {
    const newPosition = interpolateToCanvasPosition(
      position,
      useMapStore.getState(),
    );

    if (newPosition) {
      setPan({ x: -newPosition.x, y: -newPosition.y });
    }
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
                onChange={(value) => {
                  setSearchQuery(value);
                  setMapCarouselPosition(0);
                }}
              />
            </div>
            <NavigationBar activePage="Map" />
          </div>
          <PanZoomComponent
            className="bg-[#96AF98]"
            pan={pan}
            zoom={zoom}
            panBounds={{ x: { min: -600, max: 50 }, y: { min: -910, max: 50 } }}
          >
            <MapSvg>
              <LocationMarker />
              {filteredPlantSites.map((plantSite) => (
                <MapMarker
                  key={plantSite.id}
                  {...plantSite}
                  active={selectedResultId === plantSite.id}
                />
              ))}
            </MapSvg>
          </PanZoomComponent>
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
