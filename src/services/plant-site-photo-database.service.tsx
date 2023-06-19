import { PlantSitePhotoDatabase } from './database/plant-site-photo.database';
import fileToDataUrlService from './file-to-data-url.service';

class PlantSitePhotoDatabaseService {
  photoDatabase: PlantSitePhotoDatabase;

  constructor() {
    this.photoDatabase = new PlantSitePhotoDatabase();
  }

  all() {
    return this.photoDatabase.plantSitePhotos.toArray();
  }

  async add(photoFile: File, location: GeolocationCoordinates) {
    const photoData = await fileToDataUrlService.convert(photoFile);

    // Promise object could possibly be an array buffer due to the
    // return value of the reader.
    if (photoData) {
      const result = await this.photoDatabase.plantSitePhotos.add({
        filename: File.name,
        plantSiteId: 'test_123',
        dataURL: photoData,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
      });

      return result;
    }
  }

  async delete(id: number) {
    return await this.photoDatabase.plantSitePhotos.delete(id);
  }
}

export default new PlantSitePhotoDatabaseService();
