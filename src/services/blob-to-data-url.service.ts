class BlobToDataUrlService {
  convert(blob: Blob) {
    return new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject();
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export default new BlobToDataUrlService();
