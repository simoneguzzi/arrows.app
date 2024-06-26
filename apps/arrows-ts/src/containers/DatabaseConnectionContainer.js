import { connect } from 'react-redux';
import DatabaseConnectionForm from '../components/DatabaseConnectionForm';
import {
  cancelEditing,
  updateConnectionParameters,
} from '../actions/databaseConnection';
import { forgetConnectionParameters } from '../actions/localStorage';

const mapStateToProps = (state) => {
  return {
    connectionParameters: state.storage.database.connectionParameters,
    errorMsg: state.storage.database.errorMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onConnectionParametersUpdated: (connectionParameters) => {
      dispatch(updateConnectionParameters(connectionParameters));
    },
    onCancel: () => {
      dispatch(cancelEditing());
    },
    forgetConnectionParameters: forgetConnectionParameters,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatabaseConnectionForm);
