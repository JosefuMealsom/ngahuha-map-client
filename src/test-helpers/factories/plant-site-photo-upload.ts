import { PlantSitePhotoUpload } from '../../types/api/upload/plant-site-photo-upload.type';

let count = 0;

const plantSitePhotoUploadFactory = {
  create(photoData: Partial<PlantSitePhotoUpload>) {
    const dummyData: PlantSitePhotoUpload = {
      id: count++,
      plantSiteId: 123,
      data: new Blob(),
    };

    return Object.assign(dummyData, photoData);
  },
};

export default plantSitePhotoUploadFactory;
