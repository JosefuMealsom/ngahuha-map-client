import { useEffect, useRef, useState } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import { usePlantSitePhotos } from '../../hooks/use-plant-site-photos.hook';
import { usePlant } from '../../hooks/use-plant.hook';
import { Link } from 'react-router-dom';
import { PlantTitleComponent } from '../../components/PlantTitleComponent';

export function MapResultItem(
  props: PlantSite & { onVisibleCallback: (itemId: string) => any },
) {
  const photos = usePlantSitePhotos(props.id);
  const plant = usePlant(props.plantId);
  const [previewUrl, setPreviewUrl] = useState('');
  const mapResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!photos || photos.length === 0) return;

    setPreviewUrl(photos[0].dataUrl || '');
  }, [photos]);

  function renderPlantTitle() {
    if (!plant) return;

    return (
      <h2 className="absolute p-2 bg-black bg-opacity-50 w-full">
        <PlantTitleComponent {...plant} />
      </h2>
    );
  }
  const observerOptions = { root: null, threshold: 1 };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [element] = entries;
      if (element.isIntersecting) {
        props.onVisibleCallback(props.id);
      }
    }, observerOptions);

    if (mapResultRef.current) {
      observer.observe(mapResultRef.current);
    }

    return () => {
      if (mapResultRef.current) {
        observer.unobserve(mapResultRef.current);
      }
    };
  }, [mapResultRef]);

  return (
    <div
      ref={mapResultRef}
      className="w-[90vw] bg-white rounded-lg h-60 overflow-hidden relative"
    >
      <Link to={`/plant-site/${props.id}`}>
        {renderPlantTitle()}
        <img
          src={previewUrl}
          className="w-full h-full object-cover overflow-hidden rounded-lg"
        />
      </Link>
    </div>
  );
}
