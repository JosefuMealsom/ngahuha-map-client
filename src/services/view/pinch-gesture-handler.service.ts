export class PinchGestureHandler {
  element: HTMLElement;
  eventCache: PointerEvent[] = [];
  cachedDistance: number = 0;

  constructor(element: HTMLElement) {
    this.element = element;
    this.init();
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

    this.element.dispatchEvent(
      new CustomEvent('pinch', {
        detail: {
          count: this.eventCache.length,
          distance: this.calculateDistanceChange(),
        },
      }),
    );
  }

  private calculateDistanceChange() {
    if (this.eventCache.length !== 2) return;
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
