import 'fake-indexeddb/auto';
import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import {
  blobDataTable,
  plantSitePhotoUploadTable,
  plantSiteTable,
} from '../../offline.database';
import { stubArrayBufferCall } from '../../../test-helpers/blob-stub';
import plantSiteFactory from '../../../test-helpers/factories/plant-site';
import {
  addPlantSitePhotoUpload,
  syncPlantSitePhotoUploadToServer,
} from './plant-site-photo-upload.service';
import { mockApiCall } from '../../../test-helpers/fetch-stub';
import blobDataFactory from '../../../test-helpers/factories/blob-data';
import plantSitePhotoUploadFactory from '../../../test-helpers/factories/plant-site-photo-upload';
import { getFullApiPath } from '../../../utils/api-url.util';

describe('PlantSiteUploadService', () => {
  beforeEach(() => {
    stubArrayBufferCall();
  });

  afterEach(async () => {
    await plantSitePhotoUploadTable.clear();
    await blobDataTable.clear();
    await plantSiteTable.clear();
  });

  describe('addPlantSitePhotoUpload()', () => {
    describe('adding a new photo to a plant site', () => {
      beforeEach(async () => {
        await plantSiteTable.add(plantSiteFactory.create({ id: 'abc' }));
      });

      it('adds a new plant site photo upload and saves it offline', async () => {
        const blob = new Blob();
        await addPlantSitePhotoUpload('abc', blob);
        const savedPlantSitePhotoData =
          await plantSitePhotoUploadTable.toArray();
        const savedBlobData = await blobDataTable.toArray();

        expect(savedPlantSitePhotoData.length).toEqual(1);
        expect(savedBlobData.length).toEqual(1);

        const [photo] = savedPlantSitePhotoData;
        expect(photo.plantSiteId).toEqual('abc');
        expect(photo.blobDataId).toEqual(savedBlobData[0].id);
      });
    });
  });

  describe('syncPlantSitePhotoUploadToServer()', () => {
    describe('adding a new photo to a plant site', () => {
      let photoUploadId: number;
      beforeEach(async () => {
        await plantSiteTable.add(plantSiteFactory.create({ id: 'abc' }));
        const blobDataId = await blobDataTable.add(blobDataFactory.create({}));
        photoUploadId = await plantSitePhotoUploadTable.add(
          plantSitePhotoUploadFactory.create({
            plantSiteId: 'abc',
            blobDataId: blobDataId,
          }),
        );

        mockApiCall(getFullApiPath('/blob/presigned-upload-url'), {
          blobKey: 'upload here!',
          url: 'https://www.specialuploadurl.com',
        });

        mockApiCall('https://www.specialuploadurl.com', {}, 'put', 200);
        mockApiCall(getFullApiPath('plant-site-photo'), {}, 'post', 200);
      });

      it('uploads the plant site photos to the server and clears the data', async () => {
        await syncPlantSitePhotoUploadToServer(photoUploadId);
        const savedPlantSitePhotoData =
          await plantSitePhotoUploadTable.toArray();
        const savedBlobData = await blobDataTable.toArray();

        expect(savedPlantSitePhotoData.length).toEqual(0);
        expect(savedBlobData.length).toEqual(0);
      });
    });
  });
});
