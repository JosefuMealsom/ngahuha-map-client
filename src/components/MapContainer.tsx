import { useLiveQuery } from 'dexie-react-hooks';
import { MapCanvas } from './MapCanvas';
import { plantSiteTable, plantTable } from '../services/offline.database';
import { MapMarker } from './MapMarker';
import { useAnimationFrame } from '../hooks/use-animation-frame.hook';
import { PanGestureHandler } from '../services/view/pan-gesture-handler.service';
import { ZoomGestureHandler } from '../services/view/zoom-gesture-handler.service';
import { useMapStore } from '../store/map.store';
import { LocationMarker } from './LocationMarker';
import { FeatureMarker } from './FeatureMarker';
import { createRef, useEffect, useState } from 'react';
import AutocompleteComponent from './AutocompleteComponent';
import { PlantSite } from '../types/api/plant-site.type';
import { getFullPlantName } from '../utils/plant-name-decorator.util';

export function MapContainer() {
  const mapContainerRef = createRef<HTMLDivElement>();
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());
  const plants = useLiveQuery(() => plantTable.toArray());
  const [filteredPlantSites, setFilteredPlantSites] = useState<PlantSite[]>();
  const [filterItems, setFilterItems] = useState<
    { name: string; id: string }[]
  >([]);
  let panGestureHandler: PanGestureHandler;
  let zoomGestureHandler: ZoomGestureHandler;

  useEffect(() => {
    const getPlantSites = async () =>
      setFilteredPlantSites(await plantSiteTable.toArray());

    getPlantSites();
  }, []);

  useEffect(() => {
    if (!plants || !plantSites) return;
    const availablePlantIds = plantSites.map((plantSite) => plantSite.plantId);
    const filteredPlants = plants.filter((plant) =>
      availablePlantIds.includes(plant.id),
    );

    const items = filteredPlants.map((plant) => ({
      name: getFullPlantName(plant),
      id: plant.id,
    }));

    setFilterItems(items);
  }, [plants, plantSites]);

  useAnimationFrame(() => {
    const pan = panGestureHandler.update();
    const zoom = zoomGestureHandler.update();
    useMapStore.getState().setZoom(zoom);
    useMapStore.getState().setPan(pan.x, pan.y);
  });

  function filterPlantSites(text: string) {
    if (!plants || !plantSites) return;

    const plantId = filterItems.find((item) => item.name === text)?.id;

    const sites = plantSites.filter(
      (plantSite) => plantSite.plantId === plantId,
    );

    setFilteredPlantSites(sites);
  }

  function resetFilter() {
    if (!plantSites) return;

    setFilteredPlantSites(plantSites);
  }

  useEffect(() => {
    if (!mapContainerRef.current) return;

    panGestureHandler = new PanGestureHandler(mapContainerRef.current);
    zoomGestureHandler = new ZoomGestureHandler(mapContainerRef.current);
  }, []);

  return (
    <div ref={mapContainerRef} className="h-screen overflow-hidden w-full">
      <div className="relative touch-none inline-block select-none overflow-hidden">
        <MapCanvas />
        {filteredPlantSites?.map((plantSite) => (
          <MapMarker key={plantSite.id} {...plantSite} />
        ))}
        <LocationMarker />
        <FeatureMarker
          text="The steppes"
          position={{ latitude: -35.377761, longitude: 173.966039 }}
        />
        <FeatureMarker
          text="The avocado orchard"
          position={{ latitude: -35.377025, longitude: 173.965264 }}
        />
      </div>
      <div className="absolute top-16 left-0 px-5 flex w-full justify-center max-w-md">
        <AutocompleteComponent
          placeholder="Filter plant sites"
          items={filterItems.map((item) => item.name)}
          suggestionText="Available"
          onItemSelectHandler={filterPlantSites}
          onClearHandler={resetFilter}
        />
      </div>
    </div>
  );
}
