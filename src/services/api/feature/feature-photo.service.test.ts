import 'fake-indexeddb/auto';
import { expect, describe, it, afterEach, beforeEach, vi } from 'vitest';
import { featurePhotoTable } from '../../offline.database';
import { mockApiCall } from '../../../test-helpers/fetch-stub';
import {
  fetchFeaturePhotos,
  syncFeaturePhotosOffline,
  updateFeaturePrimaryPhoto,
} from './feature-photo.service';
import { stubArrayBufferCall } from '../../../test-helpers/blob-stub';
import { getFullApiPath } from '../../../utils/api-url.util';

describe('FeaturePhotoService', () => {
  beforeEach(() => {
    stubArrayBufferCall();
  });

  afterEach(() => {
    featurePhotoTable.clear();
  });

  const featurePhoto1 = {
    id: '123',
    featureId: '456',
    url: 'my cool url',
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
    metadata: { hello: 'joe' },
    primaryPhoto: true,
  };

  const featurePhoto2 = {
    id: 'abc',
    featureId: '456',
    url: 'my sweet site',
    createdAt: '2020-11-11T00:00:00.000Z',
    updatedAt: '2020-11-11T00:00:00.000Z',
    metadata: { goodbye: 'moe' },
    primaryPhoto: false,
  };

  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      mockApiCall(getFullApiPath('feature-photo'), [
        featurePhoto1,
        featurePhoto2,
      ]);

      const featurePhotos = await fetchFeaturePhotos();

      expect(featurePhotos).toEqual([
        {
          id: '123',
          featureId: '456',
          url: 'my cool url',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          metadata: { hello: 'joe' },
          primaryPhoto: true,
        },
        {
          id: 'abc',
          featureId: '456',
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
      mockApiCall(getFullApiPath('feature-photo'), [
        featurePhoto1,
        featurePhoto2,
      ]);

      await syncFeaturePhotosOffline();
      const savedDbData = await featurePhotoTable.toArray();

      expect(savedDbData).toEqual([
        expect.objectContaining({
          id: '123',
          featureId: '456',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          metadata: { hello: 'joe' },
          primaryPhoto: true,
        }),
        expect.objectContaining({
          id: 'abc',
          featureId: '456',
          createdAt: '2020-11-11T00:00:00.000Z',
          updatedAt: '2020-11-11T00:00:00.000Z',
          metadata: { goodbye: 'moe' },
          primaryPhoto: false,
        }),
      ]);
    });

    describe('Feature photo already synced offline', () => {
      beforeEach(async () => {
        await featurePhotoTable.add({
          id: '123',
          featureId: '456',
          url: 'my cool url',
          data: new ArrayBuffer(8),
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          metadata: { hello: 'joe' },
          primaryPhoto: false,
        });

        mockApiCall(getFullApiPath('feature-photo'), [
          {
            id: '123',
            featureId: '456',
            url: 'my mean url',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
            metadata: { hello: 'moe' },
            primaryPhoto: true,
          },
        ]);
      });

      it('updates only the changed data', async () => {
        await syncFeaturePhotosOffline();

        const savedDbData = await featurePhotoTable.toArray();

        expect(savedDbData).toEqual([
          expect.objectContaining({
            id: '123',
            featureId: '456',
            url: 'my mean url',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
            metadata: { hello: 'moe' },
            primaryPhoto: true,
          }),
        ]);
      });
    });

    describe('updateFeaturePrimaryPhoto()', () => {
      beforeEach(async () => {
        await featurePhotoTable.add({
          id: '123',
          featureId: '456',
          url: 'my mean url',
          createdAt: '2030-11-11T00:00:00.000Z',
          updatedAt: '2030-11-11T00:00:00.000Z',
          metadata: undefined,
          primaryPhoto: false,
        });

        mockApiCall(
          getFullApiPath('feature-photo/123'),
          {
            id: '123',
            featureId: '456',
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
        await updateFeaturePrimaryPhoto('123');

        const savedDbData = await featurePhotoTable.toArray();

        expect(savedDbData).toEqual([
          {
            id: '123',
            featureId: '456',
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
