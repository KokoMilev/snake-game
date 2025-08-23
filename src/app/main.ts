import { GameEngine } from './GameEngine.ts';

function qs<T extends Element>(sel: string): T {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Missing ${sel} in DOM`);
  return el as T;
}

const engine = new GameEngine({
  containerEl: qs<HTMLElement>('#game'),
  scoreEl: qs<HTMLElement>('#score'),
  pauseBtn: qs<HTMLButtonElement>('#pause'),
  restartBtn: qs<HTMLButtonElement>('#restart'),
});

engine.start();

