import { useNavigate } from 'react-router-dom';
import { CreateNavigationBar } from '../Navigation/CreateNavigationBar';
import { FeatureForm } from './FeatureForm';

export function NewFeaturePage() {
  const navigate = useNavigate();

  async function createFeature(createPlantData: CreatePlantData) {}

  return (
    <div className="absolute top-0 pt-safe left-0 bg-background w-full h-full">
      <CreateNavigationBar activePage="Create feature" />
      <div className="w-full bg-background px-6 pt-7">
        <h1 className="font-bold mb-7 text-xl text-inverted-background">
          Create a new feature
        </h1>
        <div className="sm:max-w-md">
          <FeatureForm />
        </div>
      </div>
    </div>
  );
}