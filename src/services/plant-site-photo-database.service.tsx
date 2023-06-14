import { Collection } from 'dexie';
import { PlantSitePhotoDatabase } from './database/plant-site-photo.database';

class PlantSitePhotoDatabaseService {
  photoDatabase: PlantSitePhotoDatabase;

  constructor() {
    this.photoDatabase = new PlantSitePhotoDatabase();
  }

  all(): Collection<PlantSitePhoto> {
    return this.photoDatabase.plantSitePhotos.toCollection();
  }

  async add(photoFile: File) {
    const photoData = await this.convertPhotoFileToDataUrl(photoFile);

    // Promise object could possibly be an array buffer due to the
    // return value of the reader.
    if (photoData && typeof photoData === 'string') {
      const result = await this.photoDatabase.plantSitePhotos.add({
        filename: 'photo name',
        plantSiteId: 'test_123',
        dataURL: photoData,
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
