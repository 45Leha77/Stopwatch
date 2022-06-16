interface CountState {
  sec: number;
  min: number;
}

export class State implements CountState {
  constructor(public sec: number, public min: number) {
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
}
