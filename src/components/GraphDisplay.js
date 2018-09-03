import React, {Component} from 'react';
import { renderVisuals } from "../graphics/visualsRenderer";
import { DELETE_SELECTION, DUPLICATE_SELECTION, MOVE_LEFT, MOVE_UP, MOVE_RIGHT, MOVE_DOWN,SELECT_ALL } from "../interactions/Keybindings";
import MouseHandler from "../interactions/MouseHandler";

class GraphDisplay extends Component {
  constructor (props) {
    super (props)
    props.registerAction(
      'REMOVE_SELECTION_PATH',
      () => this.props.removeSelectionPath()
    )
    props.registerAction(
      DUPLICATE_SELECTION,
      () => this.props.duplicateSelection()
    )
    props.registerAction(
      DELETE_SELECTION,
      () => this.props.deleteSelection()
    )
    props.registerAction(
      SELECT_ALL,
      () => this.props.selectAll()
    )
    props.registerAction(
      MOVE_LEFT,
      (extraKeys) => this.props.jumpToNextNode('LEFT', extraKeys)
    )
    props.registerAction(
      MOVE_UP,
      (extraKeys) => this.props.jumpToNextNode('UP', extraKeys)
    )
    props.registerAction(
      MOVE_RIGHT,
      (extraKeys) => this.props.jumpToNextNode('RIGHT', extraKeys)
    )
    props.registerAction(
      MOVE_DOWN,
      (extraKeys) => this.props.jumpToNextNode('DOWN', extraKeys)
    )
  }

  fitToParent () {
    const parent = this.canvas.parentElement
    const rect = parent.getBoundingClientRect()
  }

  componentDidMount() {
    this.touchHandler = new MouseHandler(this.canvas)
    this.fitToParent()
    this.drawVisuals()
  }

  componentDidUpdate() {
    this.fitCanvasSize(this.canvas, this.props.canvasSize.width, this.props.canvasSize.height)
    this.drawVisuals()
  }

  render() {
    return (
      <canvas
        ref={(elm) => this.canvas = elm}
      />
    )
  }

  fitCanvasSize(canvas, width, height) {
    canvas.width = width
    canvas.height = height
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    const context = canvas.getContext('2d');

    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1
    const ratio = devicePixelRatio / backingStoreRatio

    if (devicePixelRatio !== backingStoreRatio) {
      canvas.width = width * ratio
      canvas.height = height * ratio

      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'

      // now scale the context to counter
      // the fact that we've manually scaled
      // our canvas element
      context.scale(ratio, ratio)
    }

    return ratio
  }

  drawVisuals() {
    const { visualGraph, selection, gestures, guides, handles, viewTransformation, canvasSize } = this.props
    renderVisuals({
      visuals: {visualGraph, selection, gestures, guides, handles},
      canvas: this.canvas,
      displayOptions: { canvasSize, viewTransformation }
    })

    this.touchHandler.setDispatch(this.props.dispatch)
  }
}

export default GraphDisplay
