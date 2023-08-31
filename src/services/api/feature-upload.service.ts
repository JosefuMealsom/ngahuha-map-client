import { LatLong } from '../../types/lat-long.type';
import offlineDatabase, {
  featurePhotoUploadTable,
  featureUploadTable,
} from '../offline.database';

export const putFeatureWithPhotos = async (
  name: string,
  description: string,
  location: LatLong,
  photoBlobs: Blob | Blob[],
  featureId?: number,
) => {
  //convert to array if only 1 photo passed as a parameter
  const photos = await Promise.all(
    [photoBlobs].flat().map(async (blob) => blob.arrayBuffer()),
  );

  return addFeatureUpload(name, description, location, photos, featureId);
};

export const deleteFeatureUpload = async (id: number) => {
  const featurePhotos = await featurePhotoUploadTable
    .where({ featureUploadId: id })
    .toArray();

  await featurePhotoUploadTable.bulkDelete(
    featurePhotos.map(({ id }) => id as number),
  );

  return featureUploadTable.delete(id);
};

const addFeatureUpload = (
  name: string,
  description: string,
  location: LatLong,
  photos: ArrayBuffer[],
  id?: number,
) => {
  return offlineDatabase.transaction(
    'rw',
    featureUploadTable,
    featurePhotoUploadTable,
    async () => {
      const featureUploadId = await featureUploadTable.put({
        id: id,
        name: name,
        description: description,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
      });

      if (id) {
        await deleteExistingPhotos(id);
      }

      for (const photoData of photos) {
        await featurePhotoUploadTable.add({
          data: photoData,
          featureUploadId: featureUploadId,
        });
      }
    },
  );
};

const deleteExistingPhotos = async (featureUploadId: number) => {
  const existingPhotos = await featurePhotoUploadTable
    .where({ featureUploadId: featureUploadId })
    .toArray();

  for (const photo of existingPhotos) {
    if (photo.id) {
      await featurePhotoUploadTable.delete(photo.id);
    }
  }
};
