import Dexie from 'dexie';
import { getFullApiPath } from './api-url.util';

class ApiFetchUtil {
  fetchUpdatedModels(table: Dexie.Table, apiPath: string) {
    return new Promise<any>(async (success, reject) => {
      const data = await fetch(
        getFullApiPath(apiPath, await this.getLastmodifiedTimestamp(table)),
      );
      const dataToJSON = await data.json();

      success(dataToJSON);
    });
  }

  private async getLastmodifiedTimestamp(table: Dexie.Table) {
    if ((await table.count()) === 0) {
      return {};
    }

    const lastModifiedItem = await table.orderBy('updatedAt').reverse().first();

    return {
      lastModified: lastModifiedItem?.updatedAt,
    };
  }
}

export default new ApiFetchUtil();
