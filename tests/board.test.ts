import { Board } from '../src/domain/Board';

test('inBounds works for valid points', () => {
  const board = new Board(10, 10);

  expect(board.inBounds({ x: 0, y: 0 })).toBe(true);   // top-left
  expect(board.inBounds({ x: 9, y: 9 })).toBe(true);   // bottom-right
});

test('inBounds returns false for out-of-bounds points', () => {
  const board = new Board(10, 10);

  expect(board.inBounds({ x: -1, y: 5 })).toBe(false);
  expect(board.inBounds({ x: 10, y: 5 })).toBe(false);
  expect(board.inBounds({ x: 5, y: -1 })).toBe(false);
  expect(board.inBounds({ x: 5, y: 10 })).toBe(false);
});

test('key and fromKey work consistently', () => {
  const board = new Board(10, 10);

  const p = { x: 3, y: 7 };
  const key = board.key(p);
  const back = board.fromKey(key);

  expect(key).toBe('3,7');
  expect(back).toEqual(p);
});
