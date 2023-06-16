import { useRef } from 'react';
import mapUrl from '../assets/map.jpg';
import mapPositionInterpolator from '../services/map-position-interpolator.service';
import geolocationService from '../services/geolocation.service';
import imageLoaderService from '../services/image-loader.service';
import { usePosition } from '../hooks/use-position.hook';
import { MapBounds } from '../types/map-bounds.type';

export function MapCanvas() {
  const canvasDimensions = { width: 432, height: 657 };
  const mapBounds: MapBounds = {
    latitude: [-35.373941, -35.378587],
    longitude: [173.96343, 173.967164],
  };
  let mapImage: HTMLImageElement | null;

  const canvasRef = useRef(null);
  usePosition(onPositionChange);

  imageLoaderService.loadImage(mapUrl).then((image) => (mapImage = image));

  function onPositionChange(position: GeolocationPosition) {
    drawMap(canvasRef?.current);
  }

  async function drawMap(canvas: HTMLCanvasElement | null) {
    if (!canvas || !mapImage) {
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

    context.drawImage(mapImage, 0, 0);
    context.beginPath();
    context.rect(x - 5, y - 5, 10, 10);
    context.fillStyle = '#f00';
    context.fill();
  }

  return (
    <div className="flex w-full justify-center">
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      />
    </div>
  );
}
