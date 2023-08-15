import { AccelerationHandler } from './acceleration-handler.service';

export class PanGestureHandler {
  element: HTMLElement;
  eventCache: PointerEvent[] = [];
  private panXAccelerationHandler = new AccelerationHandler();
  private panYAccelerationHandler = new AccelerationHandler();
  private panX: number;
  private panY: number;
  private cleanupListenerController = new AbortController();

  constructor(element: HTMLElement, panX: number, panY: number) {
    this.element = element;
    this.panX = panX;
    this.panY = panY;
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
