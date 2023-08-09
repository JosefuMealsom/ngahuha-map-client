import { PlantSiteUpload } from '../../types/api/upload/plant-site-upload.type';

let count = 0;

const plantSiteUploadFactory = {
  create(data: Partial<PlantSiteUpload>) {
    const dummyData: PlantSiteUpload = {
      id: count++,
      plantId: '666',
      latitude: 10,
      longitude: 20,
      accuracy: 30,
      photos: [{ data: new Uint8Array([0, 0, 0, 0]) }],
    };

    return Object.assign(dummyData, data);
  },
};

export default plantSiteUploadFactory;
