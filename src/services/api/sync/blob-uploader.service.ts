import axiosClient from '../../axios/axios-client';

type BlobUrl = { blobKey: string; url: string };

export const fetchBlobUploadUrl = async (): Promise<BlobUrl> => {
  // Timestamp required to prevent axios from caching get request
  const response = await axiosClient.get(
    `blob/presigned-upload-url?timestamp={${new Date().getTime()}}`,
  );

  return response.data;
};

export const uploadBlob = (blobUploadUrl: string, data: ArrayBuffer) => {
  return axiosClient.put(blobUploadUrl, data, { withCredentials: false });
};
