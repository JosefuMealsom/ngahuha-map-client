import { useLiveQuery } from 'dexie-react-hooks';
import {
  plantSitePhotoTable,
  plantSiteTable,
} from '../services/offline.database';
import { useEffect, useState } from 'react';
import { PlantSitePhoto } from '../types/api/plant-site-photo.type';
import blobToDataUrlService from '../services/blob-to-data-url.service';

export function usePlantPhotos(plantId: string) {
  const [photos, setPhotos] = useState<{ id: string; dataUrl: string }[]>([]);
  const plantSites = useLiveQuery(() =>
    plantSiteTable.where({ plantId: plantId }).toArray(),
  );

  useEffect(() => {
    const getPhotos = async () => {
      if (!plantSites || plantSites?.length === 0) return;

      const photos = await plantSitePhotoTable
        .where({
          plantSiteId: plantSites[0].id,
        })
        .toArray();

      const convertedPhotos = await Promise.all(
        photos.map(async (photo: PlantSitePhoto) => {
          const dataUrl = await blobToDataUrlService.convert(
            new Blob([photo.data]),
          );
          return {
            id: photo.id,
            dataUrl: dataUrl || '',
          };
        }),
      );

      setPhotos(convertedPhotos);
    };

    getPhotos();
  }, [plantSites]);

  return photos;
}
