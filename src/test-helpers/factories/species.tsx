import { Species } from '../../types/api/species.type';

const speciesFactory = {
  create(data: Partial<Species>) {
    const dummyData = {
      id: '123',
      genusId: '456',
      typeId: '789',
      name: 'Cool species',
      cultivar: 'Cool cultivar',
      commonNames: [],
      createdAt: '1988-11-11T00:00:00.000Z',
      updatedAt: '1988-11-11T00:00:00.000Z',
    };

    return Object.assign(dummyData, data);
  },
};

export default speciesFactory;
