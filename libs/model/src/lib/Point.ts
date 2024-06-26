import { Vector } from './Vector';

export interface Coordinate {
  x: number;
  y: number;
}

export class Point {
  constructor(readonly x: number, readonly y: number) {}

  vectorFrom(otherPoint: Point) {
    return new Vector(this.x - otherPoint.x, this.y - otherPoint.y);
  }

  vectorFromOrigin() {
    return new Vector(this.x, this.y);
  }

  scale(scaleFactor: number) {
    return new Point(this.x * scaleFactor, this.y * scaleFactor);
  }

  translate(vector: Vector) {
    return new Point(this.x + vector.dx, this.y + vector.dy);
  }

  rotate(angle: number) {
    return new Point(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    );
  }

  isEqual(point: Point) {
    return this.x === point.x && this.y === point.y;
  }

  get xy(): [number, number] {
    return [this.x, this.y];
  }
}

export const originPoint = new Point(0, 0);

export const average = (points: Point[]) => {
  const sumX = points.reduce((sum, point) => sum + point.x, 0);
  const sumY = points.reduce((sum, point) => sum + point.y, 0);
  return new Point(sumX / points.length, sumY / points.length);
};
