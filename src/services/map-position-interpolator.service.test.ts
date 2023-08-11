import { describe, expect, it } from 'vitest';
import { interpolateToCanvasPosition } from './map-position-interpolator.service';
import { MapState } from '../types/map-state.type';

describe('MapPositionInterpolatorService', () => {
  describe('interpolateToCanvasPosition()', () => {
    const mapState: MapState = {
      mapBounds: {
        lat: [20, 40],
        long: [20, 40],
      },
      zoom: 1,
      pan: { x: 0, y: 0 },
      canvasDimensions: { width: 1000, height: 1000 },
    };

    it('interpolates the geolocation to an x,y point', () => {
      const currentLocation = { latitude: 30, longitude: 35, accuracy: 1 };

      expect(interpolateToCanvasPosition(currentLocation, mapState)).toEqual({
        x: 750,
        y: 500,
      });
    });

    it('returns null if current location is out of bounds', () => {
      const locationsOutsideBounds = [
        { latitude: 100, longitude: 100, accuracy: 1 },
        { latitude: -100, longitude: -100, accuracy: 1 },
        { latitude: 30, longitude: 100, accuracy: 1 },
        { latitude: 100, longitude: 30, accuracy: 1 },
      ];

      for (const location of locationsOutsideBounds)
        expect(interpolateToCanvasPosition(location, mapState)).toEqual(null);
    });
  });
});
