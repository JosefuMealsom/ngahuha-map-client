import { useEffect, useState } from 'react';
import photoDatabaseService from '../services/plant-site-photo-database.service';
import { PlantPhoto } from './PlantPhoto';
import type { PlantSitePhoto } from '../types/plant-site-photo.type';
import { ButtonComponent } from './ButtonComponent';
import plantSitePhotoDatabaseService from '../services/plant-site-photo-database.service';

export function PlantPhotosToUpload() {
  const [data, setData] = useState<PlantSitePhoto[]>();
  const [modalOpen, setModalState] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setData(await photoDatabaseService.all());
    };

    fetchData();
  });

  function toggleModal() {
    setModalState(!modalOpen);
  }

  return (
    <div className="z-10">
      <div
        className={`${
          modalOpen ? '' : 'hidden'
        } mb-4 pt-14 w-full h-full absolute top-0 left-0 bg-white p-6`}
      >
        <h1 className="font-bold mt-5 mb-3">Pending locations to upload</h1>
        <div className="">
          {data?.map((plantSitePhoto) => (
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
