export type Dir = 'up' | 'down' | 'left' | 'right';

export interface Point {
  x: number;
  y: number;
}

export type FoodKind = 'cherry' | 'mushroom' | 'pizza';

export interface Food {
  kind: FoodKind;
  value: number;
  pos: Point;
}