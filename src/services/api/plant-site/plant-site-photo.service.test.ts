import 'fake-indexeddb/auto';
import { expect, describe, it, afterEach, beforeEach, vi } from 'vitest';
import { plantSitePhotoTable } from '../../offline.database';
import { mockApiCall } from '../../../test-helpers/fetch-stub';
import {
  deletePlantPhoto,
  fetchPlantSitePhotos,
  syncPlantSitePhotosOffline,
  updatePlantPrimaryPhoto,
} from './plant-site-photo.service';
import { stubArrayBufferCall } from '../../../test-helpers/blob-stub';
import { getFullApiPath } from '../../../utils/api-url.util';

describe('PlantSitePhotoService', () => {
  beforeEach(() => {
    stubArrayBufferCall();
  });

  afterEach(() => {
    plantSitePhotoTable.clear();
  });

  const plantSitePhoto1 = {
    id: '123',
    plantSiteId: '456',
    url: 'my cool url',
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
    metadata: { hello: 'joe' },
    primaryPhoto: true,
  };

  const plantSitePhoto2 = {
    id: 'abc',
    plantSiteId: '456',
    url: 'my sweet site',
    createdAt: '2020-11-11T00:00:00.000Z',
    updatedAt: '2020-11-11T00:00:00.000Z',
    metadata: { goodbye: 'moe' },
    primaryPhoto: false,
  };

  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      mockApiCall(getFullApiPath('plant-site-photo'), [
        plantSitePhoto1,
        plantSitePhoto2,
      ]);

      const plantSitePhotos = await fetchPlantSitePhotos();

      expect(plantSitePhotos).toEqual([
        {
          id: '123',
          plantSiteId: '456',
          url: 'my cool url',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          metadata: { hello: 'joe' },
          primaryPhoto: true,
        },
        {
          id: 'abc',
          plantSiteId: '456',
          url: 'my sweet site',
          createdAt: '2020-11-11T00:00:00.000Z',
          updatedAt: '2020-11-11T00:00:00.000Z',
          metadata: { goodbye: 'moe' },
          primaryPhoto: false,
        },
      ]);
    });
  });

  describe('syncOffline()', () => {
    it('fetches the data from the API and saves it to indexedDB', async () => {
      mockApiCall(getFullApiPath('plant-site-photo'), [
        plantSitePhoto1,
        plantSitePhoto2,
      ]);

      await syncPlantSitePhotosOffline();
      const savedDbData = await plantSitePhotoTable.toArray();

      expect(savedDbData).toEqual([
        expect.objectContaining({
          id: '123',
          plantSiteId: '456',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          metadata: { hello: 'joe' },
          primaryPhoto: true,
        }),
        expect.objectContaining({
          id: 'abc',
          plantSiteId: '456',
          createdAt: '2020-11-11T00:00:00.000Z',
          updatedAt: '2020-11-11T00:00:00.000Z',
          metadata: { goodbye: 'moe' },
          primaryPhoto: false,
        }),
      ]);
    });

    describe('Plant already synced offline', () => {
      beforeEach(async () => {
        await plantSitePhotoTable.add({
          id: '123',
          plantSiteId: '456',
          url: 'my cool url',
          data: new ArrayBuffer(8),
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          metadata: { hello: 'joe' },
          primaryPhoto: true,
        });

        mockApiCall(getFullApiPath('plant-site-photo'), [
          {
            id: '123',
            plantSiteId: '456',
            url: 'my mean url',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
            metadata: { goodbye: 'moe' },
            primaryPhoto: false,
          },
        ]);
      });

      it('updates only the changed data', async () => {
        await syncPlantSitePhotosOffline();

        const savedDbData = await plantSitePhotoTable.toArray();

        expect(savedDbData).toEqual([
          expect.objectContaining({
            id: '123',
            plantSiteId: '456',
            url: 'my mean url',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
            metadata: { goodbye: 'moe' },
            primaryPhoto: false,
          }),
        ]);
      });
    });

    describe('deletePlantPhoto()', () => {
      beforeEach(async () => {
        await plantSitePhotoTable.add({
          id: '123',
          plantSiteId: '456',
          url: 'my mean url',
          createdAt: '2030-11-11T00:00:00.000Z',
          updatedAt: '2030-11-11T00:00:00.000Z',
          metadata: undefined,
          primaryPhoto: false,
        });

        mockApiCall(getFullApiPath('plant-site-photo/123'), {}, 'delete', 200);
      });

      it('calls the endpoint and on success deletes the photo', async () => {
        await deletePlantPhoto('123');
        const photos = await plantSitePhotoTable.toArray();
        expect(photos.length).toEqual(0);
      });
    });

    describe('updatePlantPrimaryPhoto()', () => {
      beforeEach(async () => {
        await plantSitePhotoTable.add({
          id: '123',
          plantSiteId: '456',
          url: 'my mean url',
          createdAt: '2030-11-11T00:00:00.000Z',
          updatedAt: '2030-11-11T00:00:00.000Z',
          metadata: undefined,
          primaryPhoto: false,
        });

        mockApiCall(
          getFullApiPath('plant-site-photo/123'),
          {
            id: '123',
            plantSiteId: '456',
            url: 'my mean url',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
            primaryPhoto: true,
          },
          'patch',
          200,
        );
      });

      it('updates the priority of the photo on the server', async () => {
        await updatePlantPrimaryPhoto('123');

        const savedDbData = await plantSitePhotoTable.toArray();

        expect(savedDbData).toEqual([
          {
            id: '123',
            plantSiteId: '456',
            url: 'my mean url',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
            metadata: undefined,
            primaryPhoto: true,
          },
        ]);
      });
    });
  });
});
