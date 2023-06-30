import { PlantSiteUpload } from '../../types/api/upload/plant-site-upload.type';

let count = 0;

const plantSiteFactory = {
  create(data: Partial<PlantSiteUpload>) {
    const dummyData: PlantSiteUpload = {
      id: data.id || count++,
      plantId: data.plantId || '666',
      latitude: data.latitude || 10,
      longitude: data.longitude || 20,
      accuracy: data.accuracy || 30,
    };

    return Object.assign(dummyData, data);
  },
};

export default plantSiteFactory;
