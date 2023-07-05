import { useMapStore } from '../../store/map.store';
import { AccelerationHandler } from './acceleration-handler.service';

export class ZoomGestureHandler {
  element: HTMLElement;
  eventCache: PointerEvent[] = [];
  cachedDistance: number = 0;
  zoomAccelerationHandler = new AccelerationHandler();
  zoomSensitivity = 300;
  private _zoom = 1;

  constructor(element: HTMLElement) {
    this.element = element;
    this.init();
  }

  update() {
    this.zoomAccelerationHandler.dampen();

    // Only apply acceleration when no pointers touching
    if (this.eventCache.length === 0) {
      this._zoom += this.zoomAccelerationHandler.acceleration;
    }
    this._zoom = Math.min(10, Math.max(this._zoom, 0.8));
    return this._zoom;
  }

  init() {
    this.element.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    this.element.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.element.addEventListener('pointerup', (e) => this.onPointerUp(e));
    this.element.addEventListener('pointerout', (e) => this.onPointerUp(e));
    this.element.addEventListener('pointerleave', (e) => this.onPointerUp(e));
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
