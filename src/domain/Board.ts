import type { Point } from './types';

export class Board {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public inBounds(point: Point): boolean {
    if (point.x < 0 || point.y < 0 ||
        point.x >= this.width || point.y >= this.height) {
            return false;
        }
    return true;
  }

  // Serialize
  public key(point: Point): string {
    return `${point.x},${point.y}`;
  }

  // Deserialize
  public fromKey(key: string): Point {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }
}
