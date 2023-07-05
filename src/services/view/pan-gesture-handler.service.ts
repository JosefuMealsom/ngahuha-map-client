import { useMapStore } from '../../store/map.store';
import { AccelerationHandler } from './acceleration-handler.service';

export class PanGestureHandler {
  element: HTMLElement;
  eventCache: PointerEvent[] = [];
  private panXAccelerationHandler = new AccelerationHandler();
  private panYAccelerationHandler = new AccelerationHandler();
  private panX = 0;
  private panY = 0;

  constructor(element: HTMLElement) {
    this.element = element;
    this.init();
  }

  update() {
    this.panXAccelerationHandler.dampen();
    this.panYAccelerationHandler.dampen();

    // Only apply acceleration when no pointers touching
    if (this.eventCache.length === 0) {
      this.panX += this.panXAccelerationHandler.acceleration;
      this.panY += this.panYAccelerationHandler.acceleration;
    }
    return { x: this.panX, y: this.panY };
  }

  private init() {
    this.element.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    this.element.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.element.addEventListener('pointerup', (e) => this.onPointerUp(e));
    this.element.addEventListener('pointerout', (e) => this.onPointerUp(e));
    this.element.addEventListener('pointerleave', (e) => this.onPointerUp(e));
    window.addEventListener('focus', () => this.onWindowVisiblityChange());
    window.addEventListener('blur', () => this.onWindowVisiblityChange());
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

    this.panX += changeX;
    this.panY += changeY;
    this.panXAccelerationHandler.setForce(changeX);
    this.panYAccelerationHandler.setForce(changeY);

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
