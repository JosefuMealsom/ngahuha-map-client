import { useEffect, useState } from 'react';
import { PlantSite } from '../types/api/plant-site.type';
import AutocompleteComponent from './AutocompleteComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteTable, plantTable } from '../services/offline.database';
import { getFullPlantName } from '../utils/plant-name-decorator.util';
import { MapMarker } from './MapMarker';

export function MapFilter() {
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());
  const plants = useLiveQuery(() => plantTable.toArray());
  const [filteredPlantSites, setFilteredPlantSites] = useState<PlantSite[]>();
  const [filterItems, setFilterItems] = useState<
    { name: string; id: string }[]
  >([]);

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
    setFilteredPlantSites(plantSites);
  }, [plants, plantSites]);

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

  return (
    <div>
      {filteredPlantSites?.map((plantSite) => (
        <MapMarker key={plantSite.id} {...plantSite} />
      ))}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-16 flex w-full max-w-md"
        data-cy="map-view-filter-container"
      >
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