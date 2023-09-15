import { useEffect, useRef, useState } from 'react';
import mapUrl from '../../assets/map.jpg';
import { loadImage } from '../../services/image-loader.service';
import { useAnimationFrame } from '../../hooks/use-animation-frame.hook';
import { applyTransform } from '../../services/view/map-view-transform.service';
import { useMapStore } from '../../store/map.store';
import { renderImageOnMap, renderPath } from '../../services/view/map-renderer';
import { usePathTracerStore } from '../../store/path-tracer.store';

export function PathCanvas(props: { onDownloadClick: () => any }) {
  const canvasDimensions = useMapStore((state) => state.canvasDimensions);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [windowSizeClass, setWindowSizeClass] = useState('');

  let mapImage: HTMLImageElement | null;

  useAnimationFrame(() => {
    drawMap(canvasRef?.current);
  }, []);

  function determineCanvasDomSize() {
    const canvasSizeClass =
      window.innerWidth < window.innerHeight ? 'h-full' : 'w-full';

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
      drawPaths(context);
    });
  }

  function drawMapImages(context: CanvasRenderingContext2D) {
    if (mapImage) {
      renderImageOnMap(context, mapImage);
    }
  }

  function drawPaths(context: CanvasRenderingContext2D) {
    const { path, savedPaths } = usePathTracerStore.getState();
    renderPath(context, path);

    for (const p of savedPaths) {
      renderPath(context, p.pathNodes, '#0f0');
    }
  }

  function downloadCanvasImage() {
    props.onDownloadClick();

    setTimeout(() => {
      let canvasUrl = canvasRef.current!.toDataURL();
      const createEl = document.createElement('a');
      createEl.href = canvasUrl;

      createEl.download = 'ngahuhamap-with-paths';
      createEl.click();
      createEl.remove();
    }, 200);
  }

  return (
    <div className="w-full h-full">
      <canvas
        className={windowSizeClass}
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      />
      <button
        className="fixed bg-sky-500 text-white
      font-semibold rounded-full py-2 px-4 bottom-10 right-5 text-sm hover:opacity-80"
        onClick={downloadCanvasImage}
      >
        Download canvas image
      </button>
    </div>
  );
}
