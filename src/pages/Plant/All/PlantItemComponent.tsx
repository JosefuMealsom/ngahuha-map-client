import { Link } from 'react-router-dom';
import { Plant } from '../../../types/api/plant.type';
import { useEffect, useRef, useState } from 'react';
import { PlantTitleComponent } from '../../../components/PlantTitleComponent';
import { useIsInViewport } from '../../../hooks/use-is-in-viewport.hook';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteTable } from '../../../services/offline.database';
import { useDisplayPhoto } from '../../../hooks/use-display-photo.hook';

export function PlantItemComponent(props: Plant) {
  const [previewImage, setPreviewImage] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inViewport = useIsInViewport(containerRef);

  const displayPlantSite = useLiveQuery(() =>
    plantSiteTable.where({ plantId: props.id }).first(),
  );
  const displayPhoto = useDisplayPhoto(displayPlantSite?.id);

  useEffect(() => {
    if (!displayPhoto || !inViewport) return;

    setPreviewImage(displayPhoto.dataUrl);
  }, [displayPhoto, inViewport]);

  function renderImage() {
    if (previewImage.length === 0) return;

    return <img src={previewImage} className="w-full h-full object-cover" d />;
  }

  function renderPlantInfo() {
    return (
      <div
        className="h-96 cursor-pointer sm:hover:opacity-90 bg-white relative"
        ref={containerRef}
      >
        <div
          className={`w-full h-full relative ${
            previewImage ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        >
          {renderImage()}
        </div>
        <div className="absolute top-0">
          <PlantTitleComponent {...props} />
        </div>
      </div>
    );
  }

  return (
    <Link to={`/plants/${props.id}`}>
      <div className="w-full">{renderPlantInfo()}</div>
    </Link>
  );
}
