import { Board } from '../domain/Board';
import { GameState } from '../domain/GameState';
import { RNG } from '../domain/rng';
import { InputController } from '../infra/InputController';
import { Clock } from '../infra/Clock';
import { SvgRenderer } from '../ui/SvgRenderer';
import { Hud } from '../ui/Hud';
import { CELL_SIZE, COLS, ROWS } from '../domain/config';

export class GameEngine {
  private board: Board;
  private rng: RNG;

  private state: GameState;
  private input: InputController;
  private clock: Clock;
  private renderer: SvgRenderer;
  private hud: Hud;

  private paused: boolean;

  constructor(params: {
    containerEl: HTMLElement;
    scoreEl: HTMLElement;
    pauseBtn: HTMLButtonElement;
    restartBtn: HTMLButtonElement;
  }) {
    // Core
    this.board = new Board(COLS, ROWS);
    this.rng = new RNG();
    this.state = new GameState(this.board, this.rng, {
      foodsCount: 1,
    });

    this.input = new InputController();
    this.clock = new Clock(); 
    this.renderer = new SvgRenderer(params.containerEl, this.board, CELL_SIZE);
    this.hud = new Hud(params.scoreEl, params.pauseBtn, params.restartBtn);

    this.paused = false;

    // Initial UI
    this.renderer.renderGrid(true);
    this.renderer.renderSnake(this.state.getSnakeBody());
    this.renderer.renderFoods(this.state.getFoods());
    this.hud.updateScore(this.state.getScore());
    this.hud.setPausedUI(false);

    // Wire HUD buttons
    this.hud.onPauseClick(() => this.togglePause());
    this.hud.onRestartClick(() => this.restart());
  }

  public start(): void {
    this.input.attach(document);
    this.clock.start((nowMs) => this.onTick(nowMs));
  }

  public stop(): void {
    this.clock.stop();
    this.input.detach(document);
  }

  public isPaused(): boolean {
    return this.paused;
  }

  public togglePause(): void {
    this.paused = !this.paused;
    if (this.paused) {
      this.clock.pause();
    } else {
      this.clock.resume();
    }
    this.hud.setPausedUI(this.paused);
  }

  public restart(): void {
    this.renderer.clear();

    this.state.reset({ foodsCount: 1 });

    // Redraw
    this.renderer.renderGrid(true);
    this.renderer.renderSnake(this.state.getSnakeBody());
    this.renderer.renderFoods(this.state.getFoods());
    this.hud.updateScore(this.state.getScore());

    // Ensure running
    this.paused = false;
    this.hud.setPausedUI(false);
    this.clock.resume();
  }

  private onTick(nowMs: number): void {
    // 1) Handle input (direction + pause)
    const dir = this.input.getAndClearDirection();
    if (dir) {
      this.state.setDirection(dir);
    }
    if (this.input.consumePauseRequest()) {
      this.togglePause();
      if (this.paused) return;
    }

    // 2) Sync effects to IO (invert + speed)
    const invertActive = this.state.isInvertActive(nowMs);
    this.input.setInverted(invertActive);

    const desiredTick = this.state.getTickMs(nowMs);
    if (this.clock.getIntervalMs() !== desiredTick) {
      this.clock.setIntervalMs(desiredTick);
    }

    // 3) Advance simulation
    const result = this.state.step(nowMs);

    // 4) Render
    this.renderer.renderSnake(this.state.getSnakeBody());
    this.renderer.renderFoods(this.state.getFoods());

    // 5) HUD updates
    if (result.ate) {
      this.hud.updateScore(result.score);
    }

    // 6) Game over
    if (result.collided || !this.state.isAlive()) {
      this.clock.pause();
      this.paused = true;
      this.hud.setPausedUI(true);
      // (Optionally: flash/animation could be added here)
    }
  }
}
