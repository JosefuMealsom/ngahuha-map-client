import { useState } from 'react';
import { PlantSite } from '../types/api/plant-site.type';
import { ButtonComponent } from './ButtonComponent';
import { PlantSiteComponent } from './PlantSiteComponent';

export function PlantPhotosToUpload() {
  const [modalOpen, setModalState] = useState(false);
  const [photos, setPhotos] = useState<PlantSite[]>([]);

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

        <div>
          {photos.map((plantSitePhoto) => (
            <PlantSiteComponent {...plantSitePhoto} />
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
