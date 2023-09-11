let count = 0;

const blobDataFactory = {
  create(photoData: Partial<BlobData>) {
    const dummyData: BlobData = {
      data: photoData.data || new ArrayBuffer(8),
      blobKey: photoData.blobKey || undefined,
    };

    return Object.assign(dummyData, photoData);
  },
};

export default blobDataFactory;
