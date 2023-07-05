import { useRef } from 'react';
import mapUrl from '../assets/map.jpg';
import imageLoaderService from '../services/image-loader.service';
import { usePosition } from '../hooks/use-position.hook';
import canvasMapImage from './MapImage';
import { useAnimationFrame } from '../hooks/use-animation-frame.hook';
import {
  plantSiteTable,
  plantSiteUploadTable,
} from '../services/offline.database';
import { PlantSite } from '../types/api/plant-site.type';
import { PlantSiteUpload } from '../types/api/upload/plant-site-upload.type';
import { useLiveQuery } from 'dexie-react-hooks';
import { applyTransform } from '../services/view/map-view-transform.service';
import { useMapStore } from '../store/map.store';
import {
  renderImageOnMap,
  renderMarkerOnMap,
} from '../services/view/map-renderer';

export function MapCanvas() {
  const canvasDimensions = useMapStore((state) => state.canvasDimensions);
  const canvasRef = useRef(null);

  let mapImage: HTMLImageElement | null;
  let plantSites: PlantSite[] = [];
  let plantSiteUploads: PlantSiteUpload[] = [];
  let coords: GeolocationCoordinates | null = null;

  useLiveQuery(async () => {
    plantSites = await plantSiteTable.toArray();
    plantSiteUploads = await plantSiteUploadTable.toArray();
  });

  usePosition((geolocationPosition) => {
    coords = geolocationPosition.coords;
  });

  useAnimationFrame(() => {
    drawMap(canvasRef?.current);
  });

  imageLoaderService.loadImage(mapUrl).then((image) => (mapImage = image));

  function drawMap(canvas: HTMLCanvasElement | null) {
    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (!context) return;

    context.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);

    applyTransform(context, () => {
      drawMapImages(context);
      drawMapMarkers(context);
      drawLocationMarker(context);
    });
  }

  function drawMapImages(context: CanvasRenderingContext2D) {
    if (mapImage) {
      renderImageOnMap(context, mapImage, 0.5);
    }
    if (canvasMapImage) {
      renderImageOnMap(context, canvasMapImage);
    }
  }

  function drawMapMarkers(context: CanvasRenderingContext2D) {
    for (const plantSite of plantSites) {
      renderMarkerOnMap(context, plantSite, '#0f0');
    }
    for (const plantSiteUpload of plantSiteUploads) {
      renderMarkerOnMap(context, plantSiteUpload, '#00f');
    }
  }

  function drawLocationMarker(context: CanvasRenderingContext2D) {
    if (coords) renderMarkerOnMap(context, coords);
  }

  return (
    <div>
      <canvas
        className="h-screen"
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      />
    </div>
  );
}
