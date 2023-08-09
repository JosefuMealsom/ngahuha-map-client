import 'fake-indexeddb/auto';
import {
  addPlantSiteWithPhoto,
  deletePlantSite,
} from './plant-site-upload.service';
import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import offlineDatabase, {
  plantSiteUploadTable,
  plantTable,
} from '../offline.database';
import plantFactory from '../../test-helpers/factories/plant';
import plantSiteFactory from '../../test-helpers/factories/plant-site-upload';
import { stubArrayBufferCall } from '../../test-helpers/blob-stub';

describe('PlantSiteUploadService', () => {
  beforeEach(() => {
    stubArrayBufferCall();
  });

  afterEach(async () => {
    await plantSiteUploadTable.clear();
    await plantTable.clear();
  });

  const location: GeolocationCoordinates = {
    accuracy: 10,
    latitude: 20,
    longitude: 30,
    altitude: 111,
    altitudeAccuracy: 111,
    heading: 111,
    speed: 111,
  };

  describe('addPlantSiteWithPhoto()', () => {
    describe('adding photos', () => {
      beforeEach(async () => {
        await plantTable.add(plantFactory.create({ id: 'abc' }));
      });

      it('adds a new plant site and saves it offline', async () => {
        const blob = new Blob();
        await addPlantSiteWithPhoto(blob, location, 'abc');
        const savedPlantSiteData = await plantSiteUploadTable.toArray();

        expect(savedPlantSiteData.length).toEqual(1);
        const plantSite = savedPlantSiteData[0];
        expect(plantSite.accuracy).toEqual(10);
        expect(plantSite.latitude).toEqual(20);
        expect(plantSite.longitude).toEqual(30);
        expect(plantSite.photos.length).toEqual(1);
      });

      it('can add an array of photos', async () => {
        const blobs = [new Blob(), new Blob()];
        await addPlantSiteWithPhoto(blobs, location, 'abc');
        const savedPlantSiteData = await plantSiteUploadTable.toArray();

        expect(savedPlantSiteData[0].photos.length).toEqual(2);
      });

      it('can add a plant site without a plantId', async () => {
        const blob = new Blob();
        await addPlantSiteWithPhoto(blob, location);
        const savedPlantSiteData =
          await offlineDatabase.plantSiteUpload.toArray();

        expect(savedPlantSiteData.length).toEqual(1);
        const plantSite = savedPlantSiteData[0];
        expect(plantSite.plantId).toBeUndefined();
      });
    });

    describe('plant missing', () => {
      it('raises an exception', async () => {
        const blob = new Blob();
        await expect(() =>
          addPlantSiteWithPhoto(blob, location, 'missing id'),
        ).rejects.toThrowError("Plant with id: 'missing id' not found");
      });
    });
  });

  describe('deletePlantSite()', () => {
    it('deletes the plantSite', async () => {
      const plantSiteId = (await plantSiteUploadTable.add(
        plantSiteFactory.create({}),
      )) as number;

      await deletePlantSite(plantSiteId);

      expect(await plantSiteUploadTable.toArray()).toEqual([]);
    });
  });
});
