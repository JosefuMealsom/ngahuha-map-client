import { AccelerationHandler } from './acceleration-handler.service';

export class ZoomGestureHandler {
  element: HTMLElement;
  eventCache: PointerEvent[] = [];
  cachedDistance: number = 0;
  zoomAccelerationHandler = new AccelerationHandler();
  zoomSensitivity = 300;
  private _zoom: number;
  private cleanupListenerController = new AbortController();

  constructor(element: HTMLElement, initialZoom: number) {
    this.element = element;
    this._zoom = initialZoom;
    this.init();
  }

  update() {
    this.zoomAccelerationHandler.dampen();

    // Only apply acceleration when no pointers touching
    if (this.eventCache.length === 0) {
      this._zoom += this.zoomAccelerationHandler.acceleration;
    }
    this._zoom = Math.min(10, Math.max(this._zoom, 0.5));
    return this._zoom;
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
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
    this.element.addEventListener('wheel', (e) => this.onWheel(e), {
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

  private onWheel(wheelEvent: WheelEvent) {
    wheelEvent.preventDefault();
    this.zoomAccelerationHandler.setForce(wheelEvent.deltaY / 100);
  }

  private onPointerDown(pointerEvent: PointerEvent) {
    this.eventCache.push(pointerEvent);
    if (this.eventCache.length === 2) {
      const [pointer1, pointer2] = this.eventCache;

      this.cachedDistance = Math.hypot(
        pointer1.x - pointer2.x,
        pointer1.y - pointer2.y,
      );
    }
  }

  private onPointerMove(pointerEvent: PointerEvent) {
    const index = this.eventCache.findIndex(
      (cachedEvent) => cachedEvent.pointerId === pointerEvent.pointerId,
    );

    this.eventCache[index] = pointerEvent;

    if (this.eventCache.length !== 2) return;

    const diff = this.calculateDistanceChange() / this.zoomSensitivity;
    this._zoom += diff;
    this.zoomAccelerationHandler.setForce(diff);
  }

  private calculateDistanceChange() {
    const [pointer1, pointer2] = this.eventCache;

    const distance = Math.hypot(
      pointer1.x - pointer2.x,
      pointer1.y - pointer2.y,
    );
    const change = distance - this.cachedDistance;
    this.cachedDistance = distance;

    return change;
  }

  private onPointerUp(eventToBeRemoved: PointerEvent) {
    this.cachedDistance = 0;

    this.eventCache = this.eventCache.filter(
      (cachedEvent) => cachedEvent.pointerId !== eventToBeRemoved.pointerId,
    );
  }
}
