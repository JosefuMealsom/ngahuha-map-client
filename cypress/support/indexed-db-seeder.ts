import {
  gardenAreaTable,
  plantSiteTable,
  plantSiteUploadTable,
  plantTable,
} from '../../src/services/offline.database';
import { Plant } from '../../src/types/api/plant.type';
import { PlantSiteUpload } from '../../src/types/api/upload/plant-site-upload.type';
import plantFactory from '../../src/test-helpers/factories/plant';
import plantSiteFactory from '../../src/test-helpers/factories/plant-site';
import plantSiteUploadFactory from '../../src/test-helpers/factories/plant-site-upload';
import gardenAreaFactory from '../../src/test-helpers/factories/garden-area';
import { GardenArea } from '../../src/types/api/garden-area.type';
import { PlantSite } from '../../src/types/api/plant-site.type';

type DbSeedData = {
  plants?: Partial<Plant>[];
  plantSiteUploads?: Partial<PlantSiteUpload>[];
  gardenAreas?: Partial<GardenArea>[];
  plantSites?: Partial<PlantSite>[];
};

export const seed = (seedData: DbSeedData) => {
  const { plants, plantSiteUploads, gardenAreas, plantSites } = seedData;

  if (plants) {
    plants.forEach((p) => plantTable.add(plantFactory.create(p)));
  }

  if (plantSiteUploads) {
    plantSiteUploads.forEach((p) =>
      plantSiteUploadTable.add(plantSiteUploadFactory.create(p)),
    );
  }

  if (gardenAreas) {
    gardenAreas.forEach((g) =>
      gardenAreaTable.add(gardenAreaFactory.create(g)),
    );
  }

  if (plantSites) {
    plantSites.forEach((p) => plantSiteTable.add(plantSiteFactory.create(p)));
  }
};
