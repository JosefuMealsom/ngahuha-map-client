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
  photos?: { data: ArrayBuffer; primaryPhoto: boolean; blobKey?: string }[];
};

// Bit confusing, this model is for the plant sites that are yet to be uploaded.
// PlantSitePhotoUpload is for plant sites that already have been uploaded.
export type PlantSiteUploadPhoto = {
  id?: number;
  plantSiteUploadId: number;
  blobDataId: number;
  previewPhotoBlobDataId: number;
  primaryPhoto: boolean;
};

export type PhotoFile = {
  id: string;
  file: Blob;
  primaryPhoto: boolean;
};
