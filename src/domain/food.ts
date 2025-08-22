import type { Food, FoodKind, Point } from './types';

export const CHERRY_VALUE = 100;
export const MUSHROOM_VALUE = 350;
export const PIZZA_VALUE = 400;

export function makeFood(kind: FoodKind, pos: Point): Food {
  if (kind === 'cherry') {
    return { kind: 'cherry', value: CHERRY_VALUE, pos };
  }
  if (kind === 'mushroom') {
    return { kind: 'mushroom', value: MUSHROOM_VALUE, pos };
  }
  return { kind: 'pizza', value: PIZZA_VALUE, pos };
}

export function kindFromIndex(index: number): FoodKind {
  if (index === 0) return 'cherry';
  if (index === 1) return 'mushroom';
  return 'pizza';
}
