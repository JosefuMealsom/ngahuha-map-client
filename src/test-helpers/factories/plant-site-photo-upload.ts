import { PlantSitePhotoUpload } from '../../types/api/upload/plant-site-upload.type';

let count = 0;

const plantSitePhotoUploadFactory = {
  create(photoData: Partial<PlantSitePhotoUpload>) {
    const dummyData: PlantSitePhotoUpload = {
      data: new ArrayBuffer(8),
      primaryPhoto: false,
    };

    return Object.assign(dummyData, photoData);
  },
};

export default plantSitePhotoUploadFactory;
