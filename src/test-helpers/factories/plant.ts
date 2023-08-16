import { Plant } from '../../types/api/plant.type';

const plantFactory = {
  create(data: Partial<Plant>) {
    const dummyData: Plant = {
      id: '123',
      species: 'Cool species',
      cultivar: 'Cool cultivar',
      createdAt: '1988-11-11T00:00:00.000Z',
      updatedAt: '1988-11-11T00:00:00.000Z',
    };

    return Object.assign(dummyData, data);
  },
};

export default plantFactory;
