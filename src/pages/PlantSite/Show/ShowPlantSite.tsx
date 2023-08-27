import { usePlantSitePhotos } from '../../../hooks/use-plant-site-photos.hook';
import { useLoaderData } from 'react-router-dom';
import { PlantDescription } from '../../Plant/Show/PlantDescription';
import { CarouselComponent } from '../../../components/CarouselComponent';
import { getFullPlantName } from '../../../utils/plant-name-decorator.util';
import { Plant } from '../../../types/api/plant.type';
import { PlantSite } from '../../../types/api/plant-site.type';

type LoaderData = { plant: Plant; plantSite: PlantSite };

export function PlantSiteInformation() {
  const { plantSite, plant } = useLoaderData() as LoaderData;
  const photos = usePlantSitePhotos(plantSite.id);

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
          <p className="text-xl absolute top-safe left-0 p-3 font-semibold text-white bg-black bg-opacity-50 w-full sm:max-w-fit">
            {getFullPlantName(plant)}
          </p>
        </div>
        <div className="sm:w-1/2">
          <PlantDescription plantId={plantSite.plantId} />
        </div>
      </div>
    </div>
  );
}
