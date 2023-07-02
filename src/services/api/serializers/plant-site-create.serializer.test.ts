import { beforeEach, expect, describe, it } from 'vitest';
import {
  plantSiteUploadTable,
  plantSitePhotoUploadTable,
  plantTable,
  gardenAreaTable,
} from '../../offline.database';
import plantSitePhotoUploadFactory from '../../../test-helpers/factories/plant-site-photo-upload';
import plantSiteUploadFactory from '../../../test-helpers/factories/plant-site-upload';
import { serializeCreatePlantSite } from './plant-site-create.serializer';
import plantFactory from '../../../test-helpers/factories/plant';
import gardenAreaFactory from '../../../test-helpers/factories/garden-area';

describe('serializeCreatePlantSite()', () => {
  const plantSite = plantSiteUploadFactory.create({
    id: 1,
    accuracy: 10,
    latitude: 20,
    longitude: 20,
    plantId: 'My cool plant id',
  });
  const photo1 = plantSitePhotoUploadFactory.create({
    id: 1,
    plantSiteUploadId: 1,
    blobKey: 'mr blobby',
  });
  const photo2 = plantSitePhotoUploadFactory.create({
    id: 2,
    plantSiteUploadId: 1,
    blobKey: 'mrs blobette',
  });
  const plant = plantFactory.create({
    id: 'My cool plant id',
  });
  const gardenArea = gardenAreaFactory.create({
    id: 'My sweet garden area',
    name: 'Other',
  });

  beforeEach(() => {
    plantTable.add(plant);
    plantSiteUploadTable.add(plantSite);
    plantSitePhotoUploadTable.add(photo1);
    plantSitePhotoUploadTable.add(photo2);
    gardenAreaTable.add(gardenArea);
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
