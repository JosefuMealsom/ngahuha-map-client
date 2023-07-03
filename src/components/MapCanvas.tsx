import { useRef } from 'react';
import mapUrl from '../assets/map.jpg';
import imageLoaderService from '../services/image-loader.service';
import { usePosition } from '../hooks/use-position.hook';
import { MapBounds } from '../types/map-bounds.type';
import canvasMapImage from './MapImage';
import { useAnimationFrame } from '../hooks/use-animation-frame.hook';
import MapRenderer from '../utils/map-renderer';
import {
  plantSiteTable,
  plantSiteUploadTable,
} from '../services/offline.database';
import { PlantSite } from '../types/api/plant-site.type';
import { PlantSiteUpload } from '../types/api/upload/plant-site-upload.type';
import { useLiveQuery } from 'dexie-react-hooks';

export function MapCanvas() {
  const scale = 2;
  const canvasDimensions = { width: 432 * scale, height: 657 * scale };
  const mapBounds: MapBounds = {
    lat: [-35.373941, -35.378587],
    long: [173.96343, 173.967164],
  };
  const canvasRef = useRef(null);
  const mapRenderer = new MapRenderer(canvasDimensions, mapBounds);

  let mapImage: HTMLImageElement | null;
  let plantSites: PlantSite[] = [];
  let plantSiteUploads: PlantSiteUpload[] = [];
  useLiveQuery(async () => {
    plantSites = await plantSiteTable.toArray();
    plantSiteUploads = await plantSiteUploadTable.toArray();
  });

  let coords: GeolocationCoordinates | null = null;

  usePosition((geolocationPosition) => {
    coords = geolocationPosition.coords;
  });

  imageLoaderService.loadImage(mapUrl).then((image) => (mapImage = image));

  useAnimationFrame(() => {
    drawMap(canvasRef?.current);
  });

  function drawMap(canvas: HTMLCanvasElement | null) {
    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (!context) return;

    context.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);

    drawMapImages(context);
    drawMapMarkers(context);
    drawLocationMarker(context);
  }

  function drawMapImages(context: CanvasRenderingContext2D) {
    if (mapImage) {
      mapRenderer.drawImage(context, mapImage, 0.5);
    }
    if (canvasMapImage) {
      mapRenderer.drawImage(context, canvasMapImage);
    }
  }

  function drawMapMarkers(context: CanvasRenderingContext2D) {
    for (const plantSite of plantSites) {
      mapRenderer.drawMarker(context, plantSite, '#0f0');
    }
    for (const plantSiteUpload of plantSiteUploads) {
      mapRenderer.drawMarker(context, plantSiteUpload, '#00f');
    }
  }

  function drawLocationMarker(context: CanvasRenderingContext2D) {
    if (coords) mapRenderer.drawMarker(context, coords);
  }

  return (
    <div className="flex w-full justify-center">
      <canvas
        className="w-full max-w-md"
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      />
    </div>
  );
}
