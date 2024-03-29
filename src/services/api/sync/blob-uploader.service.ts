import { BlobData } from '../../../types/api/upload/blob-data.type';
import axiosClient from '../../axios/axios-client';
import { blobDataTable } from '../../offline.database';

type BlobUrl = { blobKey: string; url: string };

export const fetchBlobUploadUrl = async (): Promise<BlobUrl> => {
  // Timestamp required to prevent axios from caching get request
  const response = await axiosClient.get(
    `blob/presigned-upload-url?timestamp=${Date.now()}&rid=${crypto.randomUUID()}`,
  );
  return response.data;
};

export const uploadBlob = (blobUploadUrl: string, data: ArrayBuffer) => {
  return axiosClient.put(blobUploadUrl, data, { withCredentials: false });
};

export const uploadBlobData = async (blob: BlobData) => {
  if (blob.blobKey) {
    return blob.blobKey;
  }

  const { url, blobKey } = await fetchBlobUploadUrl();

  await uploadBlob(url, blob.data);

  await blobDataTable.update(blob, { blobKey: blobKey });

  return blobKey;
};
