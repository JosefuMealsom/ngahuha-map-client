import { assert, describe, expect, it } from 'vitest';
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
      const currentLocation = { lat: 30, long: 35 };

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
        { lat: 100, long: 100 },
        { lat: -100, long: -100 },
        { lat: 30, long: 100 },
        { lat: 100, long: 30 },
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
