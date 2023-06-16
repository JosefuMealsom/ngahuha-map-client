import { useRef } from 'react';
import mapUrl from '../assets/map.jpg';
import mapPositionInterpolator from '../services/map-position-interpolator.service';
import geolocationService from '../services/geolocation.service';
import imageLoaderService from '../services/image-loader.service';
import { usePosition } from '../hooks/use-position.hook';
import { MapBounds } from '../types/map-bounds.type';
import canvasMapImage from './MapImage';

export function MapCanvas() {
  const scale = 2;
  const canvasDimensions = { width: 432 * scale, height: 657 * scale };
  const mapBounds: MapBounds = {
    latitude: [-35.373941, -35.378587],
    longitude: [173.96343, 173.967164],
  };
  const canvasRef = useRef(null);
  let mapImage: HTMLImageElement | null;

  usePosition(onPositionChange);

  imageLoaderService.loadImage(mapUrl).then((image) => (mapImage = image));

  function onPositionChange(position: GeolocationPosition) {
    drawMap(canvasRef?.current);
  }

  async function drawMap(canvas: HTMLCanvasElement | null) {
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    const coords = await geolocationService.getCurrentPosition();

    const { x, y } = mapPositionInterpolator.interpolateToCanvasPosition(
      mapBounds,
      coords,
      canvasDimensions,
    );

    context.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);

    drawImageMap(context);
    drawVectorMap(context);

    context.beginPath();
    context.rect(x - 5, y - 5, 10, 10);
    context.fillStyle = '#f00';
    context.fill();
  }

  function drawVectorMap(context: CanvasRenderingContext2D) {
    if (!canvasMapImage) {
      return;
    }

    context.globalAlpha = 1;
    context.drawImage(
      canvasMapImage,
      0,
      0,
      canvasDimensions.width,
      canvasDimensions.height,
    );
  }

  function drawImageMap(context: CanvasRenderingContext2D) {
    if (!mapImage) {
      return;
    }

    context.globalAlpha = 0.5;
    context.drawImage(
      mapImage,
      0,
      0,
      canvasDimensions.width,
      canvasDimensions.height,
    );
  }

  return (
    <div className="flex w-full justify-center">
      <canvas
        className="w-full"
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      />
    </div>
  );
}
