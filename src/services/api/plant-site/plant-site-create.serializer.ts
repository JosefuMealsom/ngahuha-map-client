import { PlantSiteUpload } from '../../../types/api/upload/plant-site-upload.type';
import {
  blobDataTable,
  plantSiteUploadPhotoTable,
} from '../../offline.database';

export const serializeCreatePlantSite = async (
  plantSiteUpload: PlantSiteUpload,
) => {
  const photos = await plantSiteUploadPhotoTable
    .where({
      plantSiteUploadId: plantSiteUpload.id,
    })
    .toArray();

  const plantPhotosJSON: { blobKey: string; primaryPhoto: boolean }[] = [];

  for (const photo of photos) {
    const blob = await blobDataTable.get(photo.blobDataId);

    if (!blob) throw new Error(`Photo ${photo.id} missing blob data`);
    if (!blob.blobKey) throw new Error(`Photo ${photo.id} not uploaded yet`);

    plantPhotosJSON.push({
      blobKey: blob.blobKey,
      primaryPhoto: photo.primaryPhoto,
    });
  }

  return {
    accuracy: plantSiteUpload.accuracy,
    latitude: plantSiteUpload.latitude,
    longitude: plantSiteUpload.longitude,
    plantId: plantSiteUpload.plantId,
    plantSitePhotos: plantPhotosJSON,
  };
};
