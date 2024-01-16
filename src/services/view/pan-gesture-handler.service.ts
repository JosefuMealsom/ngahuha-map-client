import { useMapStore } from '../../store/map.store';
import { AccelerationHandler } from './acceleration-handler.service';

type PanBounds = {
  x: { min: number; max: number };
  y: { min: number; max: number };
};

export class PanGestureHandler {
  element: HTMLElement;
  eventCache: PointerEvent[] = [];
  private panXAccelerationHandler = new AccelerationHandler();
  private panYAccelerationHandler = new AccelerationHandler();
  panX: number;
  panY: number;
  bounds?: PanBounds;
  private cleanupListenerController = new AbortController();

  constructor(
    element: HTMLElement,
    panX: number,
    panY: number,
    bounds?: PanBounds,
  ) {
    this.element = element;
    this.panX = panX;
    this.panY = panY;
    this.bounds = bounds;
    this.init();
  }

  setPan(x: number, y: number) {
    this.eventCache = [];
    this.panX = x;
    this.panY = y;
  }

  update() {
    this.panXAccelerationHandler.dampen();
    this.panYAccelerationHandler.dampen();

    // Only apply acceleration when no pointers touching
    if (this.eventCache.length === 0) {
      this.panX += this.panXAccelerationHandler.acceleration;
      this.panY += this.panYAccelerationHandler.acceleration;
    }

    this.restrictToBounds();

    return { x: this.panX, y: this.panY };
  }

  private restrictToBounds() {
    if (!this.bounds) return;

    if (this.panX < this.bounds.x.min) this.panX = this.bounds.x.min;
    if (this.panX > this.bounds.x.max) this.panX = this.bounds.x.max;

    if (this.panY < this.bounds.y.min) this.panY = this.bounds.y.min;
    if (this.panY > this.bounds.y.max) this.panY = this.bounds.y.max;
  }

  private init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const { signal } = this.cleanupListenerController;

    this.element.addEventListener('pointerdown', (e) => this.onPointerDown(e), {
      signal: signal,
    });
    this.element.addEventListener('pointermove', (e) => this.onPointerMove(e), {
      signal: signal,
    });
    this.element.addEventListener('pointerup', (e) => this.onPointerUp(e), {
      signal: signal,
    });
    this.element.addEventListener('pointerout', (e) => this.onPointerUp(e), {
      signal: signal,
    });
    this.element.addEventListener('pointerleave', (e) => this.onPointerUp(e), {
      signal: signal,
    });
    window.addEventListener('focus', () => this.onWindowVisiblityChange(), {
      signal: signal,
    });
    window.addEventListener('blur', () => this.onWindowVisiblityChange(), {
      signal: signal,
    });
  }

  removeEventListeners() {
    this.cleanupListenerController.abort();
  }

  onWindowVisiblityChange() {
    this.eventCache = [];
  }

  private onPointerDown(pointerEvent: PointerEvent) {
    this.eventCache.push(pointerEvent);
  }

  private onPointerMove(pointerEvent: PointerEvent) {
    if (this.eventCache.length !== 1) return;

    const { x: newX, y: newY } = pointerEvent;
    const { x: oldX, y: oldY } = this.eventCache[0];
    const changeX = newX - oldX;
    const changeY = newY - oldY;

    const zoom = useMapStore.getState().zoom;

    this.panX += changeX / zoom;
    this.panY += changeY / zoom;
    this.panXAccelerationHandler.setForce(changeX / zoom);
    this.panYAccelerationHandler.setForce(changeY / zoom);

    this.eventCache[0] = pointerEvent;
  }

  onPointerUp(pointerEvent: PointerEvent) {
    if (this.eventCache.length > 1) {
      this.eventCache = [];
    } else {
      this.eventCache = this.eventCache.filter(
        (cachedEvent) => cachedEvent.pointerId !== pointerEvent.pointerId,
      );
    }
  }
}
