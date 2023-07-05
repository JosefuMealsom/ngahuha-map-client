import { LatLong } from '../../types/lat-long.type';
import { useMapStore } from '../../store/map.store';
import { interpolateToCanvasPosition } from '../map-position-interpolator.service';

const canvasDimensions = () => {
  return useMapStore.getState().canvasDimensions;
};

const mapBounds = () => {
  return useMapStore.getState().mapBounds;
};

export const renderImageOnMap = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  alpha?: number,
) => {
  const { width, height } = canvasDimensions();
  context.globalAlpha = alpha || 1;
  context.drawImage(image, 0, 0, width, height);
  context.globalAlpha = 1;
};

export const renderMarkerOnMap = (
  context: CanvasRenderingContext2D,
  coords: LatLong,
  colour?: string,
) => {
  const canvasPosition = interpolateToCanvasPosition(
    mapBounds(),
    coords,
    canvasDimensions(),
  );

  if (!canvasPosition) {
    return;
  }

  const { x, y } = canvasPosition;

  context.beginPath();
  context.rect(x - 5, y - 5, 10, 10);
  context.fillStyle = colour || '#f00';
  context.fill();
};
