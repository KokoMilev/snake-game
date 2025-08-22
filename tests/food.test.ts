import { Board } from '../src/domain/Board';
import { FoodManager } from '../src/domain/FoodManager';
import { RNG } from '../src/domain/rng';

// A tiny fake RNG so tests are deterministic
class FakeRNG extends RNG {
  private values: number[];
  private i: number;

  constructor(values: number[]) {
    super();
    this.values = values;
    this.i = 0;
  }

  public nextInt(max: number): number {
    // Use provided sequence, wrap around if needed, clamp to range
    const v = this.values[this.i % this.values.length] % max;
    this.i++;
    return v;
  }
}

test('spawns one food not on the snake', () => {
  const board = new Board(5, 5);

  // snake occupies (0,0) and (1,0)
  const occupied = new Set<string>([
    board.key({ x: 0, y: 0 }),
    board.key({ x: 1, y: 0 }),
  ]);

  const fm = new FoodManager(1);
  const rng = new FakeRNG([0, 0, 0]); // predictable picks

  fm.ensureSpawn(board, occupied, rng);
  const foods = fm.getFoods();

  expect(foods.length).toBe(1);
  const f = foods[0];
  // It should NOT be in occupied cells
  expect(f.pos).not.toEqual({ x: 0, y: 0 });
  expect(f.pos).not.toEqual({ x: 1, y: 0 });
});

test('consumeAt removes and returns the food', () => {
  const board = new Board(3, 3);
  const occupied = new Set<string>();
  const fm = new FoodManager(1);
  const rng = new FakeRNG([0, 1, 2]);

  fm.ensureSpawn(board, occupied, rng);
  const before = fm.getFoods();
  expect(before.length).toBe(1);

  const pos = before[0].pos;
  const eaten = fm.consumeAt(pos);

  expect(eaten).not.toBeNull();
  expect(fm.getFoods().length).toBe(0);
});

test('ensureSpawn respects desiredCount', () => {
  const board = new Board(4, 4);
  const occupied = new Set<string>();
  const fm = new FoodManager(2); // want 2 foods present
  const rng = new FakeRNG([0, 1, 2, 3, 4, 5]);

  fm.ensureSpawn(board, occupied, rng);
  expect(fm.getFoods().length).toBe(2);
});
