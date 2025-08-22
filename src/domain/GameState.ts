import { Board } from './Board';
import { Snake } from './Snake';
import { FoodManager } from './FoodManager';
import { EffectsManager } from './Effects';
import type { EffectType } from './Effects';
import { RNG } from './rng';
import type { Point, Dir, Food } from './types';
import {
  BASE_TICK_MS,
  SPEED_MULTIPLIER,
} from './config';

export interface StepResult {
  ate: Food | null;
  collided: boolean;
  expiredEffects: EffectType[];
  score: number;
}

export interface GameStateOptions {
  foodsCount?: number;
  start?: Point;
  startDir?: Dir;
  baseTickMs?: number;
}

export class GameState {
  private board: Board;
  private snake: Snake;
  private foodManager: FoodManager;
  private effects: EffectsManager;
  private rng: RNG;

  private score: number;
  private alive: boolean;
  private baseTickMs: number;

  constructor(
    board: Board,
    rng: RNG,
    options: GameStateOptions = {}
  ) {
    this.board = board;
    this.rng = rng;

    const startPoint: Point = options.start ?? { x: Math.floor(board.getWidth() / 2), y: Math.floor(board.getHeight() / 2) };
    const startDir: Dir = options.startDir ?? 'right';
    this.snake = new Snake(startPoint, startDir);

    const foodsCount = options.foodsCount ?? 1;
    this.foodManager = new FoodManager(foodsCount);

    this.effects = new EffectsManager();

    this.score = 0;
    this.alive = true;
    this.baseTickMs = options.baseTickMs ?? BASE_TICK_MS;

    this.ensureFoodSpawn();
  }

  public isAlive(): boolean {
    return this.alive;
  }

  public getScore(): number {
    return this.score;
  }

  public getSnakeBody(): Point[] {
    return this.snake.getBody();
  }

  public getFoods(): Food[] {
    return this.foodManager.getFoods();
  }

  public getTickMs(nowMs: number): number {
    const speedActive = this.effects.isActive('SpeedBoost', nowMs);
    if (speedActive) {
      return Math.floor(this.baseTickMs / SPEED_MULTIPLIER);
    }
    return this.baseTickMs;
  }

  public setDirection(dir: Dir): void {
    this.snake.setDirection(dir);
  }

  public reset(options: GameStateOptions = {}): void {
    const startPoint: Point = options.start ?? { x: Math.floor(this.board.getWidth() / 2), y: Math.floor(this.board.getHeight() / 2) };
    const startDir: Dir = options.startDir ?? 'right';
    this.snake = new Snake(startPoint, startDir);

    const foodsCount = options.foodsCount ?? 1;
    this.foodManager = new FoodManager(foodsCount);

    this.effects.clear();
    this.score = 0;
    this.alive = true;
    this.baseTickMs = options.baseTickMs ?? this.baseTickMs;

    this.ensureFoodSpawn();
  }

  public step(nowMs: number): StepResult {
    if (!this.alive) {
      return {
        ate: null,
        collided: true,
        expiredEffects: [],
        score: this.score,
      };
    }

    const currentHead = this.snake.getHead();
    const dir = this.snake.getDirection();
    const nextHead = this.computeNextPoint(currentHead, dir);

    if (!this.board.inBounds(nextHead)) {
      this.alive = false;
      return {
        ate: null,
        collided: true,
        expiredEffects: this.effects.purgeExpired(nowMs),
        score: this.score,
      };
    }

    if (this.snake.occupies(nextHead)) {
      this.alive = false;
      return {
        ate: null,
        collided: true,
        expiredEffects: this.effects.purgeExpired(nowMs),
        score: this.score,
      };
    }

    const eaten = this.foodManager.consumeAt(nextHead);
    const willGrow = eaten !== null;

    this.snake.move(willGrow);

    if (eaten) {
      this.applyFoodEffects(eaten, nowMs);
      this.score += eaten.value;
    }

    this.ensureFoodSpawn();

    const expired = this.effects.purgeExpired(nowMs);

    return {
      ate: eaten,
      collided: false,
      expiredEffects: expired,
      score: this.score,
    };
  }

  private computeNextPoint(p: Point, dir: Dir): Point {
    if (dir === 'up') return { x: p.x, y: p.y - 1 };
    if (dir === 'down') return { x: p.x, y: p.y + 1 };
    if (dir === 'left') return { x: p.x - 1, y: p.y };
    return { x: p.x + 1, y: p.y };
  }

  private applyFoodEffects(food: Food, nowMs: number): void {
    if (food.kind === 'cherry') {
      return;
    }
    if (food.kind === 'mushroom') {
      this.effects.applyDefault('InvertControls', nowMs);
      return;
    }
    if (food.kind === 'pizza') {
      this.effects.applyDefault('SpeedBoost', nowMs);
      return;
    }
  }

  private buildOccupiedKeys(): Set<string> {
    const set = new Set<string>();

    const body = this.snake.getBody();
    for (let i = 0; i < body.length; i++) {
      const k = this.board.key(body[i]);
      set.add(k);
    }

    const foods = this.foodManager.getFoods();
    for (let i = 0; i < foods.length; i++) {
      const k = this.board.key(foods[i].pos);
      set.add(k);
    }

    return set;
  }

  private ensureFoodSpawn(): void {
    const occupied = this.buildOccupiedKeys();
    this.foodManager.ensureSpawn(this.board, occupied, this.rng);
  }

  public isInvertActive(nowMs: number): boolean {
    return this.effects.isActive('InvertControls', nowMs);
  }

  public isSpeedActive(nowMs: number): boolean {
    return this.effects.isActive('SpeedBoost', nowMs);
  }
}
