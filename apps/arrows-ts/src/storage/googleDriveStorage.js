import {
  completeWithDefaults,
  emptyGraph,
  Point,
  RelationshipType,
} from '@neo4j-arrows/model';
import { gettingDiagramNameSucceeded } from '../actions/diagramName';
import { gettingGraph, gettingGraphSucceeded } from '../actions/storage';

export function fetchGraphFromDrive(fileId) {
  return function (dispatch) {
    dispatch(gettingGraph());

    const fetchData = () =>
      getFileInfo(fileId).then((data) => {
        const layers = constructGraphFromFile(JSON.parse(data));
        dispatch(gettingGraphSucceeded(layers.graph));
      });

    const fetchFileName = () =>
      getFileInfo(fileId, true).then((fileMetadata) => {
        const fileName = JSON.parse(fileMetadata).name;
        dispatch(gettingDiagramNameSucceeded(fileName));
      });

    fetchFileName();
    fetchData();
  };
}

const getFileInfo = (fileId, metaOnly = false) => {
  return new Promise((resolve, reject) => {
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true${
      metaOnly ? '' : '&alt=media'
    }`;
    const accessToken = window.gapi.auth.getToken().access_token;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', downloadUrl);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = (error) => reject(error);
    xhr.send();
  });
};

export const constructGraphFromFile = (data) => {
  let graph;

  if (data) {
    if (data.graph) {
      graph = data.graph;
    } else {
      graph = data;
    }
  } else {
    graph = emptyGraph();
  }

  const nodes = graph.nodes.map((node) => ({
    id: node.id,
    position: new Point(node.position.x, node.position.y),
    caption: node.caption,
    ontologies: node.ontologies || [],
    examples: node.examples || [],
    properties: node.properties || {},
    style: node.style || {},
  }));

  const relationships = graph.relationships
    .filter(
      (relationship) =>
        nodes.some((node) => node.id === relationship.fromId) &&
        nodes.some((node) => node.id === relationship.toId)
    )
    .map((relationship) => ({
      ...relationship,
      toId: relationship.toId,
      type: relationship.type || '',
      relationshipType:
        relationship.relationshipType || RelationshipType.ASSOCIATION,
      ontologies: relationship.ontologies || [],
      examples: relationship.examples || [],
      properties: relationship.properties || {},
      style: relationship.style || {},
    }));

  return {
    graph: {
      ...graph,
      nodes,
      relationships,
      style: completeWithDefaults(graph.style),
    },
  };
};
