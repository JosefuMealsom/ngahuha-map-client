import { createPlant } from '../../../services/api/plant.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateNavigationBar } from '../../Navigation/CreateNavigationBar';
import { PlantForm } from '../PlantForm';

export function NewPlantPage() {
  const navigate = useNavigate();

  async function createPlantSite(createPlantData: CreatePlantData) {
    try {
      await createPlant(createPlantData);
      toast('Plant created successfully');
      navigate('/', { replace: true });
    } catch (error) {
      toast(`An error occured when creating the plant: ${error}`);
    }
  }

  return (
    <div className="absolute top-0 pt-safe left-0 bg-background w-full h-full">
      <CreateNavigationBar activePage="Create plant" />
      <div className="w-full bg-background px-6 pt-7">
        <h1 className="font-bold mb-7 text-xl text-inverted-background">
          Create a new plant
        </h1>
        <div className="sm:max-w-md">
          <PlantForm onSubmitHandler={createPlantSite} />
        </div>
      </div>
    </div>
  );
}
