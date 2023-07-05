import { useMapStore } from '../../store/map.store';

export const applyTransform = (
  context: CanvasRenderingContext2D,
  drawCallback: Function,
) => {
  context.save();

  applyPan(context);
  applyZoom(context);

  drawCallback();

  context.restore();
};

const applyZoom = (context: CanvasRenderingContext2D) => {
  const { x, y } = useMapStore.getState().pan;
  const zoom = useMapStore.getState().zoom;

  const { width, height } = useMapStore.getState().canvasDimensions;

  context.translate(width / 2, height / 2);
  context.scale(zoom, zoom);
  context.translate(-width / 2, -height / 2);
};

const applyPan = (context: CanvasRenderingContext2D) => {
  const zoom = useMapStore.getState().zoom;
  const { x, y } = useMapStore.getState().pan;
  context.translate(x, y);
};
