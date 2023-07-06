import { MapBounds } from '../types/map-bounds.type';
import type { LatLong } from '../types/lat-long.type';
import {
  applyToPoint,
  compose,
  scale,
  transform,
  translate,
} from 'transformation-matrix';
import { useMapStore } from '../store/map.store';
import { MapState } from '../types/map-state.type';
transform;

export const interpolateToDomPosition = (
  domContainerHeight: number,
  position: LatLong,
  mapState: MapState,
) => {
  const canvasDimensions = mapState.canvasDimensions;
  const zoom = mapState.zoom;
  const pan = mapState.pan;

  const interpolatedPosition = interpolateToCanvasPosition(position, mapState);

  if (!interpolatedPosition) return null;

  const canvasToDomRatio = domContainerHeight / canvasDimensions.height;
  const { width: cw, height: ch } = canvasDimensions;
  const offsetWidth = (cw / 2) * zoom - cw / 2;
  const offsetHeight = (ch / 2) * zoom - ch / 2;
  const { x, y } = interpolatedPosition;

  const transformationMatrix = compose(
    scale(zoom, zoom),
    scale(canvasToDomRatio, canvasToDomRatio),
    translate(-5 / zoom, -5 / zoom),
    translate(-offsetWidth / zoom, -offsetHeight / zoom),
    translate(pan.x / zoom, pan.y / zoom),
    translate(x, y),
  );

  return applyToPoint(transformationMatrix, { x: 0, y: 0 });
};

export const interpolateToCanvasPosition = (
  currentLocation: LatLong,
  mapState: MapState,
) => {
  const mapBounds = mapState.mapBounds;
  const canvasDimensions = mapState.canvasDimensions;

  const relativeCanvasPosition = interpolateGeolocationToRelativePosition(
    mapBounds,
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
