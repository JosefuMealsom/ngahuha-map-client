import { beforeEach, expect, describe, it } from 'vitest';
import {
  plantSiteUploadTable,
  plantSitePhotoUploadTable,
} from '../../offline.database';
import plantSitePhotoUploadFactory from '../../../test-helpers/factories/plant-site-photo-upload';
import plantSiteUploadFactory from '../../../test-helpers/factories/plant-site-upload';
import { serializeCreatePlantSite } from './plant-site-create.serializer';

describe('serializeCreatePlantSite()', () => {
  const plantSite = plantSiteUploadFactory.create({
    id: 1,
    accuracy: 10,
    latitude: 20,
    longitude: 20,
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

  beforeEach(() => {
    plantSiteUploadTable.add(plantSite);
    plantSitePhotoUploadTable.add(photo1);
    plantSitePhotoUploadTable.add(photo2);
  });

  it('generates the correct json', async () => {
    expect(await serializeCreatePlantSite(plantSite)).toEqual({
      accuracy: 10,
      latitude: 20,
      longitude: 20,
      plantSitePhotos: [{ blobKey: 'mr blobby' }, { blobKey: 'mrs blobette' }],
    });
  });
});
