import snapToTargetNode from "./snapToTargetNode"
import {snapToDistancesAndAngles} from "./geometricSnapping"
import {idsMatch} from "../model/Id"
import {Guides} from "../graphics/Guides"

export const activateRing = (sourceNodeId) => {
  return {
    type: 'ACTIVATE_RING',
    sourceNodeId
  }
}

export const deactivateRing = () => {
  return {
    type: 'DEACTIVATE_RING'
  }
}

export const tryDragRing = (sourceNodeId, mousePosition) => {
  return function (dispatch, getState) {
    let graph = getState().graph;
    let targetSnaps = snapToTargetNode(graph, sourceNodeId, mousePosition)
    if (targetSnaps.snapped) {
      dispatch(ringDraggedConnected(
        sourceNodeId,
        targetSnaps.snappedNodeId,
        targetSnaps.snappedPosition,
        mousePosition
      ))
    } else {
      let snaps = snapToDistancesAndAngles(
        graph,
        [graph.nodes.find((node) => idsMatch(node.id, sourceNodeId))],
        (nodeId) => true,
        mousePosition
      )
      if (snaps.snapped) {
        dispatch(ringDraggedDisconnected(
          sourceNodeId,
          snaps.snappedPosition,
          new Guides(snaps.guidelines, mousePosition),
          mousePosition
        ))
      } else {
        dispatch(ringDraggedDisconnected(
          sourceNodeId,
          mousePosition,
          new Guides(),
          mousePosition
        ))
      }
    }
  }
}

const ringDraggedDisconnected = (sourceNodeId, position, guides, newMousePosition) => {
  return {
    type: 'RING_DRAGGED',
    sourceNodeId,
    targetNodeId: null,
    position,
    guides,
    newMousePosition
  }
}

const ringDraggedConnected = (sourceNodeId, targetNodeId, position, newMousePosition) => {
  return {
    type: 'RING_DRAGGED',
    sourceNodeId,
    targetNodeId,
    position,
    guides: new Guides(),
    newMousePosition
  }
}