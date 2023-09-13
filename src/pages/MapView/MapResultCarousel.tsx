import { useEffect, useLayoutEffect, useRef } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import { MapResultItem } from './MapResultItem';
import { useAppStore } from '../../store/app.store';

export function MapResultCarousel(props: { plantSites: PlantSite[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { mapCarouselPosition, setMapCarouselPosition } = useAppStore();

  function renderCarousel() {
    if (props.plantSites.length === 0) return [];

    return props.plantSites.map((plantSite) => (
      <div className="ml-4 snap-x snap-center">
        <MapResultItem key={plantSite.id} {...plantSite} />
      </div>
    ));
  }

  useEffect(() => {
    carouselRef.current?.addEventListener('scroll', () => {
      setMapCarouselPosition(carouselRef.current?.scrollLeft || 0);
    });
  }, []);

  useLayoutEffect(() => {
    carouselRef.current?.scrollTo(mapCarouselPosition, 0);
  });

  return (
    <div
      ref={carouselRef}
      className="overflow-x-scroll w-screen hide-scrollbar cursor-pointer pb-safe snap-x snap-mandatory"
    >
      <div className="flex">{renderCarousel()}</div>
    </div>
  );
}
