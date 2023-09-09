export type PlantSitePhotoUpload = {
  data: ArrayBuffer;
  primaryPhoto: boolean;
  blobKey?: string;
};

export type PlantSiteUpload = {
  id?: number;
  plantId?: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  photos: PlantSitePhotoUpload[];
};

export type PhotoFile = {
  id: string;
  file: Blob;
  primaryPhoto: boolean;
};
