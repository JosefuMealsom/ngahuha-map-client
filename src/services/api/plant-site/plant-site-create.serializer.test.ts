import { beforeEach, expect, describe, it } from 'vitest';
import {
  blobDataTable,
  plantSiteUploadPhotoTable,
  plantSiteUploadTable,
  plantTable,
} from '../../offline.database';
import plantSiteUploadFactory from '../../../test-helpers/factories/plant-site-upload';
import { serializeCreatePlantSite } from '../plant-site/plant-site-create.serializer';
import plantFactory from '../../../test-helpers/factories/plant';
import blobDataFactory from '../../../test-helpers/factories/blob-data';
import plantSiteUploadPhotoFactory from '../../../test-helpers/factories/plant-site-upload-photo';

describe('serializeCreatePlantSite()', () => {
  const plantSite = plantSiteUploadFactory.create({
    id: 1,
    accuracy: 10,
    latitude: 20,
    longitude: 20,
    plantId: 'My cool plant id',
    photos: [
      { data: new Uint8Array(), blobKey: 'mr blobby', primaryPhoto: false },
      { data: new Uint8Array(), blobKey: 'mrs blobette', primaryPhoto: true },
    ],
  });

  const plant = plantFactory.create({
    id: 'My cool plant id',
  });
  beforeEach(async () => {
    await plantTable.add(plant);
    await plantSiteUploadTable.add(plantSite);

    await blobDataTable.add(
      blobDataFactory.create({ id: 1, blobKey: 'mr blobby' }),
    );
    await blobDataTable.add(
      blobDataFactory.create({ id: 2, blobKey: 'mrs blobette' }),
    );
    await plantSiteUploadPhotoTable.add(
      plantSiteUploadPhotoFactory.create({
        blobDataId: 1,
        primaryPhoto: false,
      }),
    );
    await plantSiteUploadPhotoTable.add(
      plantSiteUploadPhotoFactory.create({ blobDataId: 2, primaryPhoto: true }),
    );
  });

  it('generates the correct json', async () => {
    expect(await serializeCreatePlantSite(plantSite)).toEqual({
      accuracy: 10,
      latitude: 20,
      longitude: 20,
      plantId: 'My cool plant id',
      plantSitePhotos: [
        { blobKey: 'mr blobby', primaryPhoto: false },
        { blobKey: 'mrs blobette', primaryPhoto: true },
      ],
    });
  });
});
