import { useEffect, useState } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import AutocompleteComponent from '../../components/AutocompleteComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteTable, plantTable } from '../../services/offline.database';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
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
    <div className="absolute w-full h-full top-0 left-0">
      {filteredPlantSites?.map((plantSite) => (
        <MapMarker key={plantSite.id} {...plantSite} />
      ))}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-12 flex w-full max-w-md px-3"
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
