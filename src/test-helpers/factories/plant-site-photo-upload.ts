import { PlantSitePhotoUpload } from '../../types/api/upload/plant-site-upload.type';

const plantSitePhotoUploadFactory = {
  create(photoData: Partial<PlantSitePhotoUpload>) {
    const dummyData: PlantSitePhotoUpload = {
      plantSiteId: photoData.plantSiteId || 'abc',
      blobDataId: photoData.blobDataId || 1,
      previewPhotoBlobDataId: photoData.previewPhotoBlobDataId || 2,
    };

    return Object.assign(dummyData, photoData);
  },
};

export default plantSitePhotoUploadFactory;
