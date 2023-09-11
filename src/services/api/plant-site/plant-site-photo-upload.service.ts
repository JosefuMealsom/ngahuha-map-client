import type { PlantSitePhotoUpload } from '../../../types/api/upload/plant-site-upload.type';
import axiosClient from '../../axios/axios-client';
import offlineDatabase, {
  blobDataTable,
  plantSitePhotoUploadTable,
} from '../../offline.database';
import { uploadBlobData } from '../sync/blob-uploader.service';

export const addPlantSitePhotoUpload = async (
  plantSiteId: string,
  file: Blob | File,
) => {
  const data = await file.arrayBuffer();

  return offlineDatabase.transaction(
    'rw',
    blobDataTable,
    plantSitePhotoUploadTable,
    async () => {
      const blobId = await blobDataTable.add({ data: data });

      return plantSitePhotoUploadTable.add({
        plantSiteId: plantSiteId,
        blobDataId: blobId,
      });
    },
  );
};

export const uploadAllPlantPhotosToServer = async (
  photoUploads: PlantSitePhotoUpload[],
) => {
  for (const upload of photoUploads) {
    await syncPlantSitePhotoUploadToServer(upload);
  }
};

export const syncPlantSitePhotoUploadToServer = async (
  photoUpload: PlantSitePhotoUpload,
) => {
  const blobData = await blobDataTable.get(photoUpload.blobDataId);
  if (!blobData) throw Error('No blob data found');

  const blobKey = await uploadBlobData(blobData);

  await axiosClient.post('plant-site-photo', {
    blobKey: blobKey,
    plantSiteId: photoUpload.plantSiteId,
  });
  return clearPlantSitePhotoUpload(photoUpload.id!);
};

const clearPlantSitePhotoUpload = async (id: number) => {
  const photoUpload = await plantSitePhotoUploadTable.get(id);
  if (photoUpload) {
    await blobDataTable.delete(photoUpload.blobDataId);
    await plantSitePhotoUploadTable.delete(id);
  } else {
    throw Error('No photo upload found');
  }
};
