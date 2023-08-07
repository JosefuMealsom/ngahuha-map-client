import { fetchBlobUploadUrl, uploadBlob } from './blob-uploader.service';
import {
  plantSitePhotoUploadTable,
  plantSiteUploadTable,
} from '../../offline.database';
import { getFullApiPath } from '../../../utils/api-url.util';
import { serializeCreatePlantSite } from './plant-site-create.serializer';
import { PlantSiteUpload } from '../../../types/api/upload/plant-site-upload.type';
import { PlantSitePhotoUpload } from '../../../types/api/upload/plant-site-photo-upload.type';

export const bulkUploadPlantSitesToServer = (
  plantSiteUploads: PlantSiteUpload[],
) => {
  return Promise.all(
    plantSiteUploads.map((plantSite) => uploadPlantSiteToServer(plantSite)),
  );
};

export const uploadPlantSiteToServer = async (
  plantSiteUpload: PlantSiteUpload,
) => {
  const plantSitePhotos = await plantSitePhotosForPlantSiteUpload(
    plantSiteUpload,
  );

  await uploadPhotoBlobs(plantSitePhotos);
  await uploadPlantSite(plantSiteUpload).then(async (response) => {
    if (!response.ok) {
      throw Error(`Upload failed: ${response.status}`);
    }

    await clearPlantUpload(plantSiteUpload);
  });
};

const uploadPhotoBlobs = async (
  plantSitePhotoUploads: PlantSitePhotoUpload[],
) => {
  await Promise.all(
    plantSitePhotoUploads.map(async (photo) => {
      // Don't upload to the server twice if some failure later on
      if (photo.blobKey) {
        return;
      }

      const { url, blobKey } = await fetchBlobUploadUrl();
      await uploadBlob(url, photo.data);

      await plantSitePhotoUploadTable.update(photo, { blobKey: blobKey });
    }),
  );
};

const uploadPlantSite = async (plantSite: PlantSiteUpload) => {
  const createJSON = await serializeCreatePlantSite(plantSite);

  return fetch(getFullApiPath('plant-site'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createJSON),
  });
};

const clearPlantUpload = async (plantSiteUpload: PlantSiteUpload) => {
  const photosToDelete = await plantSitePhotosForPlantSiteUpload(
    plantSiteUpload,
  );

  const idsToDelete = photosToDelete.map(
    (photo: PlantSitePhotoUpload) => photo.id,
  );

  // Only have to do this due to the autoindexing of the ids
  // when we create a new upload
  const filteredIds = idsToDelete.filter(
    (id): id is number => id !== undefined,
  );

  await plantSiteUploadTable.bulkDelete(filteredIds);
  await plantSiteUploadTable.delete(plantSiteUpload.id as number);
};

const plantSitePhotosForPlantSiteUpload = async (
  plantSiteUpload: PlantSiteUpload,
): Promise<PlantSitePhotoUpload[]> => {
  return await plantSitePhotoUploadTable
    .where({ plantSiteUploadId: plantSiteUpload.id })
    .toArray();
};
