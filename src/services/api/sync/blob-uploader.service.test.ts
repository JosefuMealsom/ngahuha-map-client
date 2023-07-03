import { expect, describe, it } from 'vitest';
import { fetchBlobUploadUrl } from './blob-uploader.service';
import {
  assertEndPointCalled,
  stubFetchResponse,
} from '../../../test-helpers/fetch-stub';

describe('BlobUploaderService', () => {
  describe('fetchBlobUploadUrl()', () => {
    it('fetches a list of upload urls from the server', async () => {
      stubFetchResponse({ blobKey: '123', url: 'lovely url' });
      const result = await fetchBlobUploadUrl();
      assertEndPointCalled(
        'https://www.dummy-api.com/blob/presigned-upload-url',
      );
      expect(result).toEqual({ blobKey: '123', url: 'lovely url' });
    });
  });
});
