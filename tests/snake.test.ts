import { Snake } from '../src/domain/Snake';

test('snake starts at given point', () => {
  const s = new Snake({ x: 5, y: 5 });
  expect(s.getHead()).toEqual({ x: 5, y: 5 });
});

test('snake moves forward', () => {
  const s = new Snake({ x: 5, y: 5 }, 'right');
  s.move();
  expect(s.getHead()).toEqual({ x: 6, y: 5 });
});

test('snake grows when eating', () => {
  const s = new Snake({ x: 0, y: 0 }, 'right');
  s.move(true); 
  expect(s.getBody().length).toBe(2);
});

test('snake cannot reverse direction', () => {
  const s = new Snake({ x: 0, y: 0 }, 'right');
  s.setDirection('left');
  s.move();
  expect(s.getDirection()).toBe('right'); 
});
