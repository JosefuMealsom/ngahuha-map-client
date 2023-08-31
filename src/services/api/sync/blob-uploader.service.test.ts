import { expect, describe, it } from 'vitest';
import { fetchBlobUploadUrl } from './blob-uploader.service';
import { mockApiCall } from '../../../test-helpers/fetch-stub';
import { getFullApiPath } from '../../../utils/api-url.util';

describe('BlobUploaderService', () => {
  describe('fetchBlobUploadUrl()', () => {
    it('fetches a list of upload urls from the server', async () => {
      mockApiCall(getFullApiPath('blob/presigned-upload-url'), {
        blobKey: '123',
        url: 'lovely url',
      });
      const result = await fetchBlobUploadUrl();

      expect(result).toEqual({ blobKey: '123', url: 'lovely url' });
    });
  });
});
