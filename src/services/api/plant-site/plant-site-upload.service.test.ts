import 'fake-indexeddb/auto';
import {
  addPlantSiteWithPhoto,
  deletePlantSite,
} from './plant-site-upload.service';
import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import offlineDatabase, {
  blobDataTable,
  plantSiteUploadPhotoTable,
  plantSiteUploadTable,
  plantTable,
} from '../../offline.database';
import plantFactory from '../../../test-helpers/factories/plant';
import plantSiteFactory from '../../../test-helpers/factories/plant-site-upload';
import { stubArrayBufferCall } from '../../../test-helpers/blob-stub';
import blobDataFactory from '../../../test-helpers/factories/blob-data';

describe('PlantSiteUploadService', () => {
  beforeEach(() => {
    stubArrayBufferCall();
  });

  afterEach(async () => {
    await plantSiteUploadTable.clear();
    await plantSiteUploadPhotoTable.clear();
    await blobDataTable.clear();
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
        await addPlantSiteWithPhoto(
          {
            file: new Blob(),
            previewPhotoFile: new Blob(),
            primaryPhoto: true,
          },
          location,
          'abc',
        );
        const savedPlantSiteData = await plantSiteUploadTable.toArray();
        const savedUploadPhotoData = await plantSiteUploadPhotoTable.toArray();
        const savedBlobData = await blobDataTable.toArray();

        expect(savedPlantSiteData.length).toEqual(1);
        expect(savedUploadPhotoData.length).toEqual(1);
        expect(savedBlobData.length).toEqual(2);

        const plantSite = savedPlantSiteData[0];
        expect(plantSite.accuracy).toEqual(10);
        expect(plantSite.latitude).toEqual(20);
        expect(plantSite.longitude).toEqual(30);
        expect(savedUploadPhotoData[0].primaryPhoto).toEqual(true);
      });

      it('can add an array of photos', async () => {
        const blobs = [
          {
            file: new Blob(),
            previewPhotoFile: new Blob(),
            primaryPhoto: false,
          },
          {
            file: new Blob(),
            previewPhotoFile: new Blob(),
            primaryPhoto: true,
          },
        ];
        await addPlantSiteWithPhoto(blobs, location, 'abc');
        const savedUploadPhotoData = await plantSiteUploadPhotoTable.toArray();

        expect(savedUploadPhotoData.length).toEqual(2);
      });

      it('can add a plant site without a plantId', async () => {
        await addPlantSiteWithPhoto(
          {
            file: new Blob(),
            previewPhotoFile: new Blob(),
            primaryPhoto: false,
          },
          location,
        );
        const savedPlantSiteData =
          await offlineDatabase.plantSiteUpload.toArray();

        expect(savedPlantSiteData.length).toEqual(1);
        const plantSite = savedPlantSiteData[0];
        expect(plantSite.plantId).toBeUndefined();
      });
    });

    describe('plant missing', () => {
      it('raises an exception', async () => {
        await expect(() =>
          addPlantSiteWithPhoto(
            {
              file: new Blob(),
              previewPhotoFile: new Blob(),
              primaryPhoto: false,
            },
            location,
            'missing id',
          ),
        ).rejects.toThrowError("Plant with id: 'missing id' not found");
      });
    });
  });

  describe('deletePlantSite()', () => {
    let plantSiteId: number;
    beforeEach(async () => {
      plantSiteId = (await plantSiteUploadTable.add(
        plantSiteFactory.create({}),
      )) as number;

      await blobDataTable.add(blobDataFactory.create({ id: 1 }));
      await blobDataTable.add(blobDataFactory.create({ id: 2 }));

      await plantSiteUploadPhotoTable.add({
        blobDataId: 1,
        previewPhotoBlobDataId: 2,
        primaryPhoto: false,
        plantSiteUploadId: plantSiteId,
      });
    });

    it('deletes the plantSite', async () => {
      await deletePlantSite(plantSiteId);

      expect((await plantSiteUploadTable.toArray()).length).toEqual(0);
      expect((await plantSiteUploadPhotoTable.toArray()).length).toEqual(0);
      expect((await blobDataTable.toArray()).length).toEqual(0);
    });
  });
});
