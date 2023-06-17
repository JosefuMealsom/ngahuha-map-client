import { describe, expect, it, vi } from 'vitest';
import geolocationService from './geolocation.service';
import stubGeolocationCoordinates from '../test-helpers/geolocation-stub';
stubGeolocationCoordinates.stub({ latitude: 30, longitude: 40 });

describe('GeolocationService', () => {
  describe('getCurrentPosition()', () => {
    it('returns the coords of the user', async () => {
      const coordinates = await geolocationService.getCurrentPosition();
      expect(coordinates.latitude).toEqual(30);
      expect(coordinates.longitude).toEqual(40);
    });
  });
});
