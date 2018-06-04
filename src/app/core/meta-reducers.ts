import { ActionReducer, MetaReducer, Action } from '@ngrx/store';
import { AuthActionTypes } from '../state/actions/auth-actions';
import { AppState } from '../state/app.state';

// console.log all actions
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

function logout(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    return reducer(
      action.type === AuthActionTypes.LOGOUT ? undefined : state,
      action
    );
  };
}

// uncomment this if you want console debugging of the store
// export const metaReducers: MetaReducer<any>[] = [logout, debug];

export const metaReducers: MetaReducer<any>[] = [logout];
