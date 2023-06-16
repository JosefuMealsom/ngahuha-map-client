import { MapBounds } from '../types/map-bounds.type';
import type { LatLong } from '../types/lat-long.type';

class MapPositionInterpolatorService {
  interpolateToCanvasPosition(
    bounds: MapBounds,
    currentLocation: LatLong,
    canvasDimensions: { width: number; height: number },
  ) {
    const relativeCanvasPosition =
      this.interpolateGeolocationToRelativePosition(bounds, currentLocation);

    if (!this.testLocationInCanvasBounds(relativeCanvasPosition)) {
      return null;
    }

    return {
      x: relativeCanvasPosition.x * canvasDimensions.width,
      y: relativeCanvasPosition.y * canvasDimensions.height,
    };
  }

  private testLocationInCanvasBounds(relativePosition: {
    x: number;
    y: number;
  }) {
    if (
      relativePosition.x < 0 ||
      relativePosition.x > 1 ||
      relativePosition.y < 0 ||
      relativePosition.y > 1
    ) {
      return false;
    }
    return true;
  }

  private interpolateGeolocationToRelativePosition(
    bounds: MapBounds,
    currentLocation: LatLong,
  ) {
    const interpolatedLat =
      (currentLocation.lat - bounds.lat[0]) / (bounds.lat[1] - bounds.lat[0]);

    const interpolatedLong =
      (currentLocation.long - bounds.long[0]) /
      (bounds.long[1] - bounds.long[0]);

    return { x: interpolatedLong, y: interpolatedLat };
  }
}

export default new MapPositionInterpolatorService();
