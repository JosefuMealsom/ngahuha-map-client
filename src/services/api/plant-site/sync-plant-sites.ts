import { fetchBlobUploadUrl, uploadBlob } from '../sync/blob-uploader.service';
import {
  blobDataTable,
  plantSiteUploadPhotoTable,
  plantSiteUploadTable,
} from '../../offline.database';
import { serializeCreatePlantSite } from './plant-site-create.serializer';
import { PlantSiteUpload } from '../../../types/api/upload/plant-site-upload.type';
import axiosClient from '../../axios/axios-client';

export const bulkUploadPlantSitesToServer = async (
  plantSiteUploads: PlantSiteUpload[],
) => {
  // run uploads sequentially to the server
  // as the photo files are huge and don't
  // want to overload the render view
  for (const upload of plantSiteUploads) {
    await uploadPlantSiteToServer(upload);
  }
};

export const uploadPlantSiteToServer = async (
  plantSiteUpload: PlantSiteUpload,
) => {
  await uploadPhotoBlobs(plantSiteUpload);

  await uploadPlantSite(plantSiteUpload).then(
    async () => await clearPlantUpload(plantSiteUpload),
  );
};

const uploadPhotoBlobs = async (plantSiteUpload: PlantSiteUpload) => {
  const plantSitePhotos = await plantSiteUploadPhotoTable
    .where({ plantSiteUploadId: plantSiteUpload.id })
    .toArray();

  const photoBlobIds = plantSitePhotos.map((photo) => photo.blobDataId);
  const photoBlobs = await blobDataTable.bulkGet(photoBlobIds);

  return Promise.all(
    photoBlobs.map(async (blob) => {
      if (!blob) {
        throw Error('Blob data not found');
      }

      // On server upload failure, don't upload blob again
      if (blob.blobKey) {
        return { id: blob.id, blobKey: blob.blobKey };
      }

      const { url, blobKey } = await fetchBlobUploadUrl();
      await uploadBlob(url, blob.data);

      return { id: blob.id, blobKey: blobKey };
    }),
  ).then(async (blobData) => {
    for (const { id, blobKey } of blobData) {
      await blobDataTable.update(id!, { blobKey: blobKey });
    }
  });
};

const uploadPlantSite = async (plantSite: PlantSiteUpload) => {
  const createJSON = await serializeCreatePlantSite(plantSite);

  return axiosClient.post('plant-site', createJSON);
};

const clearPlantUpload = async (plantSiteUpload: PlantSiteUpload) => {
  const photoUploadsToDelete = await plantSiteUploadPhotoTable
    .where({ plantSiteUploadId: plantSiteUpload.id })
    .toArray();

  const blobIds = photoUploadsToDelete.map((photo) => photo.blobDataId);
  const previewBlobIds = photoUploadsToDelete.map(
    (photo) => photo.previewPhotoBlobDataId,
  );

  await blobDataTable.bulkDelete(blobIds.concat(previewBlobIds));
  await plantSiteUploadPhotoTable.bulkDelete(
    photoUploadsToDelete.map(({ id }) => id!),
  );
  await plantSiteUploadTable.delete(plantSiteUpload.id as number);
};
