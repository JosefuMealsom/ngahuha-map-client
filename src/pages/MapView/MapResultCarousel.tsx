import { PlantSite } from '../../types/api/plant-site.type';
import { MapResultItem } from './MapResultItem';

export function MapResultCarousel(props: {
  plantSites: PlantSite[];
  onActiveResultChange: (itemId: string) => any;
}) {
  function renderCarousel() {
    if (props.plantSites.length === 0) return [];

    return props.plantSites.map((plantSite) => (
      <div className="ml-4 snap-x snap-center">
        <MapResultItem
          key={plantSite.id}
          {...plantSite}
          onVisibleCallback={props.onActiveResultChange}
        />
      </div>
    ));
  }

  return (
    <div className="overflow-x-scroll w-screen hide-scrollbar cursor-pointer pb-safe snap-x snap-mandatory">
      <div className="flex">{renderCarousel()}</div>
    </div>
  );
}
