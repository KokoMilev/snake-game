export class Hud {
  private scoreEl: HTMLElement;
  private pauseBtn: HTMLButtonElement;
  private restartBtn: HTMLButtonElement;

  private onPauseCb: (() => void) | null = null;
  private onRestartCb: (() => void) | null = null;

  constructor(scoreEl: HTMLElement, pauseBtn: HTMLButtonElement, restartBtn: HTMLButtonElement) {
    this.scoreEl = scoreEl;
    this.pauseBtn = pauseBtn;
    this.restartBtn = restartBtn;

    this.pauseBtn.addEventListener('click', () => {
      if (this.onPauseCb) this.onPauseCb();
    });

    this.restartBtn.addEventListener('click', () => {
      if (this.onRestartCb) this.onRestartCb();
    });
  }

  public updateScore(score: number): void {
    this.scoreEl.textContent = String(score);
  }

  public onPauseClick(cb: () => void): void {
    this.onPauseCb = cb;
  }

  public onRestartClick(cb: () => void): void {
    this.onRestartCb = cb;
  }

  public setPausedUI(paused: boolean): void {
    this.pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    this.pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
  }

  public setEnabled(enabled: boolean): void {
    this.pauseBtn.disabled = !enabled;
    this.restartBtn.disabled = !enabled;
  }
}
 