import { ActiveFilterLinkComponent } from '../../../components/ActiveFilterLinkComponent';
import { CreateNavigationBar } from '../../Navigation/CreateNavigationBar';
import { PlantSiteForm } from '../CommonFormElements/PlantSiteForm';
import { useNavigate } from 'react-router-dom';

export function NewPlantSite() {
  const navigate = useNavigate();

  function onSaveSuccess() {
    navigate('/', { replace: true });
  }

  return (
    <div className="h-screen w-full bg-background">
      <div className="absolute top-0 pt-safe left-0 w-full h-full">
        <CreateNavigationBar activePage="New plant site" />
        <div className="px-6 pt-7 pb-safe">
          <h1 className="font-bold mt mb-7 text-inverted-background text-xl">
            Add a new location
          </h1>
          <PlantSiteForm onSaveHandlerSuccess={onSaveSuccess} />
        </div>
      </div>
    </div>
  );
}
