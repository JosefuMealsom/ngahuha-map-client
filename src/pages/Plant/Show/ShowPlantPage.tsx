import { Plant } from '../../../types/api/plant.type';
import { useLoaderData } from 'react-router-dom';
import { usePlantPhotos } from '../../../hooks/use-plant-photos.hook';
import { PlantDescription } from './PlantDescription';
import { PlantTitleComponent } from '../../../components/PlantTitleComponent';
import { ImageGridComponent } from '../../../components/ImageGridComponent';

export function ShowPlantPage() {
  const plant: Plant = useLoaderData() as Plant;
  const photos = usePlantPhotos(plant.id);

  function renderImageGrid() {
    if (!photos || photos.length === 0) return;

    const elements = photos.map((photo) => (
      <img
        className="w-full sm:h-screen object-cover"
        key={photo.id}
        src={photo.dataUrl}
      />
    ));

    return (
      <ImageGridComponent imageUrls={photos.map((photo) => photo.dataUrl)} />
    );
  }

  return (
    <div className="h-full w-full bg-white">
      <div className="sm:flex h-full">
        <div className="relative sm:w-1/2 pt-safe">
          {renderImageGrid()}

          <div className="text-xl absolute top-safe left-0 p-3 font-semibold text-white bg-black bg-opacity-50 w-full sm:max-w-fit">
            <PlantTitleComponent {...plant} />
          </div>
        </div>
        <div className="sm:w-1/2 pb-safe">
          <PlantDescription plantId={plant.id} />
        </div>
      </div>
    </div>
  );
}
