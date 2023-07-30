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
      <div className="h-full w-full bg-white">
        <div>
          {plantSitePhotos?.map((photo) => (
            <img
              className="w-full h-96 object-cover"
              key={photo.id}
              src={photo.dataUrl}
            />
          ))}
        </div>
        <div className="p-3">
          <h2 className="mb-2 font-bold">Name</h2>
          <p className="text-lg mb-2">{getFullPlantName(plant)}</p>
          <h2 className="mb-2 font-bold">Description</h2>
          <p className="text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 bg-white w-full h-full">
      <div className="w-full mb-5">{renderPlantInfo()}</div>
    </div>
  );
}
