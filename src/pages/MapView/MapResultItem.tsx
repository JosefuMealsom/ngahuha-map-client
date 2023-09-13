import { useEffect, useState } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import { usePlantSitePhotos } from '../../hooks/use-plant-site-photos.hook';
import { usePlant } from '../../hooks/use-plant.hook';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
import { Link } from 'react-router-dom';

export function MapResultItem(props: PlantSite) {
  const photos = usePlantSitePhotos(props.id);
  const plant = usePlant(props.plantId);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!photos || photos.length === 0) return;

    setPreviewUrl(photos[0].dataUrl || '');
  }, [photos]);

  function renderPlantTitle() {
    if (!plant) return;

    return (
      <h2 className="text-white font-semibold absolute p-2 bg-black bg-opacity-50 w-full">
        {getFullPlantName(plant)}
      </h2>
    );
  }

  return (
    <div className="w-[90vw] sm:w-72 bg-white rounded-lg h-60 overflow-hidden relative">
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
