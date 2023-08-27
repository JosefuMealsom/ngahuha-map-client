import { Link } from 'react-router-dom';
import { Plant } from '../../../types/api/plant.type';
import { getFullPlantName } from '../../../utils/plant-name-decorator.util';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  plantSitePhotoTable,
  plantSiteTable,
} from '../../../services/offline.database';
import { useEffect, useState } from 'react';
import blobToDataUrlService from '../../../services/blob-to-data-url.service';
import { PlantTitleComponent } from '../../../components/PlantTitleComponent';

export function PlantItemComponent(props: Plant) {
  const firstPlantSite = useLiveQuery(() =>
    plantSiteTable.where({ plantId: props.id }).first(),
  );
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (!firstPlantSite) return;

    const getPlantImage = async () => {
      const previewImage = await plantSitePhotoTable
        .where({ plantSiteId: firstPlantSite.id })
        .first();

      if (!previewImage) return;

      const photoData = await blobToDataUrlService.convert(
        new Blob([previewImage.data]),
      );

      if (photoData) {
        setPreviewImage(photoData);
      }
    };

    getPlantImage();
  }, [firstPlantSite]);

  function renderImage() {
    if (previewImage.length === 0) return;

    return <img src={previewImage} className="w-full h-full object-cover" />;
  }

  function renderPlantInfo() {
    return (
      <div className="h-full sm:h-96 cursor-pointer hover:opacity-90 bg-white">
        <div className="w-full h-full relative min-h-[15rem]">
          {renderImage()}
          <div className="absolute top-0 p-3 bg-black bg-opacity-40 w-full">
            <PlantTitleComponent {...props} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/plants/${props.id}`}>
      <div className="w-full">{renderPlantInfo()}</div>
    </Link>
  );
}
