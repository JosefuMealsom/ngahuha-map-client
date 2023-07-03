export class PanGestureHandler {
  element: HTMLElement;
  cachedPointerEvent?: PointerEvent;

  constructor(element: HTMLElement) {
    this.element = element;
    this.init();
  }

  init() {
    this.element.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    this.element.addEventListener('pointermove', (e) => this.onPointerMove(e));
  }

  private onPointerDown(pointerEvent: PointerEvent) {
    this.cachedPointerEvent = pointerEvent;
  }

  private onPointerMove(pointerEvent: PointerEvent) {
    if (!this.cachedPointerEvent) return;
    if (pointerEvent.pointerId !== this.cachedPointerEvent.pointerId) return;

    const { x: newX, y: newY } = pointerEvent;
    const { x: oldX, y: oldY } = this.cachedPointerEvent;

    this.element.dispatchEvent(
      new CustomEvent('pan', {
        detail: {
          changeX: newX - oldX,
          changeY: newY - oldY,
        },
      }),
    );

    this.cachedPointerEvent = pointerEvent;
  }
}
