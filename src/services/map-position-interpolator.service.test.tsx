import { describe, expect, it } from 'vitest';
import mapPositionInterpolatorService from './map-position-interpolator.service';
import { MapBounds } from '../types/map-bounds.type';

describe('MapPositionInterpolatorService', () => {
  describe('interpolateToCanvasPosition()', () => {
    const mapBounds: MapBounds = {
      lat: [20, 40],
      long: [20, 40],
    };
    const canvasDimensions = { width: 1000, height: 1000 };

    it('interpolates the geolocation to an x,y point', () => {
      const currentLocation = { latitude: 30, longitude: 35 };

      expect(
        mapPositionInterpolatorService.interpolateToCanvasPosition(
          mapBounds,
          currentLocation,
          canvasDimensions,
        ),
      ).toEqual({ x: 750, y: 500 });
    });

    it('returns null if current location is out of bounds', () => {
      const locationsOutsideBounds = [
        { latitude: 100, longitude: 100 },
        { latitude: -100, longitude: -100 },
        { latitude: 30, longitude: 100 },
        { latitude: 100, longitude: 30 },
      ];

      for (const location of locationsOutsideBounds)
        expect(
          mapPositionInterpolatorService.interpolateToCanvasPosition(
            mapBounds,
            location,
            canvasDimensions,
          ),
        ).toEqual(null);
    });
  });
});
