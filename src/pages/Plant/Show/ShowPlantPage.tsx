import { Plant } from '../../../types/api/plant.type';
import { useLoaderData } from 'react-router-dom';
import { usePlantPhotos } from '../../../hooks/use-plant-photos.hook';
import { PlantDescription } from './PlantDescription';

export function ShowPlantPage() {
  const plant: Plant = useLoaderData() as Plant;
  const photos = usePlantPhotos(plant.id);

  return <PlantDescription plantId={plant.id} photos={photos} />;
}
