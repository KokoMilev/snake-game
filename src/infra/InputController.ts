import type { Dir } from '../domain/types';

export class InputController {
  private inverted: boolean;
  private pendingDir: Dir | null;
  private pauseRequested: boolean;
  private keyHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.inverted = false;
    this.pendingDir = null;
    this.pauseRequested = false;

    this.keyHandler = (e: KeyboardEvent) => {
      const code = e.code; 
      if (code === 'Space') {
        // toggle pause request
        this.pauseRequested = true;
        e.preventDefault();
        return;
      }

      const dir = this.mapKeyToDir(code);
      if (dir !== null) {
        const effective = this.inverted ? this.invert(dir) : dir;
        this.pendingDir = effective;
        e.preventDefault();
      }
    };
  }

  public attach(target: Window | Document = window): void {
    target.addEventListener('keydown', this.keyHandler as EventListener);
  }

  public detach(target: Window | Document = window): void {
    target.removeEventListener('keydown', this.keyHandler as EventListener);
  }

  public getAndClearDirection(): Dir | null {
    const d = this.pendingDir;
    this.pendingDir = null;
    return d;
  }

  public consumePauseRequest(): boolean {
    const v = this.pauseRequested;
    this.pauseRequested = false;
    return v;
  }

  public setInverted(value: boolean): void {
    this.inverted = value;
  }

  public isInverted(): boolean {
    return this.inverted;
  }

  private mapKeyToDir(code: string): Dir | null {
    // WASD
    if (code === 'KeyW') return 'up';
    if (code === 'KeyA') return 'left';
    if (code === 'KeyS') return 'down';
    if (code === 'KeyD') return 'right';
    // Arrows
    if (code === 'ArrowUp') return 'up';
    if (code === 'ArrowLeft') return 'left';
    if (code === 'ArrowDown') return 'down';
    if (code === 'ArrowRight') return 'right';
    return null;
  }

  private invert(dir: Dir): Dir {
    if (dir === 'up') return 'down';
    if (dir === 'down') return 'up';
    if (dir === 'left') return 'right';
    return 'left'; 
  }
}
