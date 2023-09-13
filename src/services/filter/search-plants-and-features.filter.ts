import { Plant } from '../../types/api/plant.type';
import Fuse from 'fuse.js';
import { SearchFilter, SearchFilterMatch } from '../../types/filter.type';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
import { Feature } from '../../types/api/feature.type';

export class SearchPlantsAndFeaturesFilter
  implements SearchFilter<Plant | Feature>
{
  private plantsAndFeaturesList: (Plant | Feature)[];
  private fuseInstance: Fuse<Plant | Feature>;
  private fuseOptions: Fuse.IFuseOptions<Plant | Feature> = {
    includeScore: true,
    useExtendedSearch: true,
    distance: 100,
    threshold: 0.2,
    keys: [
      { name: 'name', weight: 1 },
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

  constructor(plantsAndFeatures: (Plant | Feature)[]) {
    this.plantsAndFeaturesList = plantsAndFeatures;
    this.fuseInstance = new Fuse(this.plantsAndFeaturesList, this.fuseOptions);
  }

  search(searchText: string): SearchFilterMatch<Plant | Feature>[] {
    if (searchText.length < 2) {
      return this.plantsAndFeaturesList.map(getMatch);
    }
    const fuseSearchResults = this.fuseInstance.search(searchText);
    return fuseSearchResults.map((result) => getMatch(result.item));
  }
}

function getMatch(item: Plant | Feature) {
  if (isPlant(item)) {
    return plantMatch(item);
  }
  return featureMatch(item);
}

function featureMatch(feature: Feature) {
  return { description: feature.name, data: feature };
}

function plantMatch(plant: Plant) {
  return { description: getFullPlantName(plant), data: plant };
}

function isPlant(item: Plant | Feature): item is Plant {
  return (item as Plant).species !== undefined;
}
