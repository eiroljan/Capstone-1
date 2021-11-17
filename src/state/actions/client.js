import { createAction } from 'redux-act';
import { toastr } from 'react-redux-toastr';

import { firebaseError, deleteLogo, getLogoUrl, uploadLogo } from 'utils';
import firebase from 'firebase.js';
import { checkUserData, AUTH_UPDATE_USER_DATA } from './auth';
import {
  fetchCollection,
  fetchDocument,
  createDocument,
  deleteDocument,
  updateDocument,
} from '../api';

export const CLIENT_FETCH_DATA_INIT = createAction('CLIENT_FETCH_DATA_INIT');
export const CLIENT_FETCH_DATA_SUCCESS = createAction(
  'CLIENT_FETCH_DATA_SUCCESS'
);
export const CLIENT_FETCH_DATA_FAIL = createAction('CLIENT_FETCH_DATA_FAIL');

export const CLIENT_DELETE_CLIENT_INIT = createAction('CLIENT_DELETE_CLIENT_INIT');
export const CLIENT_DELETE_CLIENT_SUCCESS = createAction(
  'CLIENT_DELETE_CLIENT_SUCCESS'
);
export const CLIENT_DELETE_CLIENT_FAIL = createAction('CLIENT_DELETE_CLIENT_FAIL');

export const CLIENT_CREATE_CLIENT_INIT = createAction('CLIENT_CREATE_CLIENT_INIT');
export const CLIENT_CREATE_CLIENT_SUCCESS = createAction(
  'CLIENT_CREATE_CLIENT_SUCCESS'
);
export const CLIENT_CREATE_CLIENT_FAIL = createAction('CLIENT_CREATE_CLIENT_FAIL');

export const CLIENT_MODIFY_CLIENT_INIT = createAction('CLIENT_MODIFY_CLIENT_INIT');
export const CLIENT_MODIFY_CLIENT_SUCCESS = createAction(
  'CLIENT_MODIFY_CLIENT_SUCCESS'
);
export const CLIENT_MODIFY_CLIENT_FAIL = createAction('CLIENT_MODIFY_CLIENT_FAIL');

export const CLIENT_CLEAN_UP = createAction('CLIENT_CLEAN_UP');

export const CLIENT_CLEAR_DATA_LOGOUT = createAction('CLIENT_CLEAR_DATA_LOGOUT');

export const CLIENT_ADD_client = createAction('CLIENT_ADD_client');

export const CLIENT_REMOVE_client = createAction('CLIENT_REMOVE_client');

export const fetchclients = (clientId = '') => {
  return async (dispatch, getState) => {
    dispatch(checkUserData());
    const { locale } = getState().preferences;
    const { id } = getState().auth.clientData;

    dispatch(CLIENT_FETCH_DATA_INIT());

    if (clientId) {
      let client;
      try {
        client = await fetchDocument('clients', clientId);
      } catch (error) {
        toastr.error('', error);
        return dispatch(CLIENT_FETCH_DATA_FAIL({ error }));
      }

      if (!client) {
        const errorMessage = firebaseError('clients.clientNotAvailable', locale);
        toastr.error('', errorMessage);
        return dispatch(CLIENT_FETCH_DATA_FAIL({ error: errorMessage }));
      }

      const clients = getState().clients.data;
      clients.push(client);

      return dispatch(
        CLIENT_FETCH_DATA_SUCCESS({
          data: clients,
        })
      );
    }

    let clients;

    try {
      clients = await fetchCollection('clients');
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(CLIENT_FETCH_DATA_FAIL({ error }));
    }

    return dispatch(
      CLIENT_FETCH_DATA_SUCCESS({
        data: clients.filter((client) => client.id !== id),
      })
    );
  };
};

