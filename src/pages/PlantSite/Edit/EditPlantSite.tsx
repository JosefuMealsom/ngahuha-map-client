import { Plant } from '../../../types/api/plant.type';
import { useLoaderData } from 'react-router-dom';
import { getFullPlantName } from '../../../utils/plant-name-decorator.util';
import { useNavigate } from 'react-router-dom';
import {
  PhotoFile,
  PlantSiteUpload,
} from '../../../types/api/upload/plant-site-upload.type';
import { PlantSiteForm } from '../CommonFormElements/PlantSiteForm';

type EditLoaderData = {
  plantSiteUpload: PlantSiteUpload;
  plant?: Plant;
  photos: PhotoFile[];
};

export function EditPlantSite() {
  const navigate = useNavigate();
  const { plantSiteUpload, plant, photos } = useLoaderData() as EditLoaderData;
  const plantName = !!plant ? getFullPlantName(plant) : '';

  function onSaveSuccess() {
    navigate(-1);
  }

  return (
    <div className="h-full">
      <div className="absolute top-0 pt-7 left-0 bg-background w-full h-full">
        <div className="w-full bg-background px-6 pb-safe">
          <h1 className="font-bold mt-5 mb-7 text-xl text-inverted-background">
            Edit plant site {plantSiteUpload.id}
          </h1>
          <PlantSiteForm
            onSaveHandlerSuccess={onSaveSuccess}
            plantNameValue={plantName}
            plantSiteUploadId={plantSiteUpload.id}
            photoFiles={photos}
            coordinates={{
              accuracy: plantSiteUpload.accuracy,
              latitude: plantSiteUpload.latitude,
              longitude: plantSiteUpload.longitude,
            }}
          />
        </div>
      </div>
    </div>
  );
}
