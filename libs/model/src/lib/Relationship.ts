import { Entity, Id } from './Id';
import { Ontology } from './Ontology';

export enum Cardinality {
  ONE_TO_MANY = 'ONE_TO_MANY',
  MANY_TO_ONE = 'MANY_TO_ONE',
  ONE_TO_ONE = 'ONE_TO_ONE',
  MANY_TO_MANY = 'MANY_TO_MANY',
}

export enum RelationshipType {
  ASSOCIATION = 'ASSOCIATION',
  INHERITANCE = 'INHERITANCE',
}

export function toVisualCardinality(cardinality: Cardinality): string {
  switch (cardinality) {
    case Cardinality.ONE_TO_ONE:
      return '1:1';
    case Cardinality.ONE_TO_MANY:
      return '1:N';
    case Cardinality.MANY_TO_MANY:
      return 'N:N';
    case Cardinality.MANY_TO_ONE:
      return 'N:1';
  }
}

export interface Relationship extends Entity {
  type: string;
  relationshipType: RelationshipType;
  fromId: Id;
  toId: Id;
  ontologies?: Ontology[];
  examples?: string[];
  cardinality?: Cardinality;
}

export const setType = (relationship: Relationship, type: string) => {
  return {
    ...relationship,
    type,
  };
};

export const setRelationshipType = (
  relationship: Relationship,
  relationshipType: RelationshipType
) => {
  return {
    ...relationship,
    cardinality:
      relationshipType === RelationshipType.ASSOCIATION
        ? relationship.cardinality ?? Cardinality.ONE_TO_MANY
        : undefined,
    ontologies:
      relationshipType === RelationshipType.ASSOCIATION
        ? relationship.ontologies
        : undefined,
    examples:
      relationshipType === RelationshipType.ASSOCIATION
        ? relationship.examples
        : undefined,
    relationshipType,
  };
};

export const stringTypeToDatabaseType = (stringType: string) => {
  return stringType === '' ? '_RELATED' : stringType.replace(/_/g, '__');
};

export const databaseTypeToStringType = (databaseType: string) => {
  return databaseType === '_RELATED' ? '' : databaseType.replace(/__/g, '_');
};

export const reverse = (relationship: Relationship) => {
  return {
    ...relationship,
    toId: relationship.fromId,
    fromId: relationship.toId,
  };
};

export const isRelationship = (entity: Entity): entity is Relationship =>
  entity !== undefined &&
  typeof entity === 'object' &&
  Object.hasOwn(entity, 'type') &&
  Object.hasOwn(entity, 'fromId') &&
  Object.hasOwn(entity, 'toId');

export const otherNodeId = (relationship: Relationship, nodeId: Id) => {
  if (relationship.fromId === nodeId) {
    return relationship.toId;
  }
  if (relationship.toId === nodeId) {
    return relationship.fromId;
  }
  return undefined;
};
