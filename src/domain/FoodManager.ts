import { Board } from './Board';
import type { Point } from './types';
import { makeFood, kindFromIndex } from './food';
import { RNG } from './rng';

export class FoodManager {
  private foods: ReturnType<typeof makeFood>[];
  private desiredCount: number;

  constructor(desiredCount: number = 1) {
    this.foods = [];
    this.desiredCount = desiredCount;
  }

  public getFoods() {
    return [...this.foods];
  }

  public clear(): void {
    this.foods = [];
  }

  public ensureSpawn(board: Board, occupiedKeys: Set<string>, rng: RNG): void {
    while (this.foods.length < this.desiredCount) {
      const spawned = this.spawnOne(board, occupiedKeys, rng);
      if (!spawned) break;
      this.foods.push(spawned);
      occupiedKeys.add(board.key(spawned.pos));
    }
  }

  public consumeAt(point: Point): ReturnType<typeof makeFood> | null {
    for (let i = 0; i < this.foods.length; i++) {
      const f = this.foods[i];
      if (f.pos.x === point.x && f.pos.y === point.y) {
        this.foods.splice(i, 1); // remove
        return f;
      }
    }
    return null;
  }

  private spawnOne(
    board: Board,
    occupiedKeys: Set<string>,
    rng: RNG
  ): ReturnType<typeof makeFood> | null {
    const freeCells: Point[] = [];
    for (let y = 0; y < board.getHeight(); y++) {
      for (let x = 0; x < board.getWidth(); x++) {
        const p = { x, y };
        const k = board.key(p);
        if (!occupiedKeys.has(k)) {
          freeCells.push(p);
        }
      }
    }

    if (freeCells.length === 0) {
      return null;
    }

    const index = rng.nextInt(freeCells.length);
    const pos = freeCells[index];

    const kindIndex = rng.nextInt(3); // 0 cherry, 1 mushroom, 2 pizza
    const kind = kindFromIndex(kindIndex);

    return makeFood(kind, pos);
  }
}
