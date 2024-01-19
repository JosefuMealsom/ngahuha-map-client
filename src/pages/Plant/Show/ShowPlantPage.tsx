import { Plant } from '../../../types/api/plant.type';
import { useLoaderData } from 'react-router-dom';
import { usePlantPhotos } from '../../../hooks/use-plant-photos.hook';
import { PlantDescription } from './PlantDescription';
import { PlantTitleComponent } from '../../../components/PlantTitleComponent';
import { ImageGridComponent } from '../../../components/ImageGridComponent';

import { MapPreviewComponent } from '../../../components/MapPreviewComponent';
import { PlantSite } from '../../../types/api/plant-site.type';

type ShowPlantPageLoaderArgs = { plant: Plant; plantSites: PlantSite[] };

export function ShowPlantPage() {
  const { plant, plantSites } = useLoaderData() as ShowPlantPageLoaderArgs;
  const photos = usePlantPhotos(plant.id);

  function renderImageGrid() {
    if (!photos || photos.length === 0) return;

    return (
      <ImageGridComponent imageUrls={photos.map((photo) => photo.dataUrl)} />
    );
  }

  return (
    <div className="h-full w-full bg-white">
      <div className="sm:flex h-full">
        <div className="relative sm:w-1/2 pt-safe">
          {renderImageGrid()}

          <div className="absolute top-safe left-1 mt-1">
            <PlantTitleComponent {...plant} />
          </div>
        </div>
        <div className="sm:w-1/2 ">
          <PlantDescription plantId={plant.id} />
        </div>
        <div className="pb-safe">
          <MapPreviewComponent locations={plantSites} />
        </div>
      </div>
    </div>
  );
}
