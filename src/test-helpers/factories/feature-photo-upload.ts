import { FeaturePhotoUpload } from '../../types/api/upload/feature-upload.type';

let count = 0;

const featurePhotoUploadFactory = {
  create(photoData: Partial<FeaturePhotoUpload>) {
    const dummyData: FeaturePhotoUpload = {
      id: count++,
      featureUploadId: 123,
      data: new ArrayBuffer(8),
    };

    return Object.assign(dummyData, photoData);
  },
};

export default featurePhotoUploadFactory;
