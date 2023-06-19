import { useEffect, useState } from 'react';
import photoDatabaseService from '../services/plant-site-photo-database.service';
import { PlantPhoto } from './PlantPhoto';
import type { PlantSitePhoto } from '../types/plant-site-photo.type';
import { ButtonComponent } from './ButtonComponent';

export function PlantPhotosToUpload() {
  const [modalOpen, setModalState] = useState(false);
  const [photos, setPhotos] = useState<PlantSitePhoto[]>([]);

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    const fetchData = async () => {
      setPhotos(await photoDatabaseService.all());
    };
    fetchData();
  }, [modalOpen]);

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
        <h1 className="font-bold mt-5 mb-3">Pending locations to upload</h1>

        <div>
          {photos.map((plantSitePhoto) => (
            <PlantPhoto {...plantSitePhoto} />
          ))}
        </div>
      </div>
      <ButtonComponent
        onClickHandler={toggleModal}
        className="absolute top-2 left-3 "
        text={modalOpen ? 'Close' : 'Pending upload'}
      ></ButtonComponent>
    </div>
  );
}
