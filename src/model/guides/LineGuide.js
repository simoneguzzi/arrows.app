import {intersectLineAndCircle, intersectLineAndLine} from "./intersections";
import {Vector} from "../Vector";
import {Point} from "../Point";
import {coLinearIntervals} from "./intervals";
import {byAscendingError} from "./guides";

export class LineGuide {
  constructor(center, angle, naturalPosition) {
    this.center = center
    this.angle = angle
    this.error = this.calculateError(naturalPosition)
  }

  get type() {
    return 'LINE'
  }

  calculateError(naturalPosition) {
    const unitVector = new Vector(1, 0).rotate(this.angle)
    const offset = naturalPosition.vectorFrom(this.center)
    return offset.minus(unitVector.scale(offset.dot(unitVector))).distance()
  }

  snap(naturalPosition) {
    let offset = naturalPosition.vectorFrom(this.center)
    let vector = new Vector(1, 0).scale(offset.distance()).rotate(this.angle)
    if (offset.dot(vector) < 0) vector = vector.invert()
    return this.center.translate(vector)
  }

  scalar(position) {
    let xAxisPoint = position.translate(this.center.vectorFromOrigin().invert()).rotate(-this.angle)
    return xAxisPoint.x
  }

  point(scalar) {
    return new Point(scalar, 0).rotate(this.angle).translate(this.center.vectorFromOrigin())
  }

  combine(otherGuide, naturalPosition) {
    switch (otherGuide.type) {
      case 'LINE':
        return intersectLineAndLine(this, otherGuide, naturalPosition)

      case 'CIRCLE':
        return intersectLineAndCircle(this, otherGuide, naturalPosition)

      default:
        throw Error('unknown Guide type: ' + otherGuide.type)
    }
  }

  intervalGuide(nodes, naturalPosition) {
    const otherNodesOnGuide = nodes
      .filter((node) => this.calculateError(node.position) < 0.01)
      .map(node => this.scalar(node.position));
    const intervals = coLinearIntervals(this.scalar(naturalPosition), otherNodesOnGuide)
    intervals.sort(byAscendingError)
    if (intervals.length > 0) {
      const interval = intervals[0]
      return new LineGuide(this.point(interval.candidate), this.angle + Math.PI / 2, naturalPosition)
    }
    return null
  }
}