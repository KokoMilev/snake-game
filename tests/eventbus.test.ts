import { EventBus } from '../src/infra/EventBus';

test('on + emit calls the handler', () => {
  const bus = new EventBus();
  let called = 0;

  bus.on('score', (v: number) => { called += v; });
  bus.emit('score', 5);

  expect(called).toBe(5);
});

test('off removes the handler', () => {
  const bus = new EventBus();
  let called = 0;
  const handler = (v: number) => { called += v; };

  bus.on('score', handler);
  bus.off('score', handler);
  bus.emit('score', 5);

  expect(called).toBe(0);
});

test('once only fires a single time', () => {
  const bus = new EventBus();
  let count = 0;

  bus.once('tick', () => { count++; });
  bus.emit('tick');
  bus.emit('tick');
  bus.emit('tick');

  expect(count).toBe(1);
});

test('unsubscribe function returned by on() works', () => {
  const bus = new EventBus();
  let count = 0;
  const off = bus.on('evt', () => { count++; });

  bus.emit('evt');
  off();          // unsubscribe
  bus.emit('evt');

  expect(count).toBe(1);
});

test('emit with no listeners does not throw', () => {
  const bus = new EventBus();
  expect(() => bus.emit('nope', { a: 1 })).not.toThrow();
});

test('clear removes all handlers', () => {
  const bus = new EventBus();
  let a = 0;
  let b = 0;

  bus.on('A', () => { a++; });
  bus.on('B', () => { b++; });
  bus.clear();

  bus.emit('A');
  bus.emit('B');

  expect(a).toBe(0);
  expect(b).toBe(0);
});
