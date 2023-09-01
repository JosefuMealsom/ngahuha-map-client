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
    const photo = await plantSitePhotoTable
      .where({
        plantSiteId: props.id,
      })
      .first();

    if (!photo || !photo?.data) return;
    const blobData = new Blob([photo.data]);
    setPhotoDataUrl((await blobToDataUrlService.convert(blobData)) || '');
  };

  useEffect(() => {
    getPlantInfo();
  }, []);

  function renderPlantInfo() {
    if (!plant) return;

    return (
      <div
        className="h-full sm:h-96 cursor-pointer hover:opacity-90 bg-white"
        data-cy={`closest-plant-site-${props.id}`}
      >
        <div className="w-full h-full align-top relative">
          <img src={photoDataUrl} className="w-full h-full object-cover" />

          <div className="absolute top-0 p-3 bg-black bg-opacity-40 w-full">
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
