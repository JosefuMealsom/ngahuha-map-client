import Dexie, { Table } from 'dexie';
import type { PlantSiteUpload } from '../types/api/upload/plant-site-upload.type';
import type { GardenArea } from '../types/api/garden-area.type';
import type { Plant } from '../types/api/plant.type';
import type { PlantType } from '../types/api/plant-type.type';
import { PlantSite } from '../types/api/plant-site.type';
import { PlantSitePhoto } from '../types/api/plant-site-photo.type';
import {
  FeaturePhotoUpload,
  FeatureUpload,
} from '../types/api/upload/feature-upload.type';
import { Feature } from '../types/api/feature.type';
import { FeaturePhoto } from '../types/api/feature-photo.type';

class OfflineDatabase extends Dexie {
  public readonly plantSite!: Table<PlantSite>;
  public readonly plantSitePhoto!: Table<PlantSitePhoto>;
  public readonly plant!: Table<Plant>;
  public readonly plantType!: Table<PlantType>;
  public readonly feature!: Table<Feature>;
  public readonly featurePhoto!: Table<FeaturePhoto>;

  // Models saved offline and uploaded later as they involve sending large files
  public readonly plantSiteUpload!: Table<PlantSiteUpload, number>;
  public readonly featureUpload!: Table<FeatureUpload, number>;
  public readonly featurePhotoUpload!: Table<FeaturePhotoUpload, number>;

  constructor() {
    super('OfflineDatabase');
    this.version(4).stores({
      species: 'id, name, updatedAt',
      plant: 'id, species, cultivar, updatedAt',
      plantType: 'id, name',
      plantSite: 'id, updatedAt, plantId',
      plantSitePhoto: 'id, updatedAt, plantSiteId',
      plantSiteUpload: '++id, plantId',
      featureUpload: '++id',
      featurePhotoUpload: '++id, featureUploadId',
      feature: 'id, updatedAt',
      featurePhoto: 'id, updatedAt, featureId',
    });
  }
}

const offlineDatabase = new OfflineDatabase();

export default offlineDatabase;
export const plantTable = offlineDatabase.plant;
export const plantTypeTable = offlineDatabase.plantType;
export const plantSiteTable = offlineDatabase.plantSite;
export const plantSitePhotoTable = offlineDatabase.plantSitePhoto;
export const featureTable = offlineDatabase.feature;
export const featurePhotoTable = offlineDatabase.featurePhoto;

export const plantSiteUploadTable = offlineDatabase.plantSiteUpload;
export const featureUploadTable = offlineDatabase.featureUpload;
export const featurePhotoUploadTable = offlineDatabase.featurePhotoUpload;
