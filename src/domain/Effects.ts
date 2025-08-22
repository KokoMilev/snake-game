import { INVERT_MS, SPEEDBOOST_MS } from './config';

export type EffectType = 'InvertControls' | 'SpeedBoost';

export class EffectsManager {
  private active: Map<EffectType, number>; // effect -> endsAt

  constructor() {
    this.active = new Map<EffectType, number>();
  }

  public clear(): void {
    this.active.clear();
  }

  public apply(effect: EffectType, nowMs: number, durationMs: number): void {
    const current = this.active.get(effect) ?? 0;
    const proposed = nowMs + durationMs;
    const newUntil = Math.max(current, proposed);
    this.active.set(effect, newUntil);
  }

  public applyDefault(effect: EffectType, nowMs: number): void {
    if (effect === 'InvertControls') {
      this.apply('InvertControls', nowMs, INVERT_MS);
      return;
    }
    this.apply('SpeedBoost', nowMs, SPEEDBOOST_MS);
  }

  public isActive(effect: EffectType, nowMs: number): boolean {
    const until = this.active.get(effect);
    if (until === undefined) return false;
    return nowMs < until;
  }

  public getRemainingMs(effect: EffectType, nowMs: number): number {
    const until = this.active.get(effect);
    if (until === undefined) return 0;
    const remaining = until - nowMs;
    return remaining > 0 ? remaining : 0;
  }

  public purgeExpired(nowMs: number): EffectType[] {
    const expired: EffectType[] = [];
    for (const [eff, until] of this.active.entries()) {
      if (nowMs >= until) {
        expired.push(eff);
        this.active.delete(eff);
      }
    }
    return expired;
  }

  public anyActive(nowMs: number): boolean {
    for (const until of this.active.values()) {
      if (nowMs < until) return true;
    }
    return false;
  }
}
