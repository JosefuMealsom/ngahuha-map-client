import { PlantSite } from '../../types/api/plant-site.type';
import { useEffect, useState } from 'react';
import { plantSitePhotoTable } from '../../services/offline.database';
import blobToDataUrlService from '../../services/blob-to-data-url.service';
import { usePlant } from '../../hooks/use-plant.hook';
import { Link } from 'react-router-dom';
import { PlantTitleComponent } from '../../components/PlantTitleComponent';

export function PlantSiteListItemComponent(props: PlantSite) {
  const plant = usePlant(props.plantId);
  const [photoDataUrl, setPhotoDataUrl] = useState<string>();

  const getPlantInfo = async () => {
    const firstPlantSitePhotos = await plantSitePhotoTable
      .where({ plantSiteId: props.id })
      .toArray();

    let primaryPhoto = firstPlantSitePhotos.find(
      (photo) => photo.primaryPhoto === true,
    );

    if (!primaryPhoto) {
      primaryPhoto = firstPlantSitePhotos[0];
    }

    if (!primaryPhoto || !primaryPhoto?.data) return;

    const photoData = await blobToDataUrlService.convert(
      new Blob([primaryPhoto.data]),
    );

    setPhotoDataUrl(photoData || '');
  };

  useEffect(() => {
    getPlantInfo();
  }, []);

  function renderPlantTitle() {
    if (!plant) return;

    return <PlantTitleComponent {...plant} />;
  }

  function renderPlantInfo() {
    return (
      <div
        className="h-96 cursor-pointer hover:opacity-90 bg-white"
        data-cy={`closest-plant-site-${props.id}`}
      >
        <div className="w-full h-full align-top relative">
          <img
            src={photoDataUrl}
            className="w-full h-full object-cover min-h-[15rem]"
          />

          <div className="absolute top-0 p-3 bg-black bg-opacity-40 w-full">
            {renderPlantTitle()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/plant-site/${props.id}`}>
      <div className="w-full">{renderPlantInfo()}</div>
    </Link>
  );
}
