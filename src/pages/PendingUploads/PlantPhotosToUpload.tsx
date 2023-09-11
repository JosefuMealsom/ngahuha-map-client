import { useEffect, useState } from 'react';
import { PlantSiteComponent } from './PlantSiteComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  featureUploadTable,
  plantSitePhotoUploadTable,
  plantSiteUploadTable,
} from '../../services/offline.database';
import { bulkUploadPlantSitesToServer } from '../../services/api/plant-site/sync-plant-sites';
import uploadSvg from '../../assets/svg/upload-cloud.svg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFilteredPlantSiteUploads } from '../../hooks/use-filtered-plant-site-uploads';
import { FeatureComponent } from './FeatureComponent';
import { bulkUploadFeaturesToServer } from '../../services/api/feature/sync-features';
import { LoaderSpinnerComponent } from '../../components/LoaderSpinnerComponent';
import { uploadAllPlantPhotosToServer } from '../../services/api/plant-site/plant-site-photo-upload.service';

export function PlantPhotosToUpload() {
  const [uploading, setUploadingState] = useState(false);
  const navigate = useNavigate();
  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());
  const featureUploads = useLiveQuery(() => featureUploadTable.toArray());
  const plantPhotosToUpload = useLiveQuery(() =>
    plantSitePhotoUploadTable.toArray(),
  );
  const featureUploadCount = useLiveQuery(() => featureUploadTable.count());
  const plantPhotoUploadCount = useLiveQuery(() =>
    plantSitePhotoUploadTable.count(),
  );
  const [readyForUpload, requiresId] = useFilteredPlantSiteUploads();

  useEffect(() => {
    if (
      plantUploadCount === 0 &&
      featureUploadCount === 0 &&
      plantPhotoUploadCount === 0
    ) {
      navigate(-1);
    }
  }, [plantUploadCount, featureUploadCount, plantPhotoUploadCount]);

  async function uploadChanges() {
    setUploadingState(true);

    try {
      await bulkUploadPlantSitesToServer(readyForUpload);
      await bulkUploadFeaturesToServer(featureUploads || []);
      await uploadAllPlantPhotosToServer(plantPhotosToUpload || []);
      toast('Changes uploaded successfully');
    } catch (error) {
      toast(
        `An error occured when uploading to the server: ${
          (error as Error).message
        }`,
      );
    } finally {
      setUploadingState(false);
    }
  }

  function renderUploadButton() {
    if (
      uploading ||
      (readyForUpload.length === 0 &&
        featureUploadCount === 0 &&
        plantPhotoUploadCount === 0)
    )
      return;

    return (
      <img
        src={uploadSvg}
        className="h-7 inline-block ml-4 cursor-pointer"
        onClick={uploadChanges}
        data-cy="upload-plants"
      />
    );
  }

  function renderReadyForUpload() {
    if (readyForUpload.length === 0) return;

    return (
      <div className="mb-16">
        <h2 className="font-bold mt-5 relative text-sm mb-5">
          Plant sites ready for upload
        </h2>
        {readyForUpload.map((plantSite) => (
          <PlantSiteComponent
            key={plantSite.id}
            {...plantSite}
            isUploading={uploading}
          />
        ))}
      </div>
    );
  }
  function renderRequiresIdentification() {
    if (requiresId.length === 0) return;

    return (
      <div>
        <h2 className="font-bold mt-5 text-sm relative mb-5">
          Requires identification
        </h2>
        {requiresId.map((plantSite) => (
          <div className="mb-3">
            <h3 className="font-bold mt-5 text-sm relative mb-1">
              Site {plantSite.id}
            </h3>
            <PlantSiteComponent
              key={crypto.randomUUID()}
              {...{ ...plantSite, photos: [] }}
              isUploading={uploading}
            />
          </div>
        ))}
      </div>
    );
  }

  function renderFeaturesToUpload() {
    if (!featureUploads || featureUploads?.length === 0) return;

    return (
      <div className="mb-16">
        <h2 className="font-bold mt-5 relative text-sm mb-5">
          Features to upload
        </h2>
        {featureUploads.map((feature) => (
          <FeatureComponent
            {...feature}
            key={feature.id}
            isUploading={uploading}
          />
        ))}
      </div>
    );
  }

  function renderPhotosToUpload() {
    if (!plantPhotosToUpload || plantPhotosToUpload?.length === 0) return;

    return (
      <div className="mb-16">
        <h2 className="font-bold mt-5 relative text-sm mb-5">
          Plant site photos to upload
        </h2>
        {plantPhotosToUpload.map((photo) => (
          <div className="py-2" key={photo.id!}>
            <h3 className="font-bold mt-5 text-sm relative mb-1">
              Plant site photo: {photo.id}
            </h3>
            <p className="text-sm">Photo for plant site {photo.plantSiteId}</p>
          </div>
        ))}
      </div>
    );
  }

  function renderUploadingModal() {
    if (!uploading) return;

    return (
      <div
        className="fixed top-0 left-0 h-screen w-full bg-black
      bg-opacity-80 flex items-center justify-center z-20 touch-none"
      >
        <p className="text-white font-semibold mr-1.5">Uploading changes</p>
        <LoaderSpinnerComponent />
      </div>
    );
  }

  return (
    <div className="h-full bg-white w-full absolute top-0 left-0 pb-safe min-h-screen">
      <div className="mb-4 pt-14 w-full h-full bg-white p-6">
        <h1 className="font-bold mt-5 relative mb-3">
          {uploading ? 'Uploading' : 'Upload changes'}
          {renderUploadButton()}
        </h1>
        {renderFeaturesToUpload()}
        {renderReadyForUpload()}
        {renderRequiresIdentification()}
        {renderUploadingModal()}
        {renderPhotosToUpload()}
      </div>
    </div>
  );
}
