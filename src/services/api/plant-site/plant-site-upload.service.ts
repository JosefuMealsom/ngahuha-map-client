import { LatLong } from '../../../types/lat-long.type';
import offlineDatabase, {
  blobDataTable,
  plantSiteUploadPhotoTable,
  plantSiteUploadTable,
  plantTable,
} from '../../offline.database';

class PlantIdMissingError extends Error {
  constructor(plantId: string) {
    super(`Plant with id: '${plantId}' not found`);
    this.name = 'PlantIdMissingError';
  }
}

type PhotoFileData = {
  file: Blob;
  previewPhotoFile: Blob;
  primaryPhoto: boolean;
};
type ConvertedPhotoFileData = {
  data: ArrayBuffer;
  previewFileData: ArrayBuffer;
  primaryPhoto: boolean;
};

export const addPlantSiteWithPhoto = async (
  photoFiles: PhotoFileData | PhotoFileData[],
  location: LatLong,
  plantId?: string,
  plantSiteUploadId?: number,
) => {
  const photos = await Promise.all(
    [photoFiles].flat().map(async (photoFile) => {
      const convertedData = await photoFile.file.arrayBuffer();
      const previewFileData = await photoFile.previewPhotoFile.arrayBuffer();
      return {
        data: convertedData,
        previewFileData: previewFileData,
        primaryPhoto: photoFile.primaryPhoto,
      };
    }),
  );

  if (plantId) {
    await validatePlantExists(plantId);
  }

  return addPlantSiteUpload(location, photos, plantId, plantSiteUploadId);
};

export const deletePlantSite = async (id: number) => {
  return offlineDatabase.transaction(
    'rw',
    blobDataTable,
    plantSiteUploadTable,
    plantSiteUploadPhotoTable,
    async () => {
      await plantSiteUploadTable.delete(id);
      const plantSiteUploadPhotos = await plantSiteUploadPhotoTable
        .where({
          plantSiteUploadId: id,
        })
        .toArray();

      for (const photo of plantSiteUploadPhotos) {
        await blobDataTable.delete(photo.blobDataId);
        await blobDataTable.delete(photo.previewPhotoBlobDataId);
        await plantSiteUploadPhotoTable.delete(photo.id!);
      }
    },
  );
};

const validatePlantExists = async (plantId: string) => {
  const plant = await plantTable.get(plantId);

  if (!plant) {
    throw new PlantIdMissingError(plantId);
  }
};

const addPlantSiteUpload = async (
  location: LatLong,
  photoData: ConvertedPhotoFileData[],
  plantId?: string,
  id?: number,
) => {
  if (id) await deletePlantSite(id);

  return offlineDatabase.transaction(
    'rw',
    blobDataTable,
    plantSiteUploadTable,
    plantSiteUploadPhotoTable,
    async () => {
      const plantSiteUploadId = await plantSiteUploadTable.put({
        id: id,
        plantId: plantId,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
      });

      for (const photo of photoData) {
        const photoBlobId = await blobDataTable.add({ data: photo.data });
        const previewBlobId = await blobDataTable.add({
          data: photo.previewFileData,
        });

        await plantSiteUploadPhotoTable.add({
          plantSiteUploadId: plantSiteUploadId,
          blobDataId: photoBlobId,
          previewPhotoBlobDataId: previewBlobId,
          primaryPhoto: photo.primaryPhoto,
        });
      }
    },
  );
};
