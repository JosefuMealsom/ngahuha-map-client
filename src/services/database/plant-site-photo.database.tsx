import Dexie, { Table } from 'dexie';

export class PlantSitePhotoDatabase extends Dexie {
  public plantSitePhotos!: Table<PlantSitePhoto>;

  constructor() {
    super('PlantSitePhotosDatabase');
    this.version(1).stores({
      plantSitePhotos: 'filename,plantSiteId,data',
    });
  }
}
