import Dexie from 'dexie';
import { getFullApiPath } from './api-url.util';
import axiosClient from '../services/axios/axios-client';

class ApiFetchUtil {
  fetchUpdatedModels(table: Dexie.Table, apiPath: string) {
    return new Promise<any>(async (success, reject) => {
      const result = await axiosClient.get(
        getFullApiPath(apiPath, await this.getLastmodifiedTimestamp(table)),
      );

      success(result.data);
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
