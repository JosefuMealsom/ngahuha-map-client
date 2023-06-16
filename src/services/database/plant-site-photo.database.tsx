import Dexie, { Table } from 'dexie';
import type { PlantSitePhoto } from '../../types/plant-site-photo-type';

export class PlantSitePhotoDatabase extends Dexie {
  public plantSitePhotos!: Table<PlantSitePhoto>;

  constructor() {
    super('PlantSitePhotosDatabase');
    this.version(1).stores({
      plantSitePhotos: '++id,filename,plantSiteId,data,lat,long,accuracy',
    });
  }
}
