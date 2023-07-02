import { useState } from 'react';
import { ButtonComponent } from './ButtonComponent';
import { PlantSiteComponent } from './PlantSiteComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteUploadTable } from '../services/offline.database';
import { uploadPlantSitesToServer } from '../services/api/sync/sync-plant-sites';

export function PlantPhotosToUpload() {
  const [modalOpen, setModalState] = useState(false);

  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());

  const plantSites = useLiveQuery(
    () => plantSiteUploadTable.toArray(),
    [plantUploadCount],
  );

  function toggleModal() {
    setModalState(!modalOpen);
  }

  return (
    <div>
      <div
        className={`${
          modalOpen ? '' : 'hidden'
        } mb-4 pt-14 w-full h-full absolute top-0 left-0 bg-white p-6`}
      >
        <h1 className="font-bold mt-5 mb-3">Pending changes</h1>
        <ButtonComponent
          onClickHandler={uploadPlantSitesToServer}
          className="bg-white"
          text="Upload to server"
        ></ButtonComponent>
        <div>
          {plantSites?.map((plantSite) => (
            <PlantSiteComponent {...plantSite} />
          ))}
        </div>
      </div>
      <ButtonComponent
        onClickHandler={toggleModal}
        className="fixed top-2 left-3 bg-white"
        text={modalOpen ? 'Close' : 'Pending changes'}
      ></ButtonComponent>
    </div>
  );
}
