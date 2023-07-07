import type { PlantSite } from '../../types/api/plant-site.type';
let count = 0;

const plantSiteFactory = {
  create(data: Partial<PlantSite>) {
    const dummyData: PlantSite = {
      id: `My id ${count++}`,
      plantId: '666',
      latitude: 10,
      longitude: 20,
      accuracy: 30,
      createdAt: '1988-11-11T00:00:00.000Z',
      updatedAt: '1988-11-11T00:00:00.000Z',
    };

    return Object.assign(dummyData, data);
  },
};

export default plantSiteFactory;
