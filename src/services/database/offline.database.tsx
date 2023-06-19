import Dexie, { Table } from 'dexie';
import type { PlantSite } from '../../types/api/plant-site.type';
import { GardenArea } from '../../types/api/garden-area.type';
import { Species } from '../../types/api/species.type';
import { Genus } from '../../types/api/genus.type';

export class OfflineDatabase extends Dexie {
  public plantSitePhotos!: Table<PlantSite>;
  public gardenArea!: Table<GardenArea>;
  public species!: Table<Species>;
  public genus!: Table<Genus>;

  constructor() {
    super('OfflineDatabase');
    this.version(1).stores({
      gardenArea: 'id, name',
      species: 'id, name',
      genus: 'id, name',
    });
  }
}
