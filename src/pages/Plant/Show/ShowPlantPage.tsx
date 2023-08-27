import { Plant } from '../../../types/api/plant.type';
import { useLoaderData } from 'react-router-dom';
import { usePlantPhotos } from '../../../hooks/use-plant-photos.hook';
import { PlantDescription } from './PlantDescription';
import { CarouselComponent } from '../../../components/CarouselComponent';
import { getFullPlantName } from '../../../utils/plant-name-decorator.util';

export function ShowPlantPage() {
  const plant: Plant = useLoaderData() as Plant;
  const photos = usePlantPhotos(plant.id);

  function renderCarousel() {
    if (!photos || photos.length === 0) return;

    const elements = photos.map((photo) => (
      <img
        className="w-full sm:h-screen object-cover"
        key={photo.id}
        src={photo.dataUrl}
      />
    ));

    return <CarouselComponent elements={elements} />;
  }

  return (
    <div className="h-full w-full bg-white">
      <div className="sm:flex h-full">
        <div className="relative sm:w-1/2 pt-safe">
          {renderCarousel()}
          <p className="text-xl absolute top-0 left-0 p-3 font-semibold text-white bg-black bg-opacity-50 w-full sm:max-w-fit">
            {getFullPlantName(plant)}
          </p>
        </div>
        <div className="sm:w-1/2">
          <PlantDescription plantId={plant.id} />
        </div>
      </div>
    </div>
  );
}
