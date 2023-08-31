import gardenAreaService from './garden-area.service';
import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import { mockApiCall } from '../../test-helpers/fetch-stub';
import offlineDatabase from '../offline.database';
import { getFullApiPath } from '../../utils/api-url.util';

describe('GardenAreaService', () => {
  afterEach(() => {
    offlineDatabase.gardenArea.clear();
  });

  describe('fetch()', () => {
    beforeEach(() => {
      mockApiCall(getFullApiPath('garden-area'), [
        {
          id: 'abc',
          name: 'Most beautiful area',
          description: 'SO BEAUTIFUL!',
        },
      ]);
    });

    it('fetches the data from the API and returns it', async () => {
      const gardenAreas = await gardenAreaService.fetch();
      expect(gardenAreas).toEqual([
        {
          id: 'abc',
          name: 'Most beautiful area',
          description: 'SO BEAUTIFUL!',
        },
      ]);
    });
  });

  describe('syncOffline()', () => {
    beforeEach(() => {
      mockApiCall(getFullApiPath('garden-area'), [
        {
          id: 'abc',
          name: 'Most beautiful area',
          description: 'SO BEAUTIFUL!',
        },
        {
          id: 'cde',
          name: 'Second most beautiful area',
          description: 'NOT AS BEAUTIFUL!',
        },
      ]);
    });

    it('fetches the data from the API and saves it to indexedDB', async () => {
      await gardenAreaService.syncOffline();
      const savedDbData = await offlineDatabase.gardenArea.toArray();

      expect(savedDbData).toEqual([
        {
          id: 'abc',
          name: 'Most beautiful area',
          description: 'SO BEAUTIFUL!',
        },
        {
          id: 'cde',
          name: 'Second most beautiful area',
          description: 'NOT AS BEAUTIFUL!',
        },
      ]);
    });

    describe('Garden areas are already synced offline', () => {
      beforeEach(async () => {
        await offlineDatabase.gardenArea.add({
          id: 'abc',
          name: 'Most beautiful area',
          description: 'SO BEAUTIFUL!',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        });

        mockApiCall(getFullApiPath('garden-area'), [
          {
            id: 'abc',
            name: 'Honestly, pretty ugly area',
            description: 'Ugh so ugly!',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
        ]);
      });

      it('updates only the changed data', async () => {
        await gardenAreaService.syncOffline();

        const savedDbData = await offlineDatabase.gardenArea.toArray();

        expect(savedDbData).toEqual([
          {
            id: 'abc',
            name: 'Honestly, pretty ugly area',
            description: 'Ugh so ugly!',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
        ]);
      });
    });
  });
});
