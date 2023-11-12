import { LoaderFunctionArgs } from 'react-router-dom';
import {
  blobDataTable,
  plantSiteUploadPhotoTable,
  plantSiteUploadTable,
  plantTable,
} from '../../../services/offline.database';
import { PhotoFile } from '../../../types/api/upload/plant-site-upload.type';
import { migrateUploadPhotosToSeparateTable } from '../../../services/migrate-plant-site-upload-photos.service';

const loadPlant = async (plantId?: string) => {
  if (!plantId) return;

  return plantTable.get(plantId);
};

const loadPhotos = async (plantSiteUploadId: number) => {
  const plantSiteUploadPhotos = await plantSiteUploadPhotoTable
    .where({ plantSiteUploadId: plantSiteUploadId })
    .toArray();

  const photoFiles: PhotoFile[] = [];

  for (const uploadPhoto of plantSiteUploadPhotos) {
    const photoData = await blobDataTable.get(uploadPhoto.blobDataId);
    const previewPhotoData = await blobDataTable.get(
      uploadPhoto.previewPhotoBlobDataId,
    );

    photoFiles.push({
      id: crypto.randomUUID(),
      file: new Blob([photoData!.data]),
      previewPhotoFile: new Blob([previewPhotoData!.data]),
      primaryPhoto: uploadPhoto.primaryPhoto,
    });
  }

  return photoFiles;
};

export const loadPlantSiteUploadWithPhotos = async (
  loaderArgs: LoaderFunctionArgs,
) => {
  if (loaderArgs.params.id) {
    const plantSiteUpload = await plantSiteUploadTable.get(
      Number(loaderArgs.params.id),
    );

    if (!plantSiteUpload) {
      throw Error('Plant site not found');
    }

    const plant = await loadPlant(plantSiteUpload.plantId);
    if (plantSiteUpload.photos) {
      await migrateUploadPhotosToSeparateTable(plantSiteUpload);
    }
    const photoFiles = await loadPhotos(plantSiteUpload.id!);

    return {
      plantSiteUpload: plantSiteUpload,
      plant: plant,
      photos: photoFiles,
    };
  }

  throw Error('Url invalid');
};
