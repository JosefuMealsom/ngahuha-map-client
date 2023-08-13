import { useEffect, useState } from 'react';
import { PlantSiteComponent } from './PlantSiteComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteUploadTable } from '../../services/offline.database';
import { bulkUploadPlantSitesToServer } from '../../services/api/sync/sync-plant-sites';
import uploadSvg from '../../assets/svg/upload-cloud.svg';
import { syncPlantSitesOffline } from '../../services/api/plant-site.service';
import { syncPlantSitePhotosOffline } from '../../services/api/plant-site-photo.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFilteredPlantSiteUploads } from '../../hooks/use-filtered-plant-site-uploads';

export function PlantPhotosToUpload() {
  const [uploading, setUploadingState] = useState(false);
  const navigate = useNavigate();
  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());
  const [readyForUpload, requiresId] = useFilteredPlantSiteUploads();

  useEffect(() => {
    if (plantUploadCount === 0) {
      navigate('/');
    }
  }, [plantUploadCount]);

  async function uploadPlants() {
    setUploadingState(true);

    try {
      await bulkUploadPlantSitesToServer(readyForUpload);
      toast('Plant sites uploaded successfully');
    } catch (error) {
      toast(
        `An error occured when uploading to the server: ${
          (error as Error).message
        }`,
      );
    } finally {
      setUploadingState(false);
      await syncPlantSitesOffline();
      await syncPlantSitePhotosOffline();
    }
  }

  function renderUploadButton() {
    if (uploading || plantUploadCount === 0) return;

    return (
      <img
        src={uploadSvg}
        className="h-7 inline-block ml-4 cursor-pointer"
        onClick={uploadPlants}
        data-cy="upload-plants"
      />
    );
  }

  function renderReadyForUpload() {
    if (readyForUpload.length === 0) return;

    return (
      <div className="mb-16">
        <h2 className="font-bold mt-5 relative text-sm mb-5">
          Ready for upload
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

  return (
    <div className="h-full bg-white w-full absolute top-0 left-0">
      <div className="mb-4 pt-14 w-full h-full bg-white p-6">
        <h1 className="font-bold mt-5 relative mb-3">
          {uploading ? 'Uploading' : 'Pending changes'}
          {renderUploadButton()}
        </h1>
        {renderReadyForUpload()}
        {renderRequiresIdentification()}
      </div>
    </div>
  );
}
