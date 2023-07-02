import apiUrlUtil from '../../utils/api-url.util';

type BlobUrl = { blobKey: string; url: string };

export const fetchBlobUploadUrl = async (): Promise<BlobUrl> => {
  const response = await fetch(
    apiUrlUtil.getFullPath('blob/presigned-upload-url'),
  );

  return response.json();
};

export const uploadBlob = (blobUploadUrl: string, data: Blob) => {
  return fetch(blobUploadUrl, { method: 'PUT', body: data });
};
