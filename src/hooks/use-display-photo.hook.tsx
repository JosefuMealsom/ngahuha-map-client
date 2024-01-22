import { useLiveQuery } from 'dexie-react-hooks';
import { plantSitePhotoTable } from '../services/offline.database';
import { useEffect, useState } from 'react';
import blobToDataUrlService from '../services/blob-to-data-url.service';

export function useDisplayPhoto(plantSiteId?: string) {
  const [photo, setPhoto] = useState<{ id: string; dataUrl: string }>();

  const plantSitePhotos = useLiveQuery(
    () =>
      plantSitePhotoTable.where({ plantSiteId: plantSiteId || '' }).toArray(),
    [plantSiteId],
  );

  useEffect(() => {
    const getPhoto = async () => {
      if (!plantSitePhotos || plantSitePhotos?.length === 0) return;

      const downloadedPhotos = plantSitePhotos.filter((photo) => photo.data);
      downloadedPhotos.sort(
        (a, b) => Number(b.primaryPhoto) - Number(a.primaryPhoto),
      );

      const displayPhoto = downloadedPhotos[0];

      const dataUrl = await blobToDataUrlService.convert(
        new Blob([displayPhoto.data as ArrayBuffer]),
      );

      if (dataUrl) {
        setPhoto({ id: displayPhoto.id, dataUrl: dataUrl || '' });
      }
    };
    getPhoto();
  }, [plantSitePhotos]);

  return photo;
}
