import { Link } from 'react-router-dom';
import { Plant } from '../../../types/api/plant.type';
import { useEffect, useRef, useState } from 'react';
import { PlantTitleComponent } from '../../../components/PlantTitleComponent';
import { usePlantPhotos } from '../../../hooks/use-plant-photos.hook';
import { useIsInViewport } from '../../../hooks/use-is-in-viewport.hook';

export function PlantItemComponent(props: Plant) {
  const plantSitePhotos = usePlantPhotos(props.id);
  const [previewImage, setPreviewImage] = useState('');
  const testRef = useRef<HTMLDivElement>(null);
  const inViewport = useIsInViewport(testRef);

  useEffect(() => {
    if (!plantSitePhotos || !inViewport) return;

    const getPlantImage = async () => {
      let displayPhoto = plantSitePhotos[0];

      setPreviewImage(displayPhoto.dataUrl);
    };

    getPlantImage();
  }, [plantSitePhotos, inViewport]);

  function renderImage() {
    if (previewImage.length === 0) return;

    return (
      <img
        src={previewImage}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    );
  }

  function renderPlantInfo() {
    return (
      <div
        className="h-96 cursor-pointer sm:hover:opacity-90 bg-white"
        ref={testRef}
      >
        <div
          className={`w-full h-full relative min-h-[15rem] ${
            previewImage ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        >
          {renderImage()}
          <div className="absolute top-0">
            <PlantTitleComponent {...props} />
          </div>
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
