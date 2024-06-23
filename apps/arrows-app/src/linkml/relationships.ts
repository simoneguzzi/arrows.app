import { Relationship } from '../../../../libs/model/src/lib/Relationship';
import { LinkMLClass, SpiresCoreClasses } from './types';
import { toClassName } from './naming';

export const relationshipToRelationshipClass = (
  relationship: Relationship,
  nodeIdToNodeCaption: (id: string) => string,
  toRelationshipClassName: (relationship: Relationship) => string
): LinkMLClass => {
  return {
    is_a: SpiresCoreClasses.Triple,
    description: `A triple where the subject is a ${nodeIdToNodeCaption(
      relationship.fromId
    )} and the object is a ${nodeIdToNodeCaption(relationship.toId)}.`,
    slot_usage: {
      subject: {
        range: toClassName(nodeIdToNodeCaption(relationship.fromId)),
      },
      object: {
        range: toClassName(nodeIdToNodeCaption(relationship.toId)),
      },
      predicate: {
        range: `${toRelationshipClassName(relationship)}Predicate`,
      },
    },
  };
};

export const relationshipToPredicateClass = (
  relationship: Relationship,
  idToCaption: (id: string) => string
): LinkMLClass => {
  return {
    is_a: SpiresCoreClasses.NamedEntity,
    description: `The predicate for the ${idToCaption(
      relationship.fromId
    )} to ${idToCaption(relationship.toId)} relationships.`,
    id_prefixes: relationship.ontology ? [relationship.ontology.id] : [],
    annotations: relationship.ontology
      ? {
          annotators: `sqlite:obo:${relationship.ontology.id}`,
        }
      : {},
  };
};
