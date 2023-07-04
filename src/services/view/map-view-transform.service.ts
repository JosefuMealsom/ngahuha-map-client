import { PanGestureHandler } from './pan-gesture-handler.service';
import { ZoomGestureHandler } from './zoom-gesture-handler.service';

export class MapViewTransform {
  context: CanvasRenderingContext2D;
  zoom: number = 1;
  panGestureHandler = new PanGestureHandler(document.body);
  zoomGestureHandler = new ZoomGestureHandler(document.body);
  canvasDimensions: { width: number; height: number };

  constructor(
    context: CanvasRenderingContext2D,
    canvasDimensions: { width: number; height: number },
  ) {
    this.context = context;
    this.canvasDimensions = canvasDimensions;
  }

  transform(drawCallback: Function) {
    this.context.save();

    this.applyPan();
    this.applyZoom();

    drawCallback();

    this.context.restore();
  }

  private applyZoom() {
    const { x, y } = this.panGestureHandler.pan;
    const zoom = this.zoomGestureHandler.zoom;
    this.context.translate(
      this.canvasDimensions.width / 2 - x,
      this.canvasDimensions.height / 2 - y,
    );
    this.context.scale(zoom, zoom);
    this.context.translate(
      -this.canvasDimensions.width / 2 + x,
      -this.canvasDimensions.height / 2 + y,
    );
  }

  private applyPan() {
    const { x, y } = this.panGestureHandler.pan;
    this.context.translate(x, y);
  }
}
