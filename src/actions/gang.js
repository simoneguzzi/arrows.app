import { getCommonCaption } from "../model/gang"
import { nextAvailableId } from "../model/Id"
import { deleteNodesAndRelationships, moveNodes } from "./graph"
import { clearSelection } from "./selection";
import { Guides } from "../graphics/Guides";

export const createClusterGang = (nodePositions, initialPositions) => (dispatch, getState) => {
  const { graph } = getState()
  const combinedNodeIds = nodePositions.map(nodePos => nodePos.nodeId)
  const combinedNodes = graph.nodes.filter(node => combinedNodeIds.includes(node.id))

  const commonCaption = getCommonCaption(combinedNodes)

  let { commonProps, caption } = commonCaption
  const commonKeys = Object.keys(commonProps)
  if (commonKeys.length > 0) {
    caption = commonProps[commonKeys[0]]
  }

  const superNodeId = nextAvailableId(graph.nodes)
  dispatch(clearSelection())
  dispatch(createCluster(superNodeId, caption, nodePositions[0].position, 'cluster', initialPositions))
  dispatch(moveNodes(null, null, initialPositions, new Guides(), true)) //setTimeout(() => dispatch(moveNodesEndDrag(initialPositions)), 100)
}

/*export const splitCluster = nodeId => (dispatch, getState) => {
  const { graph, guides } = getState()
  const superNode = graph.nodes.find(node => node.id === nodeId)
  console.log('SUPER', superNode)
  dispatch(restoreNodes(superNode.initialPositions))
  dispatch(moveNodes(null, null, superNode.initialPositions, guides))
  dispatch(moveNodesEndDrag(superNode.initialPositions))
  //  moveNodes = (oldMousePosition, newMousePosition, nodePositions, guides, autoGenerated)
  dispatch(deleteNodesAndRelationships({ [superNode.id] : true }, { } ))
}*/

export const createCluster = (nodeId, caption, position, nodeType, initialPositions) => ({
  type: 'CREATE_CLUSTER',
  nodeId,
  caption,
  position,
  nodeType,
  properties: {},
  members: initialPositions,
  style: {
    'radius': 50,
    'node-color': '#FFF',
    'border-width': '2',
    'caption-color': '#000'
  }
})

/*
export const combineNodes = (nodeIds, superNodeId) => ({
  type: 'COMBINE_NODES',
  nodeIds,
  status: 'combined',
  superNodeId
})

export const restoreNodes = initialPositions => ({
  type: 'RESTORE_NODES',
  initialPositions
})*/
