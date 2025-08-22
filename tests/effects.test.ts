import { EffectsManager } from '../src/domain/Effects';
import { INVERT_MS, SPEEDBOOST_MS } from '../src/domain/config';

test('apply and isActive for invert controls', () => {
  const eff = new EffectsManager();
  const t0 = 1000;

  eff.applyDefault('InvertControls', t0);
  expect(eff.isActive('InvertControls', t0)).toBe(true);
  expect(eff.isActive('InvertControls', t0 + INVERT_MS - 1)).toBe(true);
  expect(eff.isActive('InvertControls', t0 + INVERT_MS)).toBe(false);
});

test('apply and isActive for speed boost', () => {
  const eff = new EffectsManager();
  const t0 = 5000;

  eff.applyDefault('SpeedBoost', t0);
  expect(eff.isActive('SpeedBoost', t0)).toBe(true);
  expect(eff.isActive('SpeedBoost', t0 + SPEEDBOOST_MS - 1)).toBe(true);
  expect(eff.isActive('SpeedBoost', t0 + SPEEDBOOST_MS)).toBe(false);
});

test('purgeExpired returns expired effects', () => {
  const eff = new EffectsManager();
  const t0 = 10000;

  eff.applyDefault('InvertControls', t0);
  const tExpire = t0 + INVERT_MS;

  expect(eff.purgeExpired(tExpire - 1)).toEqual([]);
  expect(eff.purgeExpired(tExpire)).toEqual(['InvertControls']);
  expect(eff.isActive('InvertControls', tExpire)).toBe(false);
});

test('re-applying extends effect, not shortens', () => {
  const eff = new EffectsManager();
  const t0 = 0;

  eff.applyDefault('SpeedBoost', t0);
  const mid = t0 + Math.floor(SPEEDBOOST_MS / 2);
  eff.applyDefault('SpeedBoost', mid);

  const newEnd = mid + SPEEDBOOST_MS;
  expect(eff.isActive('SpeedBoost', newEnd - 1)).toBe(true);
  expect(eff.isActive('SpeedBoost', newEnd)).toBe(false);
});
