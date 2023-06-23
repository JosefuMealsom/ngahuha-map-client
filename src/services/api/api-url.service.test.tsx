import { expect, describe, it } from 'vitest';
import apiUrlService from './api-url.service';

describe('ApiUrlService', () => {
  describe('getFullPath()', () => {
    it('generates a url with the correct path', async () => {
      expect(apiUrlService.getFullPath('joe/is/cool')).toEqual(
        'https://www.dummy-api.com/joe/is/cool',
      );
    });

    describe('path has query params', () => {
      it('adds the query params to the url', async () => {
        expect(
          apiUrlService.getFullPath('joe/is/cool', {
            myAwesomeKey: 'hell yeah',
            myLameKey: 'hell no',
          }),
        ).toEqual(
          'https://www.dummy-api.com/joe/is/cool?myAwesomeKey=hell+yeah&myLameKey=hell+no',
        );
      });

      it('does not add query params if the object is empty', async () => {
        expect(apiUrlService.getFullPath('joe/is/cool', {})).toEqual(
          'https://www.dummy-api.com/joe/is/cool',
        );
      });
    });
  });
});
