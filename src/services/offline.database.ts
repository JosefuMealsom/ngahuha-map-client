import Dexie, { Table } from 'dexie';
import type { PlantSite } from '../types/api/plant-site.type';
import type { PlantSitePhoto } from '../types/api/plant-site-photo.type';
import type { GardenArea } from '../types/api/garden-area.type';
import type { Plant } from '../types/api/plant.type';
import type { PlantType } from '../types/api/plant-type.type';

class OfflineDatabase extends Dexie {
  public readonly plantSite!: Table<PlantSite>;
  public readonly plantSitePhoto!: Table<PlantSitePhoto>;
  public readonly gardenArea!: Table<GardenArea>;
  public readonly plant!: Table<Plant>;
  public readonly plantType!: Table<PlantType>;

  constructor() {
    super('OfflineDatabase');
    this.version(1).stores({
      gardenArea: 'id, name, updatedAt',
      species: 'id, name, updatedAt',
      plant: 'id, species, cultivar, updatedAt',
      plantType: 'id, name',
      plantSite: '++id, updatedAt',
      plantSitePhoto: '++id, updatedAt',
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
