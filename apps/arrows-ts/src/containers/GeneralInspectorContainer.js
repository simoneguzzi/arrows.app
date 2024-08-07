import { connect } from 'react-redux';
import {
  createNode,
  setGraphDescription,
  setGraphStyle,
  setGraphStyles,
} from '../actions/graph';
import GeneralInspector from '../components/GeneralInspector';
import { getPresentGraph } from '../selectors';
import { styleCustomize, styleTheme } from '../actions/applicationLayout';
import { toggleSelection } from '../actions/selection';

const mapStateToProps = (state) => {
  return {
    graph: getPresentGraph(state),
    cachedImages: state.cachedImages,
    selection: state.selection,
    styleMode: state.applicationLayout.styleMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: (entities) => {
      dispatch(toggleSelection(entities, 'replace'));
    },
    onSaveGraphStyle: (key, value) => {
      dispatch(setGraphStyle(key, value));
    },
    onPlusNodeClick: () => {
      dispatch(createNode());
    },
    onStyleTheme: () => {
      dispatch(styleTheme());
    },
    onStyleCustomize: () => {
      dispatch(styleCustomize());
    },
    onApplyTheme: (style) => {
      dispatch(setGraphStyles(style));
    },
    onDescriptionChange: (description) => {
      dispatch(setGraphDescription(description));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInspector);
