import Dexie, { Table } from 'dexie';
import type { PlantSiteUpload } from '../types/api/upload/plant-site-upload.type';
import type { GardenArea } from '../types/api/garden-area.type';
import type { Plant } from '../types/api/plant.type';
import type { PlantType } from '../types/api/plant-type.type';
import { PlantSite } from '../types/api/plant-site.type';
import { PlantSitePhoto } from '../types/api/plant-site-photo.type';

class OfflineDatabase extends Dexie {
  public readonly plantSite!: Table<PlantSite>;
  public readonly plantSitePhoto!: Table<PlantSitePhoto>;
  public readonly gardenArea!: Table<GardenArea>;
  public readonly plant!: Table<Plant>;
  public readonly plantType!: Table<PlantType>;

  public readonly plantSiteUpload!: Table<PlantSiteUpload, number>;

  constructor() {
    super('OfflineDatabase');
    this.version(1).stores({
      gardenArea: 'id, name, updatedAt',
      species: 'id, name, updatedAt',
      plant: 'id, species, cultivar, updatedAt',
      plantType: 'id, name',
      plantSite: 'id, updatedAt, plantId',
      plantSitePhoto: 'id, updatedAt, plantSiteId',
      plantSiteUpload: '++id, plantId',
    });
  }
}

const offlineDatabase = new OfflineDatabase();

export default offlineDatabase;
export const gardenAreaTable = offlineDatabase.gardenArea;
export const plantTable = offlineDatabase.plant;
export const plantTypeTable = offlineDatabase.plantType;
export const plantSiteTable = offlineDatabase.plantSite;
export const plantSitePhotoTable = offlineDatabase.plantSitePhoto;

export const plantSiteUploadTable = offlineDatabase.plantSiteUpload;
