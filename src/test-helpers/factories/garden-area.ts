import { GardenArea } from '../../types/api/garden-area.type';

let count = 0;

const gardenAreaFactory = {
  create(data: Partial<GardenArea>) {
    const dummyData: GardenArea = {
      id: 'my garden area id',
      name: `My garden area ${count++}`,
      description: `A beautiful area`,
      createdAt: '1988-11-11T00:00:00.000Z',
      updatedAt: '1988-11-11T00:00:00.000Z',
    };

    return Object.assign(dummyData, data);
  },
};

export default gardenAreaFactory;
