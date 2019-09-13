/*
 * BackendApiConnector's fetchers provide functions used to connect to API backend
 * All settings like BACKEND_API_URL, authenticationToken, error response handling etc.
 * are handled under the hood here so that anywhere else in the project can be
 * used one of simple functions requiring path, params, and afterSuccess callback.
 *
 */

import { connectionRefusedNotify } from './notifications';

import StoreAccessor from './StoreAccessor';
import { BACKEND_API_URL } from './constants';

function getAuthenticationToken() {
  return StoreAccessor.store.getState().backendApiConnector.authenticationToken;
}

function getLanguageLocale() {
  return StoreAccessor.store.getState().language.locale;
}

function apiFetch(method, config) {
  fetch(`${BACKEND_API_URL}${config.path}`, {
    method,
    body: JSON.stringify(config.body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Authentication-Token': getAuthenticationToken(),
      'Language-Locale': getLanguageLocale(),
    },
  })
    .then(result => result.json())
    .then(
      result => {
        // TO DO: Internet connection error (set noInternet: false)
        // TO DO: Wrong AccessToken response - render sign in form
        if (typeof config.afterSuccess === 'function') {
          config.afterSuccess(result);
        }
      },
      error => {
        // TO DO: Internet connection error (set noInternet: true)
        connectionRefusedNotify();
        if (typeof config.afterError === 'function') {
          config.afterError(error);
        }
      },
    );
}

export function apiDelete(config) {
  apiFetch('DELETE', config);
}

export function apiGet(config) {
  apiFetch('GET', config);
}

export function apiPost(config) {
  apiFetch('POST', config);
}
