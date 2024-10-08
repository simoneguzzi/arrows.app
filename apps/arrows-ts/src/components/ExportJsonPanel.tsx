import React, { Component } from 'react';
import { Form, Icon, TextArea } from 'semantic-ui-react';
import { Base64 } from 'js-base64';
import { Graph } from '@neo4j-arrows/model';

interface ExportJsonPanelProps {
  graph: Graph;
  diagramName: string;
}

class ExportJsonPanel extends Component<ExportJsonPanelProps> {
  render() {
    const jsonString = JSON.stringify(this.props.graph, null, 2);
    const dataUrl = 'data:application/json;base64,' + Base64.encode(jsonString);

    return (
      <Form>
        <Form.Field>
          <a
            className="ui button"
            href={dataUrl}
            download={this.props.diagramName + '.json'}
          >
            <Icon name="download" />
            Download
          </a>
        </Form.Field>
        <TextArea
          style={{
            height: 500,
            fontFamily: 'monospace',
          }}
          value={jsonString}
        />
      </Form>
    );
  }
}

export default ExportJsonPanel;
