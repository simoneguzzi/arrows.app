import { Graph, Node } from '@neo4j-arrows/model';
import { plural } from 'pluralize';
import { LinkMLClass, Attribute, LinkML } from './lib/types';
import {
  findNodeFactory,
  toAttributeName,
  toClassName,
  toRelationshipClassNameFactory,
} from './lib/naming';
import { snakeCase } from 'lodash';
import {
  relationshipToRelationshipClass,
  relationshipToPredicateClass,
} from './lib/relationships';
import { nodeToClass } from './lib/nodes';
import { toPrefixes } from './lib/ontologies';

const getAnnotations = (nodes: Node[]): LinkMLClass => {
  return {
    tree_root: true,
    attributes: nodes.reduce(
      (attributes: Record<string, Attribute>, node) => ({
        ...attributes,
        [toAttributeName(plural(node.caption))]: {
          range: toClassName(node.caption),
          multivalued: true,
        },
      }),
      {}
    ),
  };
};

export const fromGraph = (
  name: string,
  { nodes, relationships }: Graph
): LinkML => {
  const findNode = findNodeFactory(nodes);
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
      ...{ [`${toClassName(name)}Annotations`]: getAnnotations(nodes) },
      ...nodes.reduce(
        (classes: Record<string, LinkMLClass>, node) => ({
          ...classes,
          [toClassName(node.caption)]: nodeToClass(node),
        }),
        {}
      ),
      ...relationships.reduce(
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