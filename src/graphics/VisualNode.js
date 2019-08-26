import { getStyleSelector } from "../selectors/style";
import {NodeLabels} from "./NodeLabels";
import {NodeCaption} from "./NodeCaption";
import {NodeBorder} from "./NodeBorder";
import {NodeBackground} from "./NodeBackground";
import {NodeProperties} from "./NodeProperties";
import {neighbourPositions} from "../model/Graph";

export default class VisualNode {
  constructor(node, graph) {
    this.node = node

    const style = styleAttribute => getStyleSelector(node, styleAttribute)(graph)

    this.radius = style('radius')
    this.background = new NodeBackground(style)
    if (style('border-width') > 0) {
      this.border = new NodeBorder(style)
    }
    if (node.caption) {
      this.caption = new NodeCaption(node.caption, style)
    }
    const neighbourObstacles = neighbourPositions(node, graph).map(position => {
      return { angle: position.vectorFrom(node.position).angle() }
    })
    if (node.labels && node.labels.length > 0) {
      this.labels = new NodeLabels(node.labels, neighbourObstacles, style)
    }
    const obstacles = this.labels ? [...neighbourObstacles, this.labels] : neighbourObstacles
    this.properties = new NodeProperties(
      node.properties, this.radius, node.position, obstacles, style
    )
  }

  get id() {
    return this.node.id
  }

  get position() {
    return this.node.position
  }

  get status() {
    return this.node.status
  }

  get superNodeId() {
    return this.node.superNodeId
  }

  get type() {
    return this.node.type
  }

  get initialPositions () {
    return this.node.initialPositions
  }

  draw(ctx) {
    if (this.status === 'combined') {
      return
    }

    this.background.draw(this.position, this.radius, ctx)
    if (this.border) {
      this.border.draw(this.position, this.radius, ctx)
    }
    if (this.caption) {
      this.caption.draw(this.position, this.radius * 2, ctx)
    }
    if (this.labels) {
      this.labels.draw(this.position, this.radius, ctx)
    }
    this.properties.draw(ctx)
  }
}