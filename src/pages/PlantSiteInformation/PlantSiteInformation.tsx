import type { PlantSite } from '../../types/api/plant-site.type';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
import { usePlant } from '../../hooks/use-plant.hook';
import { usePlantSitePhotos } from '../../hooks/use-plant-site-photos.hook';
import { useLoaderData } from 'react-router-dom';

export function PlantSiteInformation() {
  const plantSite: PlantSite = useLoaderData() as PlantSite;
  const plant = usePlant(plantSite.plantId);
  const plantSitePhotos = usePlantSitePhotos(plantSite.id);

  function renderPlantInfo() {
    if (!plant) return;

    return (
      <div className="h-full w-full">
        <div className="w-3/4 inline-block align-top">
          <h1 className="font-bold">Plant Species</h1>
          <p className="inline-block">{getFullPlantName(plant)}</p>
          {plantSitePhotos?.map((photo) => (
            <img key={photo.id} src={photo.dataUrl} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 pt-14 left-0 bg-white w-full h-full px-6">
      <div className="w-full mb-5">{renderPlantInfo()}</div>
    </div>
  );
}
