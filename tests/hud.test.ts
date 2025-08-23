/** @jest-environment jsdom */

import { Hud } from '../src/ui/Hud';

function setupDom() {
  document.body.innerHTML = `
    <div id="hud">
      <div>Score: <span id="score">0</span></div>
      <button id="pause" type="button">Pause</button>
      <button id="restart" type="button">Restart</button>
    </div>
  `;
  const score = document.getElementById('score') as HTMLElement;
  const pause = document.getElementById('pause') as HTMLButtonElement;
  const restart = document.getElementById('restart') as HTMLButtonElement;
  return { score, pause, restart };
}

test('updateScore writes text content', () => {
  const { score, pause, restart } = setupDom();
  const hud = new Hud(score, pause, restart);

  hud.updateScore(123);
  expect(score.textContent).toBe('123');
});

test('setPausedUI toggles button label and aria-pressed', () => {
  const { score, pause, restart } = setupDom();
  const hud = new Hud(score, pause, restart);

  hud.setPausedUI(true);
  expect(pause.textContent).toBe('Resume');
  expect(pause.getAttribute('aria-pressed')).toBe('true');

  hud.setPausedUI(false);
  expect(pause.textContent).toBe('Pause');
  expect(pause.getAttribute('aria-pressed')).toBe('false');
});

test('onPauseClick and onRestartClick invoke callbacks', () => {
  const { score, pause, restart } = setupDom();
  const hud = new Hud(score, pause, restart);

  let paused = 0;
  let restarted = 0;

  hud.onPauseClick(() => { paused++; });
  hud.onRestartClick(() => { restarted++; });

  pause.click();
  restart.click();

  expect(paused).toBe(1);
  expect(restarted).toBe(1);
});

test('setEnabled disables/enables buttons', () => {
  const { score, pause, restart } = setupDom();
  const hud = new Hud(score, pause, restart);

  hud.setEnabled(false);
  expect(pause.disabled).toBe(true);
  expect(restart.disabled).toBe(true);

  hud.setEnabled(true);
  expect(pause.disabled).toBe(false);
  expect(restart.disabled).toBe(false);
});
