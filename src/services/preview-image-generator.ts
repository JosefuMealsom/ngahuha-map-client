import blobToDataUrlService from './blob-to-data-url.service';

export const generateImagePreview = async (file: File | Blob) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const image = new Image();
  image.src = (await blobToDataUrlService.convert(file)) || '';

  const { width, height } = image;

  const canvasWidth = 400;

  canvas.width = canvasWidth;
  canvas.height = (height / width) * canvasWidth;

  context?.drawImage(image, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((success, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject('Failed to convert canvas to blob');
      } else {
        success(blob);
      }
    });
  });
};
