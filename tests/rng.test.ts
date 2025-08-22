import { RNG } from '../src/domain/rng';

test('nextInt returns values in range', () => {
  const rng = new RNG();
  for (let i = 0; i < 100; i++) {
    const val = rng.nextInt(5);
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThan(5);
  }
});

test('shuffle keeps all items', () => {
  const rng = new RNG();
  const arr = [1, 2, 3, 4];
  const shuffled = rng.shuffle([...arr]);
  expect(shuffled.sort()).toEqual(arr);
});
