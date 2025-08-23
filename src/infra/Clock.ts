export type TickHandler = (nowMs: number) => void;

export class Clock {
  private intervalId: number | null;
  private intervalMs: number;
  private handler: TickHandler | null;
  private paused: boolean;

  constructor(intervalMs: number = 200) {
    this.intervalId = null;
    this.intervalMs = intervalMs;
    this.handler = null;
    this.paused = false;
  }

  public start(handler: TickHandler): void {
    this.stop(); // in case it was already running
    this.handler = handler;
    this.paused = false;
    this.intervalId = window.setInterval(() => {
      if (!this.paused && this.handler) {
        this.handler(Date.now());
      }
    }, this.intervalMs);
  }

  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.handler = null;
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
  }

  public isPaused(): boolean {
    return this.paused;
  }

  public setIntervalMs(ms: number): void {
    this.intervalMs = ms;

    if (this.handler) {
      const currentHandler = this.handler;
      this.start(currentHandler);
    }
  }

  public getIntervalMs(): number {
    return this.intervalMs;
  }
}
