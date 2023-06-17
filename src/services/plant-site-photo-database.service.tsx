import { PlantSitePhotoDatabase } from './database/plant-site-photo.database';

class PlantSitePhotoDatabaseService {
  photoDatabase: PlantSitePhotoDatabase;

  constructor() {
    this.photoDatabase = new PlantSitePhotoDatabase();
  }

  all() {
    return this.photoDatabase.plantSitePhotos.toArray();
  }

  async add(photoFile: File, location: GeolocationCoordinates) {
    const photoData = await this.convertPhotoFileToDataUrl(photoFile);

    // Promise object could possibly be an array buffer due to the
    // return value of the reader.
    if (photoData && typeof photoData === 'string') {
      const result = await this.photoDatabase.plantSitePhotos.add({
        filename: File.name,
        plantSiteId: 'test_123',
        dataURL: photoData,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
      });
    }
  }

  convertPhotoFileToDataUrl(photoFile: File) {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(photoFile);
    });
  }
}

export default new PlantSitePhotoDatabaseService();
