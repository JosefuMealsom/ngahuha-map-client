import { useEffect, useState } from 'react';
import { ButtonComponent } from './ButtonComponent';
import { PlantSiteComponent } from './PlantSiteComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteUploadTable } from '../services/offline.database';
import { uploadPlantSitesToServer } from '../services/api/sync/sync-plant-sites';
import uploadSvg from '../assets/svg/upload-cloud.svg';
import { useAppStore } from '../store/app.store';

export function PlantPhotosToUpload() {
  const [uploading, setUploadingState] = useState(false);
  const currentView = useAppStore((state) => state.activeView);
  const setActiveView = useAppStore((state) => state.setActiveView);

  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());
  const plantSites = useLiveQuery(() => plantSiteUploadTable.toArray());

  function toggleView() {
    if (isViewActive()) {
      setActiveView('ViewMap');
    } else {
      setActiveView('UploadPlants');
    }
  }

  useEffect(() => {
    if (plantUploadCount === 0) {
      setActiveView('ViewMap');
    }
  }, [plantUploadCount]);

  async function uploadPlants() {
    setUploadingState(true);

    try {
      await uploadPlantSitesToServer();
      setUploadingState(false);
      setActiveView('ViewMap');
    } catch (error) {
      setUploadingState(false);
    }
  }

  function isViewActive() {
    return currentView == 'UploadPlants';
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

  function renderModalButton() {
    const buttonVisible =
      currentView === 'UploadPlants' || currentView === 'ViewMap';

    if (!buttonVisible || uploading || plantUploadCount === 0) return;

    return (
      <div data-cy="open-upload-form" className="fixed top-2 left-3">
        <ButtonComponent
          onClickHandler={toggleView}
          className="bg-white"
          text={isViewActive() ? 'Close' : 'Pending changes'}
        ></ButtonComponent>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`${
          isViewActive() ? '' : 'hidden'
        } mb-4 pt-14 w-full h-full absolute top-0 left-0 bg-white p-6`}
      >
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
      {renderModalButton()}
    </div>
  );
}
