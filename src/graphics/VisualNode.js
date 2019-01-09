import {drawCaption, drawCircle, drawSolidCircle, drawTextLine} from "./canvasRenderer";
import {getLines} from "./utils/wordwrap";
import config from './config'
import get from 'lodash.get'
import { Vector } from "../model/Vector";
import { Point } from "../model/Point";
import {asKey} from "../model/Id";
import { getStyleSelector } from "../selectors/style";
import { nodeStyleAttributes } from "../model/styling";

export default class VisualNode {
  constructor(node, graph) {
    this.node = node
    this.edges = []
    this.edgeMap = {}

    nodeStyleAttributes.forEach(styleAttribute => {
      this[styleAttribute] = getStyleSelector(node, styleAttribute)(graph)
    })
  }

  addEdge (edge, direction) {
    this.edges.push(edge)
    this.edgeMap[asKey(edge.id)] = {
      edge,
      direction
    }
  }

  get id() {
    return this.node.id
  }

  get x () {
    return this.node.position.x
  }

  get y () {
    return this.node.position.y
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

  distanceToBorder () {
    return this.radius
  }

  draw(ctx) {
    if (this.status === 'combined') {
      return
    }

    const { caption, labels } = this.node
    drawSolidCircle(ctx, this.position, this['node-color'], this.radius)

    if (this['border-width'] > 0) {
      this.drawBorder(ctx)
    }

    if (caption) {
      this.drawCaption(ctx, this.position, caption, this.radius * 2, config)
    }
    if (labels) {
      this.drawLabels(ctx, this.position, this.radius, labels)
    }
  }

  drawBorder(ctx, borderWidth) {
    const strokeWidth = borderWidth || this['border-width']
    ctx.save()
    ctx.strokeStyle = this['border-color'] || '#000'
    ctx.lineWidth = strokeWidth
    drawCircle(ctx, this.position, Math.max(strokeWidth / 2, this.radius - strokeWidth / 2), true)
    ctx.restore()
  }

  drawCaption(ctx, position, label, maxWidth, config) {
    ctx.save()
    const fontSize = this['caption-font-size']
    const fontColor = this['caption-color']
    const fontWeight = this['caption-font-weight']
    const fontFace = get(config, 'font.face')

    let lines = getLines(ctx, label, fontFace, fontSize, maxWidth, false)//this.hasIcon)

    ctx.fillStyle = fontColor
    ctx.font = `${fontWeight} ${fontSize}px ${fontFace}`
    ctx.textBaseline = 'middle'

    const lineDistance = fontSize
    let yPos = -((lines.length - 1) * lineDistance) / 2
    for (let line of lines) {
      drawTextLine(ctx, line, position.translate(new Vector(0, yPos)))
      yPos += lineDistance
    }
    ctx.restore()
  }

  drawLabels(ctx, position, radius, labels) {
    ctx.save()
    const fontSize = this['caption-font-size'] * this.viewTransformation.scale
    const fontColor = 'black' //this['caption-color']
    const fontFace = get(config, 'font.face')

    ctx.fillStyle = fontColor
    let fontWeight = 'normal'
    ctx.font = fontWeight + fontSize + 'px ' + fontFace
    ctx.textBaseline = 'middle'

    ctx.translate(...position.translate(new Vector(0, radius).rotate(Math.PI / 4)).xy)
    labels.forEach((label, i) => {
      ctx.save()
      ctx.translate(0, i * fontSize)
      drawTextLine(ctx, label, new Point(0, 0))
      ctx.restore()
    })
    ctx.restore()
  }
}