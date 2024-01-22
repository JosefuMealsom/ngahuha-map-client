import { useEffect, useRef, useState } from 'react';
import { PlantSite } from '../../../types/api/plant-site.type';
import { usePlant } from '../../../hooks/use-plant.hook';
import { PlantTitleComponent } from '../../../components/PlantTitleComponent';
import { useIsInViewport } from '../../../hooks/use-is-in-viewport.hook';
import { useDisplayPhoto } from '../../../hooks/use-display-photo.hook';

export function ClosestPlantInfoComponent(props: PlantSite) {
  const plant = usePlant(props.plantId);
  const [previewImage, setPreviewImage] = useState<string>();
  const containerRef = useRef<HTMLDivElement>(null);
  const inViewport = useIsInViewport(containerRef);
  const displayPhoto = useDisplayPhoto(props.id);

  useEffect(() => {
    if (!displayPhoto || !inViewport) return;

    setPreviewImage(displayPhoto.dataUrl);
  }, [displayPhoto, inViewport]);

  function renderPlantTitle() {
    if (!plant) return;

    return <PlantTitleComponent {...plant} />;
  }

  return (
    <div
      className={`h-96 cursor-pointer sm:hover:opacity-90 bg-white`}
      data-cy={`closest-plant-site-${props.id}`}
      ref={containerRef}
    >
      <div className="w-full h-full align-top relative">
        <img
          src={previewImage}
          className={`w-full h-full relative ${
            previewImage ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        />

        <div className="absolute top-0">{renderPlantTitle()}</div>
      </div>
    </div>
  );
}
