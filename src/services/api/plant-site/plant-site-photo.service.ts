import { plantSitePhotoTable, plantSiteTable } from '../../offline.database';
import apiFetchUtil from '../../../utils/api-fetch.util';
import { PlantSitePhoto } from '../../../types/api/plant-site-photo.type';
import { loadBlob } from '../../image-loader.service';

type PlantSitePhotoResponse = {
  id: string;
  plantSiteId: string;
  createdAt: string;
  updatedAt: string;
  url: string;
};

export const fetchPlantSitePhotos = (): Promise<PlantSitePhotoResponse[]> => {
  return new Promise(async (success) => {
    const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
      plantSitePhotoTable,
      'plant-site-photo',
    );

    const plantSitePhotos = dataToJSON.map(
      (photo: PlantSitePhotoResponse): PlantSitePhotoResponse => {
        return {
          id: photo.id,
          plantSiteId: photo.plantSiteId,
          url: photo.url,
          createdAt: photo.createdAt,
          updatedAt: photo.updatedAt,
        };
      },
    );

    success(plantSitePhotos);
  });
};

export const syncPhotoFilesOffline = async () => {
  const plantSitePhotos = await plantSitePhotoTable.toArray();
  const notDownloadedPhotos = plantSitePhotos.filter((photo) => !photo.data);

  return Promise.all(
    notDownloadedPhotos.map(async (data) => {
      const blobData = await loadBlob(data.url);
      const photoBuffer = await blobData.arrayBuffer();

      plantSitePhotoTable.update(data.id, { data: photoBuffer });
    }),
  );
};

export const syncPlantSitePhotosOffline = (): Promise<PlantSitePhoto[]> => {
  return new Promise(async (success) => {
    const plantSitePhotos = await fetchPlantSitePhotos();
    const transformedModels =
      await transformToOfflinePhotoModels(plantSitePhotos);
    await plantSitePhotoTable.bulkPut(transformedModels);

    success(transformedModels);
  });
};

const transformToOfflinePhotoModels = async (
  photoData: PlantSitePhotoResponse[],
): Promise<PlantSitePhoto[]> => {
  return Promise.all(
    photoData.map(async (data) => {
      return {
        id: data.id,
        plantSiteId: data.plantSiteId,
        url: data.url,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }),
  );
};
