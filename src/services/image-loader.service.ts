export const loadImage = async (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.addEventListener('loaderror', (error) => {
      reject(error);
    });
  });
};

export const loadBlob = async (blobUrl: string): Promise<Blob> => {
  const response = await fetch(blobUrl);

  return response.blob();
};
