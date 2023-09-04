import { useEffect, useState } from 'react';
import { plantSitePhotoTable } from '../services/offline.database';
import blobToDataUrlService from '../services/blob-to-data-url.service';
import { useLiveQuery } from 'dexie-react-hooks';

export function usePlantSitePhotos(plantSiteId: string) {
  const photos = useLiveQuery(() =>
    plantSitePhotoTable.where({ plantSiteId: plantSiteId }).toArray(),
  );

  const [plantSitePhotoUrls, setPlantSitePhotoUrls] =
    useState<{ id: string; dataUrl: string; primaryPhoto: boolean }[]>();

  const getPlantDataPhotoUrls = async () => {
    if (!photos) return;

    const downloadedPhotos = photos.filter((photo) => photo.data);

    const photoUrls = await Promise.all(
      downloadedPhotos.map(async (photo) => {
        const blobData = new Blob([photo.data as ArrayBuffer]);
        const dataUrl = await blobToDataUrlService.convert(blobData);
        return {
          id: photo.id,
          dataUrl: dataUrl || '',
          primaryPhoto: photo.primaryPhoto,
        };
      }),
    );

    setPlantSitePhotoUrls(photoUrls);
  };

  useEffect(() => {
    getPlantDataPhotoUrls();
  }, [photos]);

  return plantSitePhotoUrls;
}
