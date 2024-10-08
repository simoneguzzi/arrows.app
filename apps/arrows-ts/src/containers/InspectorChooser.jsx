import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectedRelationships } from '@neo4j-arrows/model';
import InspectorContainer from './InspectorContainer';
import GeneralInspectorContainer from './GeneralInspectorContainer';
import { getSelectedNodes } from '@neo4j-arrows/selectors';
import { getPresentGraph } from '../selectors';

const mapStateToProps = (state) => {
  const selection = state.selection;
  const graph = getPresentGraph(state);
  return {
    showSelectionInspector:
      getSelectedNodes({ ...state, graph }).length > 0 ||
      selectedRelationships(graph, selection).length > 0,
  };
};

class Chooser extends Component {
  render() {
    return this.props.showSelectionInspector ? (
      <InspectorContainer />
    ) : (
      <GeneralInspectorContainer />
    );
  }
}

export default connect(mapStateToProps, null)(Chooser);
