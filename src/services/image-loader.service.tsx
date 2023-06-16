class ImageLoaderService {
  async loadImage(src: string): Promise<HTMLImageElement> {
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
  }
}

export default new ImageLoaderService();
