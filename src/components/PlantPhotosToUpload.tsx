import { useEffect, useState } from 'react';
import { ButtonComponent } from './ButtonComponent';
import { PlantSiteComponent } from './PlantSiteComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteUploadTable } from '../services/offline.database';
import { uploadPlantSitesToServer } from '../services/api/sync/sync-plant-sites';

export function PlantPhotosToUpload() {
  const [modalOpen, setModalState] = useState(false);
  const [uploading, setUploadingState] = useState(false);

  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());
  const plantSites = useLiveQuery(() => plantSiteUploadTable.toArray());

  function toggleModal() {
    setModalState(!modalOpen);
  }

  useEffect(() => {
    if (plantUploadCount === 0) {
      setModalState(false);
    }
  }, [plantUploadCount]);

  async function uploadPlants() {
    setUploadingState(true);
    await uploadPlantSitesToServer();
    setUploadingState(false);
  }

  function renderUploadButton() {
    if (uploading || plantUploadCount === 0) return;

    return (
      <ButtonComponent
        onClickHandler={uploadPlants}
        className="bg-white"
        text="Upload to server"
      ></ButtonComponent>
    );
  }

  function renderModalButton() {
    if (uploading || plantUploadCount === 0) return;

    return (
      <ButtonComponent
        onClickHandler={toggleModal}
        className="fixed top-2 left-3 bg-white"
        text={modalOpen ? 'Close' : 'Pending changes'}
      ></ButtonComponent>
    );
  }

  return (
    <div>
      <div
        className={`${
          modalOpen ? '' : 'hidden'
        } mb-4 pt-14 w-full h-full absolute top-0 left-0 bg-white p-6`}
      >
        <h1 className="font-bold mt-5 mb-3">
          {uploading ? 'Uploading' : 'Pending changes'}
        </h1>
        {renderUploadButton()}
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
