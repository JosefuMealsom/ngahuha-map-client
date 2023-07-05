import { MapBounds } from '../types/map-bounds.type';
import type { LatLong } from '../types/lat-long.type';

export const interpolateToDomPosition = () => {};

export const interpolateToCanvasPosition = (
  bounds: MapBounds,
  currentLocation: LatLong,
  canvasDimensions: { width: number; height: number },
) => {
  const relativeCanvasPosition = interpolateGeolocationToRelativePosition(
    bounds,
    currentLocation,
  );

  if (!testLocationInCanvasBounds(relativeCanvasPosition)) {
    return null;
  }

  return {
    x: relativeCanvasPosition.x * canvasDimensions.width,
    y: relativeCanvasPosition.y * canvasDimensions.height,
  };
};

const testLocationInCanvasBounds = (relativePosition: {
  x: number;
  y: number;
}) => {
  if (
    relativePosition.x < 0 ||
    relativePosition.x > 1 ||
    relativePosition.y < 0 ||
    relativePosition.y > 1
  ) {
    return false;
  }
  return true;
};

const interpolateGeolocationToRelativePosition = (
  bounds: MapBounds,
  currentLocation: LatLong,
) => {
  const interpolatedLat =
    (currentLocation.latitude - bounds.lat[0]) /
    (bounds.lat[1] - bounds.lat[0]);

  const interpolatedLong =
    (currentLocation.longitude - bounds.long[0]) /
    (bounds.long[1] - bounds.long[0]);

  return { x: interpolatedLong, y: interpolatedLat };
};
