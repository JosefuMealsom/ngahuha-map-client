import offlineDatabase, { plantSitePhotoTable } from '../../offline.database';
import apiFetchUtil from '../../../utils/api-fetch.util';
import { PlantSitePhoto } from '../../../types/api/plant-site-photo.type';
import { loadBlob } from '../../image-loader.service';
import axiosClient from '../../axios/axios-client';
import { partition } from 'underscore';

type PlantSitePhotoResponse = {
  id: string;
  plantSiteId: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  metadata?: { [key: string]: any };
  primaryPhoto: boolean;
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
          metadata: photo.metadata,
          primaryPhoto: photo.primaryPhoto,
        };
      },
    );

    success(plantSitePhotos);
  });
};

export const syncPlantSitePhotoFilesOffline = async () => {
  const plantSitePhotos = await plantSitePhotoTable.toArray();
  const notDownloadedPhotos = plantSitePhotos.filter((photo) => !photo.data);

  const [primaryPhotosNotDownloaded, otherPhotosNotDownloaded] = partition(
    notDownloadedPhotos,
    (photo) => photo.primaryPhoto,
  );

  await downloadPhotosOffline(primaryPhotosNotDownloaded);
  await downloadPhotosOffline(otherPhotosNotDownloaded);
};

const downloadPhotosOffline = (photos: PlantSitePhoto[]) => {
  return Promise.all(
    photos.map(async (data) => {
      const blobData = await loadBlob(data.url);
      const photoBuffer = await blobData.arrayBuffer();

      plantSitePhotoTable.update(data.id, { data: photoBuffer });
    }),
  );
};

export const deletePlantPhoto = async (id: string) => {
  await axiosClient.delete(`plant-site-photo/${id}`);

  plantSitePhotoTable.delete(id);
};

export const syncPlantSitePhotosOffline = (): Promise<PlantSitePhoto[]> => {
  return new Promise(async (success) => {
    const plantSitePhotos = await fetchPlantSitePhotos();
    const transformedModels =
      await transformToOfflinePhotoModels(plantSitePhotos);

    // need to do this as a put will overwrite the photo file data, which will
    // make it so the image is downloaded again. Need to think of another way.
    // Possibly could have a separate data table.
    await offlineDatabase.transaction('rw', [plantSitePhotoTable], async () => {
      for (const photo of transformedModels) {
        const plantSitePhoto = await plantSitePhotoTable.get(photo.id);

        if (!plantSitePhoto) {
          await plantSitePhotoTable.put(photo);
        } else {
          await plantSitePhotoTable.update(photo.id, { ...photo });
        }
      }
    });

    success(transformedModels);
  });
};

export const updatePlantPrimaryPhoto = async (updatedPhotoId: string) => {
  const response = await axiosClient.patch(
    `/plant-site-photo/${updatedPhotoId}`,
    {
      primaryPhoto: 'true',
    },
  );

  const plantSiteId = (await plantSitePhotoTable.get(updatedPhotoId))
    ?.plantSiteId;

  const allPhotosForSite = await plantSitePhotoTable
    .where({ plantSiteId: plantSiteId })
    .toArray();

  for (const photo of allPhotosForSite) {
    await plantSitePhotoTable.update(photo.id, { primaryPhoto: false });
  }

  const updatedPrimaryPhoto = await plantSitePhotoTable.update(updatedPhotoId, {
    primaryPhoto: response.data.primaryPhoto,
  });

  return updatedPrimaryPhoto;
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
        metadata: data.metadata,
        primaryPhoto: data.primaryPhoto,
      };
    }),
  );
};
