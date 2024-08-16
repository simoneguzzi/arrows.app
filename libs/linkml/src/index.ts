import {
  Graph,
  RelationshipType,
  Node,
  Relationship,
  Cardinality,
  Ontology,
} from '@neo4j-arrows/model';
import { LinkMLClass, LinkML, SpiresCoreClasses } from './lib/types';
import {
  findNodeFactory,
  toClassName,
  toRelationshipClassNameFactory,
} from './lib/naming';
import { snakeCase } from 'lodash';
import {
  relationshipToRelationshipClass,
  relationshipToPredicateClass,
  findRelationshipsFromNodeFactory,
} from './lib/relationships';
import { nodeToClass } from './lib/nodes';
import { toPrefixes } from './lib/ontologies';

type LinkMLNode = Omit<Node, 'style' | 'position'>;
type LinkMLRelationship = Omit<Relationship, 'style'>;
type LinkMLGraph = {
  nodes: LinkMLNode[];
  relationships: LinkMLRelationship[];
};

export const fromGraph = (
  name: string,
  { description, nodes, relationships }: Graph
): LinkML => {
  const findNode = findNodeFactory(nodes);
  const findRelationshipFromNode =
    findRelationshipsFromNodeFactory(relationships);
  const toRelationshipClassName = toRelationshipClassNameFactory(nodes);

  const snakeCasedName = snakeCase(name);

  return {
    id: `https://example.com/${snakeCasedName}`,
    default_range: 'string',
    name: snakeCasedName,
    title: name,
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    prefixes: {
      linkml: 'https://w3id.org/linkml/',
      ontogpt: 'http://w3id.org/ontogpt/',
      ...toPrefixes([
        ...nodes.flatMap((node) => node.ontologies ?? []),
        ...relationships.flatMap(
          (relationship) => relationship.ontologies ?? []
        ),
      ]),
    },
    imports: ['ontogpt:core', 'linkml:types'],
    classes: {
      Document: {
        tree_root: true,
        description,
        is_a: SpiresCoreClasses.TextWithTriples,
        slot_usage: {
          triples: relationships.filter(
            ({ relationshipType }) =>
              relationshipType === RelationshipType.ASSOCIATION
          )[0]
            ? {
                range: `${toRelationshipClassName(
                  relationships[0]
                )}Relationship`,
              }
            : {},
        },
      },
      ...nodes.reduce(
        (classes: Record<string, LinkMLClass>, node) => ({
          ...classes,
          [toClassName(node.caption)]: nodeToClass(
            node,
            findNode,
            findRelationshipFromNode
          ),
        }),
        {}
      ),
      ...relationships
        .filter(
          ({ relationshipType }) =>
            relationshipType === RelationshipType.ASSOCIATION
        )
        .reduce(
          (classes: Record<string, LinkMLClass>, relationship) => ({
            ...classes,
            [`${toRelationshipClassName(relationship)}Relationship`]:
              relationshipToRelationshipClass(
                relationship,
                findNode,
                toRelationshipClassName
              ),
            [`${toRelationshipClassName(relationship)}Predicate`]:
              relationshipToPredicateClass(relationship, findNode),
          }),
          {}
        ),
    },
  };
};

export const toGraph = (
  { classes }: LinkML,
  ontologies: Ontology[]
): LinkMLGraph => {
  const nodes: LinkMLNode[] = [];
  const relationships: LinkMLRelationship[] = [];
  let nextNodeId = nodes.length;
  let nextRelationshipId = 0;
  let noNewNodes = false;
  while (!noNewNodes) {
    noNewNodes = true;
    Object.entries(classes).forEach(
      ([key, { is_a, mixins, attributes, id_prefixes }]) => {
        const self = nodes.find(({ caption }) => caption === key);
        const parent = nodes.find(
          ({ caption }) => caption === is_a || (mixins && caption in mixins)
        );
        if (!self && (is_a === SpiresCoreClasses.NamedEntity || parent)) {
          noNewNodes = false;
          if (parent) {
            nextRelationshipId = relationships.push({
              relationshipType: RelationshipType.INHERITANCE,
              fromId: nextNodeId.toString(),
              toId: parent.id,
              properties: {},
              entityType: 'relationship',
              type: '',
              id: nextRelationshipId.toString(),
            });
          }
          nextNodeId = nodes.push({
            id: nextNodeId.toString(),
            caption: key,
            properties: Object.entries(attributes ?? {}).reduce(
              (properties: Record<string, string>, [key, { description }]) => ({
                ...properties,
                [key]: description ?? '',
              }),
              {}
            ),
            entityType: 'node',
            ontologies: ontologies.filter(
              ({ id }) =>
                id_prefixes && id_prefixes.includes(id.toLocaleUpperCase())
            ),
          });
        }
      }
    );
  }
  Object.entries(classes)
    .filter(([key, { is_a }]) => is_a === SpiresCoreClasses.Triple)
    .forEach(([key, { slot_usage }], index) => {
      if (slot_usage) {
        const fromNode = nodes.find(
          (node) => node.caption === slot_usage['subject'].range
        );
        const toNode = nodes.find(
          (node) => node.caption === slot_usage['object'].range
        );

        if (fromNode && toNode) {
          relationships.push({
            relationshipType: RelationshipType.ASSOCIATION,
            fromId: fromNode.id,
            toId: toNode.id,
            properties: {},
            entityType: 'relationship',
            type: '',
            id: (index + nextRelationshipId).toString(),
            cardinality: Cardinality.ONE_TO_MANY,
          });
        }
      }
    });
  return {
    nodes,
    relationships,
  };
};
