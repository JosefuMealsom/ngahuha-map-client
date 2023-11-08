export type PlantSitePhotoUpload = {
  id?: number;
  plantSiteId: string;
  blobDataId: number;
  previewPhotoBlobDataId: number;
};

export type PlantSiteUpload = {
  id?: number;
  plantId?: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  photos: { data: ArrayBuffer; primaryPhoto: boolean; blobKey?: string }[];
};

export type PhotoFile = {
  id: string;
  file: Blob;
  primaryPhoto: boolean;
};
