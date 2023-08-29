export type FeatureUpload = {
  id?: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  accuracy: number;
};

export type FeaturePhotoUpload = {
  id?: number;
  featureUploadId: number;
  data: ArrayBuffer;
  blobKey?: string;
};
