import { fetchBlobUploadUrl, uploadBlob } from './blob-uploader.service';
import { plantSiteUploadTable } from '../../offline.database';
import { getFullApiPath } from '../../../utils/api-url.util';
import { serializeCreatePlantSite } from './plant-site-create.serializer';
import { PlantSiteUpload } from '../../../types/api/upload/plant-site-upload.type';

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
  const photos = await uploadPhotoBlobs(plantSiteUpload);

  // Save the result of uploading the photos to the server
  const updatedUpload = { ...plantSiteUpload, photos: photos };
  await plantSiteUploadTable.put({ ...updatedUpload });

  await uploadPlantSite(updatedUpload).then(async (response) => {
    if (!response.ok) {
      throw Error(
        `Upload failed: ${response.status}, ${(await response.json()).message}`,
      );
    }

    await clearPlantUpload(plantSiteUpload);
  });
};

const uploadPhotoBlobs = async (plantSiteUpload: PlantSiteUpload) => {
  return Promise.all(
    plantSiteUpload.photos.map(async (photo) => {
      // On server upload failure, don't upload blob again
      if (photo.blobKey) {
        return photo;
      }

      const { url, blobKey } = await fetchBlobUploadUrl();
      await uploadBlob(url, photo.data);

      return { ...photo, blobKey: blobKey };
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
  await plantSiteUploadTable.delete(plantSiteUpload.id as number);
};
