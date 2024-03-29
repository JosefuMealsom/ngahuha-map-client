import { Plant } from '../../types/api/plant.type';
import Fuse from 'fuse.js';
import { SearchFilter, SearchFilterMatch } from '../../types/filter.type';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';

export class SearchPlantsFilter implements SearchFilter<Plant> {
  private plantList: Plant[];
  private fuseInstance: Fuse<Plant>;
  private fuseOptions: Fuse.IFuseOptions<Plant> = {
    includeScore: true,
    useExtendedSearch: true,
    distance: 100,
    threshold: 0.2,

    keys: [
      { name: 'species', weight: 2 },
      { name: 'cultivar', weight: 2 },
      {
        name: 'extendedInfo.commonNames',
        weight: 2,
      },
      {
        name: 'extendedInfo.types',
        weight: 1,
      },
      {
        name: 'extendedInfo.tags',
        weight: 2,
      },
    ],
  };

  constructor(plants: Plant[]) {
    this.plantList = plants;
    this.fuseInstance = new Fuse(this.plantList, this.fuseOptions);
  }

  search(searchText: string): SearchFilterMatch<Plant>[] {
    if (searchText.length < 2) {
      return this.plantList.map((plant) => ({
        description: getFullPlantName(plant),
        data: plant,
      }));
    }

    const fuseSearchResults = this.fuseInstance.search(searchText);

    return fuseSearchResults.map((result) => ({
      description: getFullPlantName(result.item),
      data: result.item,
    }));
  }
}
