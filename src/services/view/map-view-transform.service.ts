import { PanGestureHandler } from './pan-gesture-handler.service';
import { PinchGestureHandler } from './pinch-gesture-handler.service';

export class MapViewTransform {
  context: CanvasRenderingContext2D;
  zoom: number = 1;
  panX: number = 0;
  panY: number = 0;
  canvasDimensions: { width: number; height: number };

  private zoomSensitivity: number = 500;

  constructor(
    context: CanvasRenderingContext2D,
    canvasDimensions: { width: number; height: number },
  ) {
    this.context = context;
    this.canvasDimensions = canvasDimensions;
    this.init();
  }

  transform(drawCallback: Function) {
    this.context.save();
    this.applyPan();
    this.applyZoom();

    drawCallback();

    this.context.restore();
  }

  private init() {
    this.addGestureEvents();
  }

  private addGestureEvents() {
    const pinchHandler = new PinchGestureHandler(document.body);
    document.body.addEventListener('pinch', (e) => {
      this.zoom = Math.max(
        this.zoom + e.detail.distance / this.zoomSensitivity,
        1,
      );
    });

    const panHandler = new PanGestureHandler(document.body);
    document.body.addEventListener('pan', (e) => {
      this.panX += e.detail.changeX;
      this.panY += e.detail.changeY;
    });
  }

  private applyZoom() {
    this.context.translate(
      this.canvasDimensions.width / 2,
      this.canvasDimensions.height / 2,
    );
    this.context.scale(this.zoom, this.zoom);
    this.context.translate(
      -this.canvasDimensions.width / 2,
      -this.canvasDimensions.height / 2,
    );
  }

  private applyPan() {
    this.context.translate(this.panX, this.panY);
  }
}
