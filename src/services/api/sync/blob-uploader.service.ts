import axiosClient from '../../axios/axios-client';

type BlobUrl = { blobKey: string; url: string };

export const fetchBlobUploadUrl = async (): Promise<BlobUrl> => {
  const response = await axiosClient.get('blob/presigned-upload-url', {
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });

  return response.data;
};

export const uploadBlob = (blobUploadUrl: string, data: ArrayBuffer) => {
  return axiosClient.put(blobUploadUrl, data, { withCredentials: false });
};
