import {
  PlantSitePhotoUpload,
  PlantSiteUploadPhoto,
} from '../../types/api/upload/plant-site-upload.type';

const plantSiteUploadPhotoFactory = {
  create(photoData: Partial<PlantSiteUploadPhoto>) {
    const dummyData: PlantSiteUploadPhoto = {
      plantSiteUploadId: photoData.plantSiteUploadId || 1,
      primaryPhoto: photoData.primaryPhoto || false,
      blobDataId: photoData.blobDataId || 1,
      previewPhotoBlobDataId: photoData.previewPhotoBlobDataId || 2,
    };

    return Object.assign(dummyData, photoData);
  },
};

export default plantSiteUploadPhotoFactory;
