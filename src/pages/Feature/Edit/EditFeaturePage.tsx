import { useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FeatureForm } from '../FeatureForm';
import {
  FeaturePhotoUpload,
  FeatureUpload,
} from '../../../types/api/upload/feature-upload.type';

type EditLoaderData = {
  featureUpload: FeatureUpload;
  featurePhotoUploads: FeaturePhotoUpload[];
};

export function EditFeaturePage() {
  const navigate = useNavigate();
  const { featureUpload, featurePhotoUploads } =
    useLoaderData() as EditLoaderData;
  const coordinates = {
    accuracy: featureUpload.accuracy,
    latitude: featureUpload.latitude,
    longitude: featureUpload.longitude,
  };
  const photoFiles = featurePhotoUploads.map((photo) => ({
    id: crypto.randomUUID(),
    file: new Blob([photo.data]),
  }));

  async function onFeatureUpdate() {
    toast('Feature updated successfully');
    navigate(-1);
  }

  return (
    <div className="absolute top-0 pt-safe left-0 bg-background w-full h-full">
      <div className="w-full bg-background px-6 pt-7">
        <h1 className="font-bold mb-7 text-xl text-inverted-background">
          Edit feature {featureUpload.id}
        </h1>
        <div className="sm:max-w-md">
          <FeatureForm
            featureId={featureUpload.id}
            name={featureUpload.name}
            description={featureUpload.description}
            coordinates={coordinates}
            photos={photoFiles}
            onSaveHandlerSuccess={onFeatureUpdate}
          />
        </div>
      </div>
    </div>
  );
}
