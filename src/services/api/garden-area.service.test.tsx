import gardenAreaService from './garden-area.service';
import { expect, describe, it } from 'vitest';
import { fetchStub } from '../../test-helpers/fetch-stub';

describe('GardenAreaService', () => {
  it('fetches the data from the API and returns it', async () => {
    fetchStub.stubFetchResponse({
      id: 123,
      name: 'Most beautiful area',
      description: 'SO BEAUTIFUL!',
    });

    const gardenAreas = await gardenAreaService.fetch();
    fetchStub.assertEndPointCalled('https://www.dummy-api.com/garden-area');

    expect(gardenAreas).toEqual([
      { id: 123, name: 'Most beautiful area', description: 'SO BEAUTIFUL!' },
    ]);
  });
});
