/** @jest-environment jsdom */

import { InputController } from '../src/infra/InputController';

function press(code: string) {
  const ev = new KeyboardEvent('keydown', { code, bubbles: true });
  document.dispatchEvent(ev);
}

beforeEach(() => {
});

test('maps WASD to directions', () => {
  const ic = new InputController();
  ic.attach(document);

  press('KeyW');
  expect(ic.getAndClearDirection()).toBe('up');

  press('KeyA');
  expect(ic.getAndClearDirection()).toBe('left');

  press('KeyS');
  expect(ic.getAndClearDirection()).toBe('down');

  press('KeyD');
  expect(ic.getAndClearDirection()).toBe('right');

  ic.detach(document);
});

test('maps Arrow keys to directions', () => {
  const ic = new InputController();
  ic.attach(document);

  press('ArrowUp');
  expect(ic.getAndClearDirection()).toBe('up');

  press('ArrowLeft');
  expect(ic.getAndClearDirection()).toBe('left');

  press('ArrowDown');
  expect(ic.getAndClearDirection()).toBe('down');

  press('ArrowRight');
  expect(ic.getAndClearDirection()).toBe('right');

  ic.detach(document);
});

test('inverted controls swap up/down and left/right', () => {
  const ic = new InputController();
  ic.attach(document);
  ic.setInverted(true);

  press('KeyW'); // up -> down
  expect(ic.getAndClearDirection()).toBe('down');

  press('ArrowLeft'); // left -> right
  expect(ic.getAndClearDirection()).toBe('right');

  ic.detach(document);
});

test('space sets a one-shot pause request', () => {
  const ic = new InputController();
  ic.attach(document);

  press('Space');
  expect(ic.consumePauseRequest()).toBe(true);
  // Consumed -> no longer requested
  expect(ic.consumePauseRequest()).toBe(false);

  ic.detach(document);
});

test('pending direction is cleared after read', () => {
  const ic = new InputController();
  ic.attach(document);

  press('KeyD');
  expect(ic.getAndClearDirection()).toBe('right');
  // second read should be null
  expect(ic.getAndClearDirection()).toBeNull();

  ic.detach(document);
});
