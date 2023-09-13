import { SearchFilterMatch } from '../../types/filter.type';
import { PlantSite } from '../../types/api/plant-site.type';
import { SearchPlantSitesFilter } from './search-plant-sites.filter';

export class MapSearchFilter extends SearchPlantSitesFilter {
  search(searchText: string): SearchFilterMatch<PlantSite>[] {
    if (searchText === '') {
      return [];
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
