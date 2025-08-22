import type { Point, Dir } from './types';

export class Snake {
  private body: Point[];
  private direction: Dir;
  private pendingDirection: Dir | null;

  constructor(start: Point, startDir: Dir = 'right') {
    this.body = [start];       
    this.direction = startDir; 
    this.pendingDirection = null;
  }

  public getBody(): Point[] {
    return [...this.body];
  }

  public getHead(): Point {
    return this.body[0];
  }

  public getDirection(): Dir {
    return this.direction;
  }

  public setDirection(newDir: Dir): void {
    if (this.isOpposite(newDir, this.direction)) {
      return; // ignore illegal reverse
    }
    this.pendingDirection = newDir;
  }

  public move(grow: boolean = false): void {
    if (this.pendingDirection) {
      this.direction = this.pendingDirection;
      this.pendingDirection = null;
    }

    const head = this.getHead();
    const newHead = this.nextPoint(head, this.direction);

    this.body.unshift(newHead); // add new head

    if (!grow) {
      this.body.pop(); 
    }
  }

  // Check if a point is inside the snake’s body
  public occupies(point: Point): boolean {
    return this.body.some(p => p.x === point.x && p.y === point.y);
  }

  private isOpposite(d1: Dir, d2: Dir): boolean {
    return (
      (d1 === 'up' && d2 === 'down') ||
      (d1 === 'down' && d2 === 'up') ||
      (d1 === 'left' && d2 === 'right') ||
      (d1 === 'right' && d2 === 'left')
    );
  }

  private nextPoint(p: Point, dir: Dir): Point {
    switch (dir) {
      case 'up': return { x: p.x, y: p.y - 1 };
      case 'down': return { x: p.x, y: p.y + 1 };
      case 'left': return { x: p.x - 1, y: p.y };
      case 'right': return { x: p.x + 1, y: p.y };
    }
  }
}