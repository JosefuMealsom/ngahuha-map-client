import { LatLong } from '../../types/lat-long.type';
import { useMapStore } from '../../store/map.store';
import { interpolateToCanvasPosition } from '../map-position-interpolator.service';
import pinSvg from '../../assets/svg/map-pin.svg';
import { PathNode } from '../../types/api/path.type';

const pinImage = new Image();
pinImage.src = pinSvg;

const canvasDimensions = () => {
  return useMapStore.getState().canvasDimensions;
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

export const renderMarkerImageOnMap = (
  context: CanvasRenderingContext2D,
  coords: LatLong,
) => {
  const canvasPosition = interpolateToCanvasPosition(
    coords,
    useMapStore.getState(),
  );

  if (!canvasPosition) {
    return;
  }

  const { x, y } = canvasPosition;
  const zoom = useMapStore.getState().zoom;

  context.drawImage(pinImage, x, y, 25 / zoom, 25 / zoom);
};

export const renderMarkerOnMap = (
  context: CanvasRenderingContext2D,
  coords: LatLong,
  colour?: string,
) => {
  const canvasPosition = interpolateToCanvasPosition(
    coords,
    useMapStore.getState(),
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

export const renderPath = (
  context: CanvasRenderingContext2D,
  pathNodes: LatLong[],
  colour?: string,
) => {
  if (pathNodes.length < 2) return;

  const startPosition = interpolateToCanvasPosition(
    pathNodes[0],
    useMapStore.getState(),
  );

  context.beginPath();
  context.lineWidth = 2;
  context.strokeStyle = colour || '#f00';
  context.fillStyle = colour || '#f00';
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.moveTo(startPosition!.x, startPosition!.y);

  for (let i = 1; i < pathNodes.length; i++) {
    const position = interpolateToCanvasPosition(
      pathNodes[i],
      useMapStore.getState(),
    );
    context.lineTo(position!.x, position!.y);
  }
  context.stroke();
};
