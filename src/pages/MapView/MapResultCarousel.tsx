import { useCallback, useEffect, useRef } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import { MapResultItem } from './MapResultItem';
import { useMapStore } from '../../store/map.store';

export function MapResultCarousel(props: {
  plantSites: PlantSite[];
  onActiveResultChange: (itemId: string) => any;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { mapCarouselPosition, setMapCarouselPosition } = useMapStore();

  const scrollCallback = useCallback(() => {
    setMapCarouselPosition(carouselRef.current?.scrollLeft || 0);
  }, [carouselRef]);

  useEffect(() => {
    if (!carouselRef.current) return;

    setTimeout(() => {
      carouselRef.current?.classList.remove('invisible');
      carouselRef.current?.scrollTo(mapCarouselPosition, 0);
    }, 100);

    carouselRef.current.addEventListener('scroll', scrollCallback);

    return () => {
      carouselRef.current?.removeEventListener('scroll', scrollCallback);
    };
  }, [carouselRef]);

  function renderCarousel() {
    if (props.plantSites.length === 0) return [];

    return props.plantSites.map((plantSite) => (
      <div
        key={plantSite.id}
        className="px-2 snap-x snap-center last:pr-4 first:pl-4"
      >
        <MapResultItem
          {...plantSite}
          onVisibleCallback={props.onActiveResultChange}
        />
      </div>
    ));
  }

  return (
    <div
      ref={carouselRef}
      className="overflow-x-scroll w-screen hide-scrollbar
        cursor-pointer pb-safe snap-x snap-mandatory invisible"
    >
      <div className="flex">{renderCarousel()}</div>
    </div>
  );
}
