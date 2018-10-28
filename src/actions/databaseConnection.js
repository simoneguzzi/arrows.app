import {fetchGraphFromDatabase, updateDriver} from "../storage/neo4jStorage";
import { subscribeToDatabaseCredentialsForActiveGraph } from 'graph-app-kit/components/GraphAppBase'
import { setStorage } from "./storage";

const neo4j = require("neo4j-driver/lib/browser/neo4j-web.min.js").v1;
const integrationPoint = window.neo4jDesktopApi
const localStorageKey = "neo4j-arrows-app.rememberedConnectionParameters";

const rememberConnectionParameters = (connectionParameters) => {
  const serializedVal = JSON.stringify(connectionParameters)
  localStorage.setItem(localStorageKey, serializedVal)
}

export const forgetConnectionParameters = () => {
  localStorage.removeItem(localStorageKey)
}

export const initializeConnection = () => {
  if (integrationPoint) {
    return useConnectionParametersFromDesktopContext()
  } else {
    return useRememberedConnectionParameters()
  }
}

const useConnectionParametersFromDesktopContext = () => {
  return function (dispatch) {
    dispatch(disableEditingConnectionParameters())
    subscribeToDatabaseCredentialsForActiveGraph(
      integrationPoint,
      (credentials) => {
        dispatch(updateConnectionParameters({
          connectionUri: credentials.host,
          username: credentials.username,
          password: credentials.password,
          rememberCredentials: false
        }))
      },
      () => {
        dispatch(desktopDisconnected())
      }
    )
  }
}

const useRememberedConnectionParameters = () => {
  const serializedVal = localStorage.getItem(localStorageKey)
  const parsedVal = JSON.parse(serializedVal)
  if (parsedVal && parsedVal.connectionUri) {
    return updateConnectionParameters(parsedVal)
  } else {
    return editConnectionParameters()
  }
}

export const updateConnectionParameters = (connectionParameters) => {
  return function (dispatch) {
    const {connectionUri, username, password} = connectionParameters
    try {
      const driver = neo4j.driver(
        connectionUri,
        neo4j.auth.basic(username, password),
        {encrypted: window.location.protocol === 'https:'}
      )
      const session = driver.session()
      session.run("RETURN 1").then(() => {
        session.close()
        if (connectionParameters.rememberCredentials) {
          rememberConnectionParameters(connectionParameters)
        }
        updateDriver(driver)
        dispatch(successfulUpdate(connectionParameters))
        dispatch(setStorage('neo4j'))
        dispatch(fetchGraphFromDatabase())
      }).catch(function (error) {
        dispatch(unsuccessfulUpdate(connectionParameters, error.message))
      });
    }
    catch (error) {
      dispatch(unsuccessfulUpdate(connectionParameters, error.message))
    }
  }
}

const disableEditingConnectionParameters = () => {
  return {
    type: 'DISABLE_EDITING_CONNECTION_PARAMETERS'
  }
}

const unsuccessfulUpdate = (connectionParameters, errorMsg) => {
  return {
    type: 'FAILED_DATABASE_CONNECTION',
    connectionParameters,
    errorMsg
  }
}

const successfulUpdate = (connectionParameters) => {
  return {
    type: 'UPDATE_CONNECTION_PARAMETERS',
    connectionParameters
  }
}

export const editConnectionParameters = () => {
  return {
    type: 'EDIT_CONNECTION_PARAMETERS'
  }
}

export const cancelEditing = () => {
  return {
    type: 'CANCEL_EDIT_CONNECTION_PARAMETERS'
  }
}

export const desktopDisconnected = () => {
  return {
    type: 'DESKTOP_DISCONNECTED'
  }
}
