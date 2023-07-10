import 'fake-indexeddb/auto';
import { expect, describe, it, afterEach, beforeEach, vi } from 'vitest';
import { plantSitePhotoTable } from '../offline.database';
import {
  assertEndPointCalled,
  stubFetchResponse,
} from '../../test-helpers/fetch-stub';
import {
  fetchPlantSitePhotos,
  syncPlantSitePhotosOffline,
} from './plant-site-photo.service';

vi.mock('../image-loader.service', () => ({
  loadBlob: (url: string) => {
    return new Promise((success) => {
      success(new Blob());
    });
  },
}));

describe('PlantSitePhotoService', () => {
  afterEach(() => {
    plantSitePhotoTable.clear();
  });

  const plantSitePhoto1 = {
    id: '123',
    plantSiteId: '456',
    url: 'my cool url',
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
  };

  const plantSitePhoto2 = {
    id: 'abc',
    plantSiteId: '456',
    url: 'my sweet site',
    createdAt: '2020-11-11T00:00:00.000Z',
    updatedAt: '2020-11-11T00:00:00.000Z',
  };

  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      stubFetchResponse([plantSitePhoto1, plantSitePhoto2]);

      const plantSitePhotos = await fetchPlantSitePhotos();
      assertEndPointCalled('https://www.dummy-api.com/plant-site-photo');

      expect(plantSitePhotos).toEqual([
        {
          id: '123',
          plantSiteId: '456',
          url: 'my cool url',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
        {
          id: 'abc',
          plantSiteId: '456',
          url: 'my sweet site',
          createdAt: '2020-11-11T00:00:00.000Z',
          updatedAt: '2020-11-11T00:00:00.000Z',
        },
      ]);
    });
  });

  describe('syncOffline()', () => {
    it('fetches the data from the API and saves it to indexedDB', async () => {
      stubFetchResponse([plantSitePhoto1, plantSitePhoto2]);

      await syncPlantSitePhotosOffline();
      const savedDbData = await plantSitePhotoTable.toArray();

      expect(savedDbData).toEqual([
        expect.objectContaining({
          id: '123',
          plantSiteId: '456',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        }),
        expect.objectContaining({
          id: 'abc',
          plantSiteId: '456',
          createdAt: '2020-11-11T00:00:00.000Z',
          updatedAt: '2020-11-11T00:00:00.000Z',
        }),
      ]);
    });

    describe('Plant already synced offline', () => {
      beforeEach(async () => {
        await plantSitePhotoTable.add({
          id: '123',
          plantSiteId: '456',
          data: new Blob(),
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        });

        stubFetchResponse([
          {
            id: '123',
            plantSiteId: '456',
            url: 'my mean url',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
        ]);
      });

      it('updates only the changed data', async () => {
        await syncPlantSitePhotosOffline();

        assertEndPointCalled(
          'https://www.dummy-api.com/plant-site-photo?lastModified=1988-11-11T00%3A00%3A00.000Z',
        );

        const savedDbData = await plantSitePhotoTable.toArray();

        expect(savedDbData).toEqual([
          expect.objectContaining({
            id: '123',
            plantSiteId: '456',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          }),
        ]);
      });
    });
  });
});
