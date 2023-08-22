import { getFullApiPath } from '../../../utils/api-url.util';

type BlobUrl = { blobKey: string; url: string };

export const fetchBlobUploadUrl = async (): Promise<BlobUrl> => {
  const response = await fetch(getFullApiPath('blob/presigned-upload-url'), {
    credentials: 'include',
  });

  return response.json();
};

export const uploadBlob = (blobUploadUrl: string, data: ArrayBuffer) => {
  return fetch(blobUploadUrl, { method: 'PUT', body: data });
};
