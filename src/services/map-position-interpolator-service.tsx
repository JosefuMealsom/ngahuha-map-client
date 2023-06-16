import { MapBounds } from '../types/map-bounds-type';

type CanvasDimensions = {
  width: number;
  height: number;
};

class MapPositionInterpolatorService {
  interpolateToCanvasPosition(
    bounds: MapBounds,
    currentLocation: GeolocationCoordinates,
    canvasDimensions: CanvasDimensions,
  ) {
    const { lat, long } = this.interpolateGeolocation(bounds, currentLocation);

    return {
      x: long * canvasDimensions.width,
      y: lat * canvasDimensions.height,
    };
  }

  private interpolateGeolocation(
    bounds: MapBounds,
    currentLocation: GeolocationCoordinates,
  ) {
    const interpolatedLat =
      (currentLocation.latitude - bounds.latitude[0]) /
      (bounds.latitude[1] - bounds.latitude[0]);

    const interpolatedLong =
      (currentLocation.longitude - bounds.longitude[0]) /
      (bounds.longitude[1] - bounds.longitude[0]);

    return { lat: interpolatedLat, long: interpolatedLong };
  }
}

export default new MapPositionInterpolatorService();
