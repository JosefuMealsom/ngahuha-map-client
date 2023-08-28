import axiosClient from '../../axios/axios-client';

type BlobUrl = { blobKey: string; url: string };

export const fetchBlobUploadUrl = async (): Promise<BlobUrl> => {
  const response = await axiosClient.get('blob/presigned-upload-url');

  return response.data;
};

export const uploadBlob = (blobUploadUrl: string, data: ArrayBuffer) => {
  return axiosClient.put(
    blobUploadUrl,
    { method: 'PUT', body: data },
    { withCredentials: false },
  );
};
