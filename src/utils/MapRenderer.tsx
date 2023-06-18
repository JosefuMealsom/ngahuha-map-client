import { MapBounds } from '../types/map-bounds.type';
import mapPositionInterpolator from '../services/map-position-interpolator.service';
import { LatLong } from '../types/lat-long.type';

class MapRenderer {
  canvasDimensions: { width: number; height: number };
  mapBounds: MapBounds;

  constructor(
    canvasDimensions: { width: number; height: number },
    mapBounds: MapBounds,
  ) {
    this.canvasDimensions = canvasDimensions;
    this.mapBounds = mapBounds;
  }

  drawImage(
    context: CanvasRenderingContext2D,
    image: HTMLImageElement | HTMLCanvasElement,
    alpha?: number,
  ) {
    context.globalAlpha = alpha || 1;
    context.drawImage(
      image,
      0,
      0,
      this.canvasDimensions.width,
      this.canvasDimensions.height,
    );
    context.globalAlpha = 1;
  }

  drawMarker(
    context: CanvasRenderingContext2D,
    coords: LatLong,
    colour?: string,
  ) {
    const canvasPosition = mapPositionInterpolator.interpolateToCanvasPosition(
      this.mapBounds,
      coords,
      this.canvasDimensions,
    );

    if (!canvasPosition) {
      return;
    }

    const { x, y } = canvasPosition;

    context.beginPath();
    context.rect(x - 5, y - 5, 10, 10);
    context.fillStyle = colour || '#f00';
    context.fill();
  }
}

export default MapRenderer;
