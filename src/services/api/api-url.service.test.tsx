import { expect, describe, it } from 'vitest';
import apiUrlService from './api-url.service';

describe('ApiUrlService', () => {
  describe('getFullPath()', () => {
    it('generates a url with the correct path', async () => {
      expect(apiUrlService.getFullPath('joe/is/cool')).toEqual(
        'https://www.dummy-api.com/joe/is/cool',
      );
    });
  });
});
