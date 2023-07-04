export class AccelerationHandler {
  acceleration: number = 0;

  dampen() {
    this.acceleration *= 0.95;
  }

  setForce(value: number) {
    this.acceleration = value;
  }
}
