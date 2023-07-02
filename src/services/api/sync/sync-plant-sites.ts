import { fetchBlobUploadUrl, uploadBlob } from './blob-uploader.service';
import {
  plantSitePhotoUploadTable,
  plantSiteUploadTable,
} from '../../offline.database';
import { getFullApiPath } from '../../../utils/api-url.util';
import { serializeCreatePlantSite } from './plant-site-create.serializer';

export const uploadPlantSitesToServer = () => {
  uploadPhotoBlobs();
  uploadPlantSites();
};

const uploadPhotoBlobs = async () => {
  const plantSitePhotos = await plantSitePhotoUploadTable.toArray();
  await Promise.all(
    plantSitePhotos.map(async (photo) => {
      // Don't upload to the server twice if some failure later on
      if (photo.blobKey) {
        return;
      }

      const { url, blobKey } = await fetchBlobUploadUrl();
      await uploadBlob(url, photo.data);

      await plantSitePhotoUploadTable.update(photo, { blobKey: blobKey });
    }),
  );
};

const uploadPlantSites = async () => {
  const plantSiteUploads = await plantSiteUploadTable.toArray();

  const createJSON = await Promise.all(
    plantSiteUploads.map(async (plantSite) =>
      serializeCreatePlantSite(plantSite),
    ),
  );

  await fetch(getFullApiPath('plant-site/bulk'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createJSON),
  });

  await Promise.all(
    plantSiteUploads.map((plantSiteUpload) => {
      if (!plantSiteUpload.id) {
        return;
      }
    }),
  );
};
