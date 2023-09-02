export type FeaturePhoto = {
  id: string;
  featureId: string;
  url: string;
  data?: ArrayBuffer;
  createdAt: string;
  updatedAt: string;
  metadata?: { [key: string]: any };
};
