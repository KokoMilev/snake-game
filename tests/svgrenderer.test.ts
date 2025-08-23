/** @jest-environment jsdom */

import { SvgRenderer } from '../src/ui/SvgRenderer';
import { Board } from '../src/domain/Board';
import { Point, Food } from '../src/domain/types';

function createContainer(): HTMLElement {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

test('renderGrid draws lines', () => {
  const container = createContainer();
  const board = new Board(5, 4);
  const r = new SvgRenderer(container, board, 10);

  r.renderGrid(true);

  const lines = container.querySelectorAll('svg g[data-layer="grid"] line');
  expect(lines.length).toBeGreaterThan(0);
});

test('renderSnake draws one rect per segment', () => {
  const container = createContainer();
  const board = new Board(10, 10);
  const r = new SvgRenderer(container, board, 20);

  const body: Point[] = [
    { x: 2, y: 2 },
    { x: 1, y: 2 },
    { x: 0, y: 2 },
  ];
  r.renderSnake(body);

  const rects = container.querySelectorAll('svg g[data-layer="snake"] rect.snake-seg');
  expect(rects.length).toBe(3);
});

test('renderFoods draws one element per food', () => {
  const container = createContainer();
  const board = new Board(10, 10);
  const r = new SvgRenderer(container, board, 20);

  const foods: Food[] = [
    { kind: 'cherry', value: 100, pos: { x: 3, y: 3 } },
    { kind: 'mushroom', value: 350, pos: { x: 4, y: 3 } },
    { kind: 'pizza', value: 400, pos: { x: 5, y: 3 } },
  ];
  r.renderFoods(foods);

  const items = container.querySelectorAll('svg g[data-layer="foods"] g.food');
  expect(items.length).toBe(3);
});
