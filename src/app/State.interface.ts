export class State {
  constructor(private sec: number, private min: number) {
    this.min = min;
    this.sec = sec;
  }

  getSecAsDate() {
    return new Date(this.sec * 1000);
  }

  setZero() {
    this.sec = 0;
    this.min = 0;
  }

  addOneSec() {
    return this.sec++;
  }
}
