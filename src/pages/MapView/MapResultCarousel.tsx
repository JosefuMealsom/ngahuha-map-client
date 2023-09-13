import { PlantSite } from '../../types/api/plant-site.type';
import { MapResultItem } from './MapResultItem';

export function MapResultCarousel(props: { plantSites: PlantSite[] }) {
  function renderCarousel() {
    if (props.plantSites.length === 0) return;

    if (props.plantSites.length === 0) return [];

    return props.plantSites.map((plantSite) => (
      <div className="ml-4">
        <MapResultItem key={plantSite.id} {...plantSite} />
      </div>
    ));
  }

  return (
    <div className="overflow-x-scroll w-screen hide-scrollbar cursor-pointer pb-safe">
      <div className="flex">{renderCarousel()}</div>
    </div>
  );
}