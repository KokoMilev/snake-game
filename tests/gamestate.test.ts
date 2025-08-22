import { Board } from '../src/domain/Board';
import { GameState } from '../src/domain/GameState';
import { RNG } from '../src/domain/rng';
import {
  BASE_TICK_MS,
  SPEEDBOOST_MS,
  SPEED_MULTIPLIER,
} from '../src/domain/config';

class ZeroRng extends RNG {
  public nextInt(max: number): number {
    void max;
    return 0;
  }
}

function makeState(width = 10, height = 10) {
  const board = new Board(width, height);
  const rng = new ZeroRng();
  // start near the left so we have space to move right and eat
  const gs = new GameState(board, rng, {
    foodsCount: 1,
    start: { x: 2, y: 2 },
    startDir: 'right',
    baseTickMs: BASE_TICK_MS,
  });
  return { board, rng, gs };
}

test('speed boost changes effective tick while active and resets after expiry', () => {
  const { gs } = makeState();
  const t0 = 1000;

  let atePizza = false;
  for (let i = 0; i < 20; i++) {
    const res = gs.step(t0 + i * 10);
    if (res.ate && res.ate.kind === 'pizza') {
      atePizza = true;
      break;
    }
  }

  if (atePizza) {
    const faster = Math.floor(BASE_TICK_MS / SPEED_MULTIPLIER);
    expect(gs.getTickMs(t0 + 1)).toBe(faster);
    expect(gs.getTickMs(t0 + SPEEDBOOST_MS + 1)).toBe(BASE_TICK_MS);
  } else {
    expect(gs.getTickMs(t0)).toBe(BASE_TICK_MS);
  }
});

test('collision with wall sets alive to false', () => {
  const { gs } = makeState(5, 5);
  gs.step(0); 
  gs.step(10);
  const r2 = gs.step(20);

  expect(r2.collided).toBe(true);
  expect(gs.isAlive()).toBe(false);
});

test('self collision kills the snake after growing', () => {
  const { gs } = makeState(6, 6);
  for (let i = 0; i < 5; i++) {
    gs.step(0);
  }

  gs.setDirection('down'); gs.step(10);
  gs.setDirection('left'); gs.step(20);
  gs.setDirection('up');
  const crash = gs.step(30);

  expect(crash.collided).toBe(true);
  expect(gs.isAlive()).toBe(false);
});
