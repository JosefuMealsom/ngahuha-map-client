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

    const downloadedPhotos = photos.filter((photo) => photo.data);

    const photoUrls = await Promise.all(
      downloadedPhotos.map(async (photo) => {
        const blobData = new Blob([photo.data as ArrayBuffer]);
        const dataUrl = await blobToDataUrlService.convert(blobData);
        return {
          id: photo.id,
          dataUrl: dataUrl || '',
          metadata: photo.metadata,
        };
      }),
    );

    setPlantSitePhotoUrls(photoUrls);
  };

  useEffect(() => {
    getPlantDataPhotoUrls();
  }, []);

  return plantSitePhotoUrls;
}
