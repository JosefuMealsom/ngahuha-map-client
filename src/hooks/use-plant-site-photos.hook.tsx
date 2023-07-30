import { useEffect, useState } from 'react';
import { plantSitePhotoTable } from '../services/offline.database';
import blobToDataUrlService from '../services/blob-to-data-url.service';

export function usePlantSitePhotos(plantSiteId: string) {
  const [plantSitePhotoUrls, setPlantSitePhotoUrls] =
    useState<{ id: string; dataUrl: string }[]>();

  const getPlantDataPhotoUrls = async () => {
    const photos = await plantSitePhotoTable
      .where({ plantSiteId: plantSiteId })
      .toArray();

    const photoUrls = await Promise.all(
      photos.map(async (photo) => {
        const blobData = new Blob([photo.data]);
        const dataUrl = await blobToDataUrlService.convert(blobData);
        return { id: photo.id, dataUrl: dataUrl || '' };
      }),
    );

    setPlantSitePhotoUrls(photoUrls);
  };

  useEffect(() => {
    getPlantDataPhotoUrls();
  }, []);

  return plantSitePhotoUrls;
}
