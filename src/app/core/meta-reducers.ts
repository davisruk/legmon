import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AuthActionTypes } from '../state/actions/auth-actions';
import { environment } from '../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';

// console.log all actions
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export function logout(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    return reducer(
      action.type === AuthActionTypes.LOGOUT ? undefined : state,
      action
    );
  };
}

// uncomment this if you want console debugging of the store
// export const metaReducers: MetaReducer<any>[] = [logout, storeFreeze, debug];

export const metaReducers: MetaReducer<any>[] = !environment.production
  ? [storeFreeze, logout]
  : [logout];
