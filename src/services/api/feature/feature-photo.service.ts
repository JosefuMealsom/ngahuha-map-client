import { featurePhotoTable } from '../../offline.database';
import apiFetchUtil from '../../../utils/api-fetch.util';
import { loadBlob } from '../../image-loader.service';
import { FeaturePhoto } from '../../../types/api/feature-photo.type';
import axiosClient from '../../axios/axios-client';

type FeaturePhotoResponse = {
  id: string;
  featureId: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  metadata?: { [key: string]: any };
};

export const fetchFeaturePhotos = (): Promise<FeaturePhotoResponse[]> => {
  return new Promise(async (success) => {
    const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
      featurePhotoTable,
      'feature-photo',
    );

    const featurePhotos = dataToJSON.map(
      (photo: FeaturePhotoResponse): FeaturePhotoResponse => {
        return {
          id: photo.id,
          featureId: photo.featureId,
          url: photo.url,
          createdAt: photo.createdAt,
          updatedAt: photo.updatedAt,
          metadata: photo.metadata,
        };
      },
    );

    success(featurePhotos);
  });
};

export const updateFeaturePhotoViewPriority = async (
  photoId: string,
  newPriority: number,
) => {
  const metadata = { viewPriority: newPriority };
  const response = await axiosClient.patch(
    `/feature-photo/${photoId}`,
    metadata,
  );

  return featurePhotoTable.update(photoId, {
    metadata: response.data.metadata,
  });
};

export const syncPhotoFilesOffline = async () => {
  const featurePhotos = await featurePhotoTable.toArray();
  const notDownloadedPhotos = featurePhotos.filter((photo) => !photo.data);

  return Promise.all(
    notDownloadedPhotos.map(async (data) => {
      const blobData = await loadBlob(data.url);
      const photoBuffer = await blobData.arrayBuffer();

      featurePhotoTable.update(data.id, { data: photoBuffer });
    }),
  );
};

export const syncFeaturePhotosOffline = (): Promise<FeaturePhoto[]> => {
  return new Promise(async (success) => {
    const featurePhotos = await fetchFeaturePhotos();
    const transformedModels =
      await transformToOfflinePhotoModels(featurePhotos);
    await featurePhotoTable.bulkPut(transformedModels);

    success(transformedModels);
  });
};

const transformToOfflinePhotoModels = async (
  photoData: FeaturePhotoResponse[],
): Promise<FeaturePhoto[]> => {
  return Promise.all(
    photoData.map(async (data) => {
      return {
        id: data.id,
        featureId: data.featureId,
        url: data.url,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        metadata: data.metadata,
      };
    }),
  );
};
