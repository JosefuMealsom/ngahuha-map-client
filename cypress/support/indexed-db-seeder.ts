import {
  gardenAreaTable,
  plantSitePhotoUploadTable,
  plantSiteUploadTable,
  plantTable,
} from '../../src/services/offline.database';
import { Plant } from '../../src/types/api/plant.type';
import { PlantSiteUpload } from '../../src/types/api/upload/plant-site-upload.type';
import { PlantSitePhotoUpload } from '../../src/types/api/upload/plant-site-photo-upload.type';
import plantFactory from '../../src/test-helpers/factories/plant';
import plantSiteUploadFactory from '../../src/test-helpers/factories/plant-site-upload';
import plantSitePhotoUploadFactory from '../../src/test-helpers/factories/plant-site-photo-upload';
import gardenAreaFactory from '../../src/test-helpers/factories/garden-area';
import { GardenArea } from '../../src/types/api/garden-area.type';

type DbSeedData = {
  plants?: Partial<Plant>[];
  plantSiteUploads?: Partial<PlantSiteUpload>[];
  plantSitePhotoUploads?: Partial<PlantSitePhotoUpload>[];
  gardenAreas?: Partial<GardenArea>[];
};

export const seed = (seedData: DbSeedData) => {
  const { plants, plantSiteUploads, plantSitePhotoUploads, gardenAreas } =
    seedData;

  if (plants) {
    plants.forEach((p) => plantTable.add(plantFactory.create(p)));
  }

  if (plantSiteUploads) {
    plantSiteUploads.forEach((p) =>
      plantSiteUploadTable.add(plantSiteUploadFactory.create(p)),
    );
  }

  if (plantSitePhotoUploads) {
    plantSitePhotoUploads.forEach((p) =>
      plantSitePhotoUploadTable.add(plantSitePhotoUploadFactory.create(p)),
    );
  }

  if (gardenAreas) {
    gardenAreas.forEach((g) =>
      gardenAreaTable.add(gardenAreaFactory.create(g)),
    );
  }
};
