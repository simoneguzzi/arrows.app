export const defaultConnectionUri = "bolt://localhost";

const initialConnectionParameters = () => {
  return {
    connectionUri: defaultConnectionUri,
    username: "",
    password: "",
    rememberCredentials: false
  }
}

export default function storage(state = {
  mode: 'NONE',
  viewingConfig: false,
  database: {
    connectionParametersEditable: true,
    connectionParameters: initialConnectionParameters(),
    showDisconnectedDialog: false,
    errorMsg: null
  },
  googleDrive: {}
}, action) {
  switch (action.type) {
    case 'USE_NEO4J_STORAGE':
      return {
        ...state,
        mode: 'DATABASE'
      }
    case 'USE_GOOGLE_DRIVE_STORAGE':
      return {
        ...state,
        mode: 'GOOGLE_DRIVE',
        googleDrive: {
          fileId: action.fileId
        }
      }
    case 'VIEW_STORAGE_CONFIG':
      return {
        ...state,
        viewingConfig: true
      }

    case 'HIDE_STORAGE_CONFIG':
      return {
        ...state,
        viewingConfig: false
      }

    case 'DISABLE_EDITING_CONNECTION_PARAMETERS':
      return {
        ...state,
        database: {
          ...state.database,
          connectionParametersEditable: false
        }
      }

    case 'UPDATE_CONNECTION_PARAMETERS':
      return {
        ...state,
        viewingConfig: false,
        database: {
          ...state.database,
          showDisconnectedDialog: false,
          connectionParameters: action.connectionParameters,
          errorMsg: null
        }
      }

    case 'FAILED_DATABASE_CONNECTION':
      return {
        ...state,
        viewingConfig: state.database.connectionParametersEditable,
        database: {
          ...state.database,
          showDisconnectedDialog: state.database.connectionParametersEditable,
          connectionParameters: action.connectionParameters,
          errorMsg: action.errorMsg
        }
      }

    case 'DESKTOP_DISCONNECTED':
      return {
        ...state,
        database: {
          ...state.database,
          showDisconnectedDialog: true,
          connectionParameters: null
        }
      }

    default:
      return state
  }
}