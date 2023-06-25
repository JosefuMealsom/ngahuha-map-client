import Dexie, { Table } from 'dexie';
import { PlantSite } from '../../types/api/plant-site.type';
import { PlantSitePhoto } from '../../types/api/plant-site-photo.type';
import { GardenArea } from '../../types/api/garden-area.type';
import { Species } from '../../types/api/species.type';
import { Genus } from '../../types/api/genus.type';

class OfflineDatabase extends Dexie {
  public readonly plantSite!: Table<PlantSite>;
  public readonly plantSitePhoto!: Table<PlantSitePhoto>;
  public readonly gardenArea!: Table<GardenArea>;
  public readonly species!: Table<Species>;
  public readonly genus!: Table<Genus>;

  constructor() {
    super('OfflineDatabase');
    this.version(1).stores({
      gardenArea: 'id, name, updatedAt',
      species: 'id, name, updatedAt',
      genus: 'id, name, updatedAt',
      plantSite: '++id, updatedAt',
      plantSitePhoto: '++id, updatedAt',
    });
  }
}

const offlineDatabase = new OfflineDatabase();

export default offlineDatabase;
export const gardenAreaTable = offlineDatabase.gardenArea;
export const speciesTable = offlineDatabase.species;
export const genusTable = offlineDatabase.genus;
export const plantSiteTable = offlineDatabase.plantSite;
export const plantSitePhotoTable = offlineDatabase.plantSitePhoto;
