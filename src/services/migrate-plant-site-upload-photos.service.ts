import { PlantSiteUpload } from '../types/api/upload/plant-site-upload.type';
import { blobDataTable, plantSiteUploadPhotoTable } from './offline.database';
import { generateImagePreview } from './preview-image-generator';

export const migrateUploadPhotosToSeparateTable = async (
  plantSiteUpload: PlantSiteUpload,
) => {
  const { photos, id } = plantSiteUpload;

  if (!photos) return;
  const uploads = await plantSiteUploadPhotoTable
    .where({ plantSiteUploadId: id })
    .toArray();

  if (uploads.length > 0) return;

  for (const photo of photos) {
    const previewImage = await generateImagePreview(new Blob([photo.data]));
    const photoBlobId = await blobDataTable.add({ data: photo.data });
    const previewBlobId = await blobDataTable.add({
      data: await previewImage.arrayBuffer(),
    });

    await plantSiteUploadPhotoTable.add({
      plantSiteUploadId: id!,
      blobDataId: photoBlobId,
      previewPhotoBlobDataId: previewBlobId,
      primaryPhoto: photo.primaryPhoto,
    });
  }
};
