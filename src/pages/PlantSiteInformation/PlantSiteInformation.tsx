import type { PlantSite } from '../../types/api/plant-site.type';
import { usePlantSitePhotos } from '../../hooks/use-plant-site-photos.hook';
import { useLoaderData } from 'react-router-dom';
import { PlantDescription } from '../PlantInformation/PlantDescription';

export function PlantSiteInformation() {
  const plantSite: PlantSite = useLoaderData() as PlantSite;
  const plantSitePhotos = usePlantSitePhotos(plantSite.id);

  return (
    <PlantDescription
      plantId={plantSite.plantId}
      photos={plantSitePhotos || []}
    />
  );
}
