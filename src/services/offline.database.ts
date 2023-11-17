import Dexie, { Table } from 'dexie';
import type {
  PlantSitePhotoUpload,
  PlantSiteUpload,
  PlantSiteUploadPhoto,
} from '../types/api/upload/plant-site-upload.type';
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
import { Path, PathNode } from '../types/api/path.type';
import { BlobData } from '../types/api/upload/blob-data.type';

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

  public readonly path!: Table<Path, number>;
  public readonly pathNode!: Table<PathNode, number>;

  public readonly blobData!: Table<BlobData, number>;
  public readonly plantSitePhotoUpload!: Table<PlantSitePhotoUpload, number>;
  public readonly plantSiteUploadPhoto!: Table<PlantSiteUploadPhoto, number>;

  constructor() {
    super('OfflineDatabase');
    this.version(9).stores({
      species: 'id, name, updatedAt',
      plant: 'id, species, cultivar, updatedAt',
      plantType: 'id, name',
      plantSite: 'id, updatedAt, plantId',
      plantSitePhoto: 'id, updatedAt, plantSiteId, primaryPhoto',
      plantSiteUpload: '++id, plantId',
      featureUpload: '++id',
      featurePhotoUpload: '++id, featureUploadId',
      feature: 'id, updatedAt',
      featurePhoto: 'id, updatedAt, featureId',
      path: '++id, name',
      pathNode: '++id, pathId',
      plantSitePhotoUpload: '++id, plantSiteId',
      plantSiteUploadPhoto: '++id, plantSiteUploadId',
      blobData: '++id',
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

export const pathTable = offlineDatabase.path;
export const pathNodeTable = offlineDatabase.pathNode;

export const plantSitePhotoUploadTable = offlineDatabase.plantSitePhotoUpload;
export const plantSiteUploadPhotoTable = offlineDatabase.plantSiteUploadPhoto;
export const blobDataTable = offlineDatabase.blobData;
