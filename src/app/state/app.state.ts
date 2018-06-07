import { ServersState } from './servers.state';
import { UIState } from '../state/ui.state';
import { AuthenticationState } from './authentication-state';
import * as auth from './reducers/auth-reducer';
import * as ui from './reducers/ui.reducer';
import * as servers from './reducers/server.reducer';
import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap
} from '@ngrx/store';

import * as fromAuthState from './authentication-state';
import * as fromUIState from '../state/ui.state';
import * as fromServersState from '../state/servers.state';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router.state';

export interface AppState {
  ui: UIState;
  auth: AuthenticationState;
  router: RouterReducerState<RouterStateUrl>;
  servers: ServersState;
}

export const reducers: ActionReducerMap<AppState> = {
  ui: ui.uiStateReducer,
  auth: auth.reducer,
  router: routerReducer,
  servers: servers.serverStateReducer
};

// -- top level state selectors --
export const selectAuthState = createFeatureSelector<AuthenticationState>(
  'auth'
);
export const selectUIState = createFeatureSelector<UIState>('ui');
export const selectServersState = createFeatureSelector<ServersState>(
  'servers'
);
export const selectRouterState = createFeatureSelector<
  RouterReducerState<RouterStateUrl>
>('router');

// -- auth selectors --
export const selectAuthenticated = createSelector(
  selectAuthState,
  fromAuthState.isAuthenticated
);

export const selectAuthError = createSelector(
  selectAuthState,
  fromAuthState.getErrorMessage
);

export const selectAuthUser = createSelector(
  selectAuthState,
  fromAuthState.getUser
);

// -- ui selectors --
export const selectThemeState = createSelector(
  selectUIState,
  fromUIState.getThemeState
);

export const selectThemeNameState = createSelector(
  selectThemeState,
  fromUIState.getThemeNameState
);

export const selectThemeCanCloseState = createSelector(
  selectThemeState,
  fromUIState.getCloseState
);

// server selectors
export const selectServerList = createSelector(
  selectServersState,
  fromServersState.getServerList
);

export const selectServerPage = createSelector(
  selectServersState,
  fromServersState.getServerPage
);

export const selectServerPageData = createSelector(
  selectServerPage,
  fromServersState.getServerPageData
);

export const selectServerArray = createSelector(
  selectServerList,
  fromServersState.getServerArray
);

export const selectServerArrayLength = createSelector(
  selectServerArray,
  fromServersState.getServerArrayLength
);

export const selectServerFilter = createSelector(
  selectServerPage,
  fromServersState.getServerFilter
);

export const selectServerFilteredDataSet = createSelector(
  selectServerFilter,
  fromServersState.getServerFilteredDataSet
);

export const selectServerFilteredDataSetLength = createSelector(
  selectServerFilter,
  fromServersState.getServerFilterDataSetLength
);

export const selectServerCurrentPage = createSelector(
  selectServerPage,
  fromServersState.getServerCurrentPage
);

export const selectCurrentServer = createSelector(
  selectServerPage,
  fromServersState.getCurrentServer
);
