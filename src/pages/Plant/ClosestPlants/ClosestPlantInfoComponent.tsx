import { useEffect, useState } from 'react';
import { plantSitePhotoTable } from '../../../services/offline.database';
import { PlantSite } from '../../../types/api/plant-site.type';
import blobToDataUrlService from '../../../services/blob-to-data-url.service';
import { usePlant } from '../../../hooks/use-plant.hook';
import { Link } from 'react-router-dom';
import { PlantTitleComponent } from '../../../components/PlantTitleComponent';

export function ClosestPlantInfoComponent(props: PlantSite) {
  const plant = usePlant(props.plantId);
  const [photoDataUrl, setPhotoDataUrl] = useState<string>();

  const getPlantInfo = async () => {
    const plantSitePhotos = await plantSitePhotoTable
      .where({ plantSiteId: props.id })
      .toArray();

    let primaryPhoto = plantSitePhotos.find(
      (photo) => photo.primaryPhoto === true,
    );

    if (!primaryPhoto) {
      primaryPhoto = plantSitePhotos[0];
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

  function renderPlantInfo() {
    if (!plant) return;

    return (
      <div
        className="h-96 cursor-pointer sm:hover:opacity-90 bg-white"
        data-cy={`closest-plant-site-${props.id}`}
      >
        <div className="w-full h-full align-top relative">
          <img src={photoDataUrl} className="w-full h-full object-cover" />

          <div className="absolute top-0">
            <PlantTitleComponent {...plant} />
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