export const deleteclient = (id) => {
  return async (dispatch, getState) => {
    dispatch(CLIENT_DELETE_CLIENT_INIT());
    const { locale } = getState().preferences;
    const { logoUrl } = getState()
      .clients.data.filter((client) => client.id === id)
      .pop();

    const deleteLogoTask = logoUrl ? deleteLogo(logoUrl, 'clients') : null;

    const deleteclientTask = deleteDocument('clients', id);

    try {
      await Promise.all([deleteLogoTask, deleteclientTask]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        CLIENT_DELETE_CLIENT_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'The client was deleted.');
    return dispatch(CLIENT_DELETE_CLIENT_SUCCESS({ id }));
  };
};

export const clearclientsDataLogout = () => {
  return (dispatch) => {
    dispatch(CLIENT_CLEAR_DATA_LOGOUT());
  };
};

export const createclient = ({
  year,
  birthcenter,
  region,
  address,
  createdAt,
  isAdmin,
}) => {
  return async (dispatch, getState) => {
    dispatch(CLIENT_CREATE_CLIENT_INIT());
    const { locale } = getState().preferences;

    let response;
    try {
      const createclientAuth = firebase
        .functions()
        .httpsCallable('httpsCreateclient');

      response = await createclientAuth({ email, isAdmin });
    } catch (error) {
      const errorMessage = firebaseError(error.message, locale);
      toastr.error('', errorMessage);
      return dispatch(
        CLIENT_CREATE_CLIENT_FAIL({
          error: errorMessage,
        })
      );
    }

    const { uid } = response.data;

    let uploadLogoTask = null;
    let logoUrl = null;
    
    const clientData = {
      year,
      birthcenter,
      region,
      address,
      createdAt,
      isAdmin,
      email,
      teams: [],
    };

    const createclientDbTask = createDocument('clients', uid, clientData);

    const actionCodeSettings = {
      url: process.env.REACT_APP_LOGIN_PAGE_URL,
      handleCodeInApp: true,
    };

    const sendSignInLinkToEmailTask = firebase
      .auth()
      .sendSignInLinkToEmail(email, actionCodeSettings);

    try {
      await Promise.all([
        uploadLogoTask,
        createclientDbTask,
        sendSignInLinkToEmailTask,
      ]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        CLIENT_CREATE_CLIENT_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'client created successfully');
    return dispatch(CLIENT_CREATE_CLIENT_SUCCESS({ client: response.data }));
  };
};

export const modifyclient = ({
  name,
  location,
  isAdmin,
  createdAt,
  id,
  isEditing,
  isProfile,
}) => {
  return async (dispatch, getState) => {
    dispatch(CLIENT_MODIFY_CLIENT_INIT());
    const { locale } = getState().preferences;
    const client = isProfile
      ? getState().auth.clientData
      : getState().clients.data.find((thisclient) => thisclient.id === id);
    const { logoUrl } = client;
    let deleteLogoTask;
    let uploadLogoTask;
    let newLogoUrl = null;
    

    const clientData = {
      name,
      location,
      createdAt,
      isAdmin: isAdmin || client.isAdmin,
      logoUrl: logoUrl || newLogoUrl,
    };
    const updateclientDbTask = updateDocument('clients', id, clientData);

    try {
      await Promise.all([deleteLogoTask, uploadLogoTask, updateclientDbTask]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        CLIENT_MODIFY_CLIENT_FAIL({
          error: errorMessage,
        })
      );
    }

    if (isProfile) {
      dispatch(AUTH_UPDATE_USER_DATA({ ...clientData, id }));
    }

    if (isProfile) {
      toastr.success('', 'Profile updated successfully');
    } else if (isEditing) {
      toastr.success('', 'client updated successfully');
    }

    return dispatch(CLIENT_MODIFY_CLIENT_SUCCESS({ client: clientData, id }));
  };
};

export const clientsCleanUp = () => (dispatch) => dispatch(CLIENT_CLEAN_UP());

export const removeStoreclient = (clientId) => (dispatch) =>
  dispatch(CLIENT_REMOVE_client({ clientId }));

export const addStoreclient = (client) => (dispatch) =>
  dispatch(CLIENT_ADD_client({ client }));
