import { Plant } from '../../../types/api/plant.type';
import { useLoaderData } from 'react-router-dom';
import { getFullPlantName } from '../../../utils/plant-name-decorator.util';
import { useNavigate } from 'react-router-dom';
import { PlantSiteUpload } from '../../../types/api/upload/plant-site-upload.type';
import { PlantSiteForm } from '../CommonFormElements/PlantSiteForm';

type EditLoaderData = {
  plantSiteUpload: PlantSiteUpload;
  plant?: Plant;
};

export function EditPlantSite() {
  const navigate = useNavigate();
  const { plantSiteUpload, plant } = useLoaderData() as EditLoaderData;
  const plantName = !!plant ? getFullPlantName(plant) : '';
  const photoFiles = plantSiteUpload.photos.map((photo) => ({
    id: crypto.randomUUID(),
    file: new Blob([photo.data]),
  }));

  function onSaveSuccess() {
    navigate('/plant-site/pending-upload');
  }

  return (
    <div className="h-full">
      <div className="absolute top-0 pt-14 left-0 bg-white w-full h-full px-6">
        <h1 className="font-bold mt-5 mb-7 text-xl">
          Edit an plant site upload
        </h1>
        <PlantSiteForm
          onSaveHandlerSuccess={onSaveSuccess}
          plantNameValue={plantName}
          plantSiteUploadId={plantSiteUpload.id}
          photoFiles={photoFiles}
        />
      </div>
    </div>
  );
}
