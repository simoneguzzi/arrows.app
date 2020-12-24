import {connect} from 'react-redux'
import Header from '../components/Header'
import {toggleInspector} from "../actions/applicationLayout";
import {renameDiagram} from "../actions/diagramName";
import {showExportDialog, showHelpDialog} from "../actions/applicationDialogs";
import {
  newGoogleDriveDiagram,
  newLocalStorageDiagram,
  pickDiagram,
  postCurrentDiagramAsNewFileOnGoogleDrive
} from "../actions/storage";

const mapStateToProps = state => {
  return {
    diagramName: state.diagramName,
    storage: state.storage
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onNewGoogleDriveDiagram: () => {
      dispatch(newGoogleDriveDiagram())
    },
    onNewLocalStorageDiagram: () => {
      dispatch(newLocalStorageDiagram())
    },
    pickFromGoogleDrive: () => {
      dispatch(pickDiagram())
    },
    setDiagramName: (diagramName) => {
      dispatch(renameDiagram(diagramName))
    },
    showInspector: () => {
      dispatch(toggleInspector())
    },
    onExportClick: () => {
      dispatch(showExportDialog())
    },
    storeInGoogleDrive: () => {
      dispatch(postCurrentDiagramAsNewFileOnGoogleDrive())
    },
    onHelpClick: () => {
      dispatch(showHelpDialog())
    }
  }
}

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export default HeaderContainer
