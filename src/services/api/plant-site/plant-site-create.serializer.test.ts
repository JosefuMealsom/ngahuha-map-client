import { beforeEach, expect, describe, it } from 'vitest';
import {
  plantSiteUploadTable,
  plantTable,
  gardenAreaTable,
} from '../../offline.database';
import plantSiteUploadFactory from '../../../test-helpers/factories/plant-site-upload';
import { serializeCreatePlantSite } from '../plant-site/plant-site-create.serializer';
import plantFactory from '../../../test-helpers/factories/plant';
import gardenAreaFactory from '../../../test-helpers/factories/garden-area';

describe('serializeCreatePlantSite()', () => {
  const plantSite = plantSiteUploadFactory.create({
    id: 1,
    accuracy: 10,
    latitude: 20,
    longitude: 20,
    plantId: 'My cool plant id',
    photos: [
      { data: new Uint8Array(), blobKey: 'mr blobby' },
      { data: new Uint8Array(), blobKey: 'mrs blobette' },
    ],
  });

  const plant = plantFactory.create({
    id: 'My cool plant id',
  });
  const gardenArea = gardenAreaFactory.create({
    id: 'My sweet garden area',
    name: 'Other',
  });

  beforeEach(async () => {
    await plantTable.add(plant);
    await plantSiteUploadTable.add(plantSite);
    await gardenAreaTable.add(gardenArea);
  });

  it('generates the correct json', async () => {
    expect(await serializeCreatePlantSite(plantSite)).toEqual({
      accuracy: 10,
      latitude: 20,
      longitude: 20,
      gardenAreaId: 'My sweet garden area',
      plantId: 'My cool plant id',
      plantSitePhotos: [{ blobKey: 'mr blobby' }, { blobKey: 'mrs blobette' }],
    });
  });
});
