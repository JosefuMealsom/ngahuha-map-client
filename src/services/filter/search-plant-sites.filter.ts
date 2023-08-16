import { Plant } from '../../types/api/plant.type';
import Fuse from 'fuse.js';
import { SearchFilter, SearchFilterMatch } from '../../types/filter.type';
import { PlantSite } from '../../types/api/plant-site.type';

export class SearchPlantSitesFilter<
  PlantSiteSubclass extends PlantSite = PlantSite,
> implements SearchFilter<PlantSiteSubclass>
{
  private plantSiteList: PlantSiteSubclass[];
  private plantList: Plant[];
  private fuseInstance: Fuse<Plant>;
  private fuseOptions = {
    includeScore: true,
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
        name: 'extendedInfo.type',
        weight: 1,
      },
      {
        name: 'extendedInfo.tags',
        weight: 2,
      },
    ],
  };

  constructor(plantSites: PlantSiteSubclass[], plants: Plant[]) {
    this.plantSiteList = plantSites;
    this.plantList = plants;
    this.fuseInstance = new Fuse(this.plantList, this.fuseOptions);
  }

  search(searchText: string): SearchFilterMatch<PlantSiteSubclass>[] {
    if (searchText === '') {
      return this.plantSiteList.map((plantSite) => ({
        description: plantSite.id,
        data: plantSite,
      }));
    }

    const fuseSearchResults = this.fuseInstance.search(searchText);

    const foundPlantIds = fuseSearchResults.map((plant) => plant.item.id);
    const filteredPlantSites = this.plantSiteList.filter((plantSite) =>
      foundPlantIds.includes(plantSite.plantId),
    );

    return filteredPlantSites.map((plantSite) => ({
      description: plantSite.id,
      data: plantSite,
    }));
  }
}
