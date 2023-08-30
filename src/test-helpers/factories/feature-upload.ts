import { FeatureUpload } from '../../types/api/upload/feature-upload.type';

let count = 0;

const featureUploadFactory = {
  create(data: Partial<FeatureUpload>) {
    const dummyData: FeatureUpload = {
      id: count++,
      name: `My cool feature ${count}`,
      description: 'My sweet description',
      latitude: 10,
      longitude: 20,
      accuracy: 30,
    };

    return Object.assign(dummyData, data);
  },
};

export default featureUploadFactory;
