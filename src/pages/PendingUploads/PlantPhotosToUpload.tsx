import { useEffect, useState } from 'react';
import { PlantSiteComponent } from './PlantSiteComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteUploadTable } from '../../services/offline.database';
import { uploadPlantSitesToServer } from '../../services/api/sync/sync-plant-sites';
import uploadSvg from '../../assets/svg/upload-cloud.svg';
import { syncPlantSitesOffline } from '../../services/api/plant-site.service';
import { syncPlantSitePhotosOffline } from '../../services/api/plant-site-photo.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function PlantPhotosToUpload() {
  const [uploading, setUploadingState] = useState(false);
  const navigate = useNavigate();
  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());
  const plantSites = useLiveQuery(() => plantSiteUploadTable.toArray());

  useEffect(() => {
    if (plantUploadCount === 0) {
      navigate('/');
    }
  }, [plantUploadCount]);

  async function uploadPlants() {
    setUploadingState(true);

    try {
      await uploadPlantSitesToServer();
      toast('Plant sites uploaded successfully');
    } catch (error) {
      toast('An error occured when uploading to the server, please try again.');
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

  return (
    <div>
      <div className="mb-4 pt-14 w-full h-full absolute top-0 left-0 bg-white p-6">
        <h1 className="font-bold mt-5 relative mb-3">
          {uploading ? 'Uploading' : 'Pending changes'}
          {renderUploadButton()}
        </h1>
        <div>
          {plantSites?.map((plantSite) => (
            <PlantSiteComponent
              key={plantSite.id}
              {...plantSite}
              isUploading={uploading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
