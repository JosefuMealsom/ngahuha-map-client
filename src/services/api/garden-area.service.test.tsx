import gardenAreaService from './garden-area.service';
import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import { fetchStub } from '../../test-helpers/fetch-stub';
import offlineDatabase from '../database/offline.database';

describe('GardenAreaService', () => {
  afterEach(() => {
    offlineDatabase.gardenArea.clear();
  });

  describe('fetch()', () => {
    beforeEach(() => {
      fetchStub.stubFetchResponse([
        {
          id: 'abc',
          name: 'Most beautiful area',
          description: 'SO BEAUTIFUL!',
        },
      ]);
    });

    it('fetches the data from the API and returns it', async () => {
      const gardenAreas = await gardenAreaService.fetch();
      fetchStub.assertEndPointCalled('https://www.dummy-api.com/garden-area');

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
      fetchStub.stubFetchResponse([
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

        await offlineDatabase.gardenArea.add({
          id: '666',
          name: 'Some other beuatiful area',
          description: 'SO BEAUTIFUL!',
          createdAt: '1987-11-11T00:00:00.000Z',
          updatedAt: '1987-11-11T00:00:00.000Z',
        });

        fetchStub.stubFetchResponse([
          {
            id: 'abc',
            name: 'Honestly, pretty ugly area',
            description: 'Ugh so ugly!',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
          {
            id: 'def',
            name: 'This is the new most beautiful area',
            description: 'Oh yeah so beautiful!',
            createdAt: '2032-11-11T00:00:00.000Z',
            updatedAt: '2032-11-11T00:00:00.000Z',
          },
        ]);
      });

      it('updates only the changed data', async () => {
        const gardenAreas = await gardenAreaService.syncOffline();
        fetchStub.assertEndPointCalled(
          'https://www.dummy-api.com/garden-area?lastModified=1988-11-11T00%3A00%3A00.000Z',
        );

        const savedDbData = await offlineDatabase.gardenArea.toArray();

        expect(savedDbData).toEqual([
          {
            id: '666',
            name: 'Some other beuatiful area',
            description: 'SO BEAUTIFUL!',
            createdAt: '1987-11-11T00:00:00.000Z',
            updatedAt: '1987-11-11T00:00:00.000Z',
          },
          {
            id: 'abc',
            name: 'Honestly, pretty ugly area',
            description: 'Ugh so ugly!',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
          {
            id: 'def',
            name: 'This is the new most beautiful area',
            description: 'Oh yeah so beautiful!',
            createdAt: '2032-11-11T00:00:00.000Z',
            updatedAt: '2032-11-11T00:00:00.000Z',
          },
        ]);
      });
    });
  });
});
