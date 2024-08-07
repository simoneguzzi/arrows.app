import { OntologiesJson, OntologyConfig } from './lib/types';
import { Ontology } from '@neo4j-arrows/model';

const ONTOLOGIES_LIST = 'https://www.ebi.ac.uk/ols4/api/ontologies';

const toOntology = ({
  config: { id, title, description, fileLocation },
}: {
  config: OntologyConfig;
}) => {
  return {
    id,
    description,
    name: title,
    namespace: fileLocation,
  };
};

export const ontologiesCount = async (): Promise<number> => {
  return fetch(ONTOLOGIES_LIST).then((response) =>
    response.json().then((data: OntologiesJson) => data.page.totalElements)
  );
};

export const ontologies = async (size = 20): Promise<Ontology[]> => {
  return fetch(`${ONTOLOGIES_LIST}?size=${size}`).then((response) =>
    response
      .json()
      .then((data: OntologiesJson) => data._embedded.ontologies.map(toOntology))
  );
};
