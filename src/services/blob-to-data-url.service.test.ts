import { describe, expect, it } from 'vitest';
import blobToDataUrlService from './blob-to-data-url.service';

describe('BlobToDataUrlService', () => {
  describe('convert()', () => {
    const blob = new Blob();

    it('converts the file data to base64', async () => {
      const result = await blobToDataUrlService.convert(blob);
      // Perhaps too trivial a result to test? Hard to override implementation however.
      expect(result).toEqual('data:application/octet-stream;base64,');
    });
  });
});
