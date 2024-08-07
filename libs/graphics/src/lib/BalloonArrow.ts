import { Point } from '@neo4j-arrows/model';
import { ArrowDimensions } from './arrowDimensions';
import arrowHead from './arrowHead';
import { BoundingBox } from './utils/BoundingBox';
import { perpendicular } from './utils/angles';
import { DrawingContext } from './utils/DrawingContext';

export class BalloonArrow {
  nodeCentre: Point;
  nodeRadius: number;
  angle: number;
  length: number;
  arcRadius: number;
  dimensions: ArrowDimensions;
  displacement: number;
  deflection: number;
  startAttach: Point;
  startShaft: Point;
  endShaft: Point;
  control: number;

  constructor(
    nodeCentre: Point,
    nodeRadius: number,
    angle: number,
    separation: number,
    length: number,
    arcRadius: number,
    dimensions: ArrowDimensions
  ) {
    this.nodeCentre = nodeCentre;
    this.nodeRadius = nodeRadius;
    this.angle = angle;
    this.length = length;
    this.arcRadius = arcRadius;
    this.dimensions = dimensions;

    this.displacement = separation / 2;
    this.deflection = (this.displacement * 0.6) / nodeRadius;

    this.startAttach = new Point(nodeRadius, 0).rotate(-this.deflection);
    this.startShaft = new Point(
      nodeRadius +
        (dimensions.hasIngoingArrowHead
          ? dimensions.headHeight - dimensions.chinHeight
          : 0),
      0
    ).rotate(-this.deflection);
    this.endShaft = new Point(
      nodeRadius +
        (dimensions.hasOutgoingArrowHead
          ? dimensions.headHeight - dimensions.chinHeight
          : 0),
      0
    ).rotate(this.deflection);

    this.control =
      (this.startAttach.x * this.displacement) / -this.startAttach.y;
  }

  distanceFrom(point: Point) {
    const localPoint = point
      .translate(this.nodeCentre.vectorFromOrigin().invert())
      .rotate(-this.angle);
    const rectangle = new BoundingBox(
      this.nodeRadius,
      this.length - this.displacement,
      -(this.displacement + this.dimensions.arrowWidth / 2),
      this.displacement + this.dimensions.arrowWidth / 2
    );
    const turnCentre = new Point(this.length - this.displacement, 0);
    return rectangle.contains(localPoint) ||
      turnCentre.vectorFrom(localPoint).distance() <
        this.displacement + this.dimensions.arrowWidth / 2
      ? 0
      : Infinity;
  }

  draw(ctx: DrawingContext) {
    ctx.save();
    ctx.translate(...this.nodeCentre.xy);
    ctx.rotate(this.angle);
    if (this.dimensions.hasIngoingArrowHead) {
      const [x, y] = this.startAttach.xy;
      ctx.translate(x, y);
      ctx.rotate(Math.PI - this.deflection);
      ctx.fillStyle = this.dimensions.arrowColor;
      ctx.lineWidth = this.dimensions.arrowHeadsWidth;
      arrowHead(
        ctx,
        this.dimensions.headHeight,
        this.dimensions.chinHeight,
        this.dimensions.headWidth,
        this.dimensions.fillArrowHeads,
        !this.dimensions.fillArrowHeads
      );
      ctx.rotate(Math.PI + this.deflection);
      ctx.translate(-x, -y);
    }
    ctx.beginPath();
    this.path(ctx);
    ctx.lineWidth = this.dimensions.shaftWidth;
    ctx.strokeStyle = this.dimensions.arrowColor;
    ctx.stroke();
    if (this.dimensions.hasOutgoingArrowHead) {
      ctx.rotate(Math.PI + this.deflection);
      ctx.translate(-this.nodeRadius, 0);
      ctx.lineWidth = this.dimensions.arrowHeadsWidth;
      ctx.fillStyle = this.dimensions.arrowColor;
      arrowHead(
        ctx,
        this.dimensions.headHeight,
        this.dimensions.chinHeight,
        this.dimensions.headWidth,
        this.dimensions.fillArrowHeads,
        !this.dimensions.fillArrowHeads
      );
    }
    ctx.restore();
  }

  drawSelectionIndicator(ctx: DrawingContext) {
    const indicatorWidth = 10;
    ctx.save();
    ctx.strokeStyle = this.dimensions.selectionColor;
    ctx.translate(...this.nodeCentre.xy);
    ctx.rotate(this.angle);
    if (this.dimensions.hasIngoingArrowHead) {
      ctx.rotate(Math.PI - this.deflection);
      ctx.translate(-this.nodeRadius, 0);
      ctx.lineWidth = indicatorWidth;
      ctx.lineJoin = 'round';
      arrowHead(
        ctx,
        this.dimensions.headHeight,
        this.dimensions.chinHeight,
        this.dimensions.headWidth,
        false,
        true
      );
      ctx.translate(this.nodeRadius, 0);
      ctx.rotate(Math.PI + this.deflection);
    }
    ctx.beginPath();
    this.path(ctx);
    ctx.lineWidth = this.dimensions.shaftWidth + indicatorWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
    if (this.dimensions.hasOutgoingArrowHead) {
      ctx.rotate(Math.PI + this.deflection);
      ctx.translate(-this.nodeRadius, 0);
      ctx.lineWidth = indicatorWidth;
      ctx.lineJoin = 'round';
      arrowHead(
        ctx,
        this.dimensions.headHeight,
        this.dimensions.chinHeight,
        this.dimensions.headWidth,
        false,
        true
      );
    }
    ctx.restore();
  }

  path(ctx: DrawingContext) {
    ctx.moveTo(this.startShaft.x, this.startShaft.y);
    ctx.arcTo(
      this.control,
      -this.displacement,
      this.length / 2,
      -this.displacement,
      this.arcRadius
    );
    ctx.arcTo(
      this.length,
      -this.displacement,
      this.length,
      0,
      this.displacement
    );
    ctx.arcTo(
      this.length,
      this.displacement,
      this.length / 2,
      this.displacement,
      this.displacement
    );
    ctx.arcTo(
      this.control,
      this.displacement,
      this.endShaft.x,
      this.endShaft.y,
      this.arcRadius
    );
    ctx.lineTo(this.endShaft.x, this.endShaft.y);
  }

  midPoint() {
    return new Point(this.length - this.displacement, 0)
      .rotate(this.angle)
      .translate(this.nodeCentre.vectorFromOrigin());
  }

  shaftAngle() {
    return perpendicular(this.angle);
  }

  get arrowKind() {
    return 'loopy';
  }
}
