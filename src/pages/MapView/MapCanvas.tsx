import { useEffect, useRef, useState } from 'react';
import mapUrl from '../../assets/ngahuha.png';
import { loadImage } from '../../services/image-loader.service';
import { useAnimationFrame } from '../../hooks/use-animation-frame.hook';
import {
  plantSiteTable,
  plantSiteUploadTable,
} from '../../services/offline.database';
import { PlantSite } from '../../types/api/plant-site.type';
import { PlantSiteUpload } from '../../types/api/upload/plant-site-upload.type';
import { useLiveQuery } from 'dexie-react-hooks';
import { applyTransform } from '../../services/view/map-view-transform.service';
import { useMapStore } from '../../store/map.store';
import {
  renderImageOnMap,
  renderMarkerImageOnMap,
  renderMarkerOnMap,
} from '../../services/view/map-renderer';

export function MapCanvas() {
  const canvasDimensions = useMapStore((state) => state.canvasDimensions);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [windowSizeClass, setWindowSizeClass] = useState('');

  let mapImage: HTMLImageElement | null;
  let plantSites: PlantSite[] = [];
  let plantSiteUploads: PlantSiteUpload[] = [];

  useLiveQuery(async () => {
    plantSites = await plantSiteTable.toArray();
    plantSiteUploads = await plantSiteUploadTable.toArray();
  });

  useAnimationFrame(() => {
    drawMap(canvasRef?.current);
  });

  function determineCanvasDomSize() {
    const canvasSizeClass =
      window.innerWidth < window.innerHeight ? 'h-screen' : 'w-screen';

    setWindowSizeClass(canvasSizeClass);
  }

  useEffect(() => {
    determineCanvasDomSize();
  }, []);

  window.addEventListener('resize', determineCanvasDomSize);

  loadImage(mapUrl).then((image) => (mapImage = image));

  function drawMap(canvas: HTMLCanvasElement | null) {
    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (!context) return;

    context.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);

    applyTransform(context, () => {
      drawMapImages(context);
      // drawMapMarkers(context);
    });
  }

  function drawMapImages(context: CanvasRenderingContext2D) {
    if (mapImage) {
      renderImageOnMap(context, mapImage);
    }
  }

  function drawMapMarkers(context: CanvasRenderingContext2D) {
    for (const plantSite of plantSites) {
      renderMarkerImageOnMap(context, plantSite);
    }
    for (const plantSiteUpload of plantSiteUploads) {
      renderMarkerOnMap(context, plantSiteUpload, '#00f');
    }
  }

  return (
    <div>
      <canvas
        className={windowSizeClass}
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      />
    </div>
  );
}
