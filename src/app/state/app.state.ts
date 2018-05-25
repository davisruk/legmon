import { UIState } from '../state/ui.state';
import { AuthenticationState } from './authentication-state';
import * as auth from './reducers/auth-reducer';
import * as ui from './reducers/ui.reducer';
import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap
} from '@ngrx/store';
import * as fromAuthState from './authentication-state';
import * as fromUIState from '../state/ui.state';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router.state';

export interface AppState {
  ui: UIState;
  auth: AuthenticationState;
  router: RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<AppState> = {
  ui: ui.uiStateReducer,
  auth: auth.reducer,
  router: routerReducer
};

// -- top level state selectors --
export const selectAuthState = createFeatureSelector<AuthenticationState>(
  'auth'
);
export const selectUIState = createFeatureSelector<UIState>('ui');
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
