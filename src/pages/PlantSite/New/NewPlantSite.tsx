import { PlantSiteForm } from '../CommonFormElements/PlantSiteForm';
import { useNavigate } from 'react-router-dom';

export function NewPlantSite() {
  const navigate = useNavigate();

  function onSaveSuccess() {
    navigate('/', { replace: true });
  }

  return (
    <div className="h-full bg-white w-full">
      <div className="absolute top-0 pt-14 left-0 bg-white w-full h-full">
        <div className="px-6 bg-white">
          <h1 className="font-bold mt-5 mb-7 text-xl">Add a new location</h1>
          <PlantSiteForm onSaveHandlerSuccess={onSaveSuccess} />
        </div>
      </div>
    </div>
  );
}
