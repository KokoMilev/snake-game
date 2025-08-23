import * as d3 from 'd3';
import { Board } from '../domain/Board';
import type { Point, Food } from '../domain/types';

/**
 * SvgRenderer
 * - Creates a single <svg> inside the provided container.
 * - Renders a grid (optional), the snake as <rect> cells, and foods as <g> icons.
 * - Uses D3 data-join so updates are efficient and animatable.
 */
export class SvgRenderer {
  private containerEl: HTMLElement;
  private board: Board;
  private cellSize: number;

  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private gridLayer: d3.Selection<SVGGElement, unknown, null, undefined>;
  private snakeLayer: d3.Selection<SVGGElement, unknown, null, undefined>;
  private foodLayer: d3.Selection<SVGGElement, unknown, null, undefined>;

  private widthPx: number;
  private heightPx: number;

  constructor(containerEl: HTMLElement, board: Board, cellSize: number) {
    this.containerEl = containerEl;
    this.board = board;
    this.cellSize = cellSize;

    this.widthPx = this.board.getWidth() * this.cellSize;
    this.heightPx = this.board.getHeight() * this.cellSize;

    // Create SVG root
    this.svg = d3
      .select<HTMLElement, unknown>(this.containerEl)
      .append('svg')
      .attr('width', this.widthPx)
      .attr('height', this.heightPx)
      .attr('viewBox', `0 0 ${this.widthPx} ${this.heightPx}`)
      .attr('role', 'img')
      .attr('aria-label', 'Snake game board')
      .style('border', '1px solid #ccc')
      .style('background', '#fafafa');

    // Create layers (grid below everything, then foods, then snake on top)
    this.gridLayer = this.svg.append('g').attr('data-layer', 'grid');
    this.foodLayer = this.svg.append('g').attr('data-layer', 'foods');
    this.snakeLayer = this.svg.append('g').attr('data-layer', 'snake');
  }

  /** Optional cosmetic grid, helpful for debugging and clarity */
  public renderGrid(show: boolean = true): void {
    this.gridLayer.selectAll('*').remove();
    if (!show) return;

    const cols = this.board.getWidth();
    const rows = this.board.getHeight();

    // Vertical lines
    for (let x = 0; x <= cols; x++) {
      const xPx = x * this.cellSize;
      this.gridLayer
        .append('line')
        .attr('x1', xPx)
        .attr('y1', 0)
        .attr('x2', xPx)
        .attr('y2', this.heightPx)
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1);
    }

    // Horizontal lines
    for (let y = 0; y <= rows; y++) {
      const yPx = y * this.cellSize;
      this.gridLayer
        .append('line')
        .attr('x1', 0)
        .attr('y1', yPx)
        .attr('x2', this.widthPx)
        .attr('y2', yPx)
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1);
    }
  }

  /** Draw or update the snake body cells */
  public renderSnake(points: Point[]): void {
    // Use "x,y" as a stable key
    const keyFn = (d: Point) => `${d.x},${d.y}`;

    const sel = this.snakeLayer
      .selectAll<SVGRectElement, Point>('rect.snake-seg')
      .data(points, keyFn as any);

    // EXIT: remove old segments
    sel.exit().remove();

    // ENTER: create new segments
    const enter = sel
      .enter()
      .append('rect')
      .attr('class', 'snake-seg')
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('x', (d) => d.x * this.cellSize)
      .attr('y', (d) => d.y * this.cellSize)
      .attr('opacity', 0);

    // ENTER + UPDATE: position with a small transition
    enter
      .merge(sel as any)
      .transition()
      .duration(80)
      .attr('x', (d) => d.x * this.cellSize)
      .attr('y', (d) => d.y * this.cellSize)
      .attr('opacity', 1);
  }

  /** Draw or update food icons */
  public renderFoods(foods: Food[]): void {
    const keyFn = (f: Food) => `${f.pos.x},${f.pos.y}`;

    const sel = this.foodLayer
      .selectAll<SVGGElement, Food>('g.food')
      .data(foods, keyFn as any);

    // EXIT old foods
    sel
      .exit()
      .transition()
      .duration(80)
      .attr('opacity', 0)
      .remove();

    // ENTER new foods
    const enter = sel
      .enter()
      .append('g')
      .attr('class', 'food')
      .attr(
        'transform',
        (d) => `translate(${d.pos.x * this.cellSize}, ${d.pos.y * this.cellSize})`
      )
      .attr('opacity', 0);

    // Draw a simple shape per kind (kept readable and distinct)
    enter.each((d, i, nodes) => {
      const g = d3.select(nodes[i]);
      const cx = this.cellSize / 2;
      const cy = this.cellSize / 2;
      const r = Math.max(2, this.cellSize * 0.35);

      if (d.kind === 'cherry') {
        // Circle
        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', r);
      } else if (d.kind === 'mushroom') {
        // Triangle (polygon)
        const top = `${cx},${cy - r}`;
        const left = `${cx - r},${cy + r}`;
        const right = `${cx + r},${cy + r}`;
        g.append('polygon').attr('points', `${top} ${left} ${right}`);
      } else {
        // pizza -> square/diamond
        g.append('rect')
          .attr('x', cx - r * 0.9)
          .attr('y', cy - r * 0.9)
          .attr('width', r * 1.8)
          .attr('height', r * 1.8)
          .attr('transform', `rotate(45, ${cx}, ${cy})`);
      }
    });

    // ENTER + UPDATE: position + fade-in
    enter
      .merge(sel as any)
      .transition()
      .duration(120)
      .attr(
        'transform',
        (d) => `translate(${d.pos.x * this.cellSize}, ${d.pos.y * this.cellSize})`
      )
      .attr('opacity', 1);
  }

  /** Optional: clear everything (e.g., on full reset) */
  public clear(): void {
    this.snakeLayer.selectAll('*').remove();
    this.foodLayer.selectAll('*').remove();
  }

  /** Optional: responsive resizing */
  public resizeTo(cellSize: number): void {
    this.cellSize = cellSize;
    this.widthPx = this.board.getWidth() * this.cellSize;
    this.heightPx = this.board.getHeight() * this.cellSize;

    this.svg
      .attr('width', this.widthPx)
      .attr('height', this.heightPx)
      .attr('viewBox', `0 0 ${this.widthPx} ${this.heightPx}`);

    // Re-rendering callers should call renderGrid/renderSnake/renderFoods afterwards.
  }
}
