/** @jest-environment jsdom */

import { Clock } from '../src/infra/Clock';

jest.useFakeTimers();

test('calls handler repeatedly at interval', () => {
  const c = new Clock(100);
  const calls: number[] = [];

  c.start((now) => calls.push(now));

  jest.advanceTimersByTime(350);
  c.stop();

  expect(calls.length).toBeGreaterThanOrEqual(3);
});

test('pause prevents handler firing', () => {
  const c = new Clock(100);
  let count = 0;

  c.start(() => count++);
  jest.advanceTimersByTime(100);
  expect(count).toBeGreaterThan(0);

  c.pause();
  const before = count;
  jest.advanceTimersByTime(500);

  expect(count).toBe(before);

  c.resume();
  jest.advanceTimersByTime(200);

  expect(count).toBeGreaterThan(before);

  c.stop();
});

test('setIntervalMs restarts with new interval', () => {
  const c = new Clock(200);
  let count = 0;

  c.start(() => count++);
  jest.advanceTimersByTime(400);
  expect(count).toBeGreaterThanOrEqual(2);

  c.setIntervalMs(50);
  jest.advanceTimersByTime(200);
  expect(count).toBeGreaterThan(2);

  c.stop();
});
