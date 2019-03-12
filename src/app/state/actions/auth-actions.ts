import { Action } from '@ngrx/store';
import { User } from 'src/app/model/user.model';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  LOGOUT = '[Auth] Logout',
  LOGOUT_SUCCESS = '[Auth] Logout Success'
}

export class Login implements Action {
  readonly type: string = AuthActionTypes.LOGIN;
  constructor(public payload: any) {}
}

export class LoginSuccess implements Action {
  readonly type: string = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: LoginSuccessPayload) {}
}
export class LoginSuccessPayload {
  token: string;
  email: string;
}

export class LoginFailure implements Action {
  readonly type: string = AuthActionTypes.LOGIN_FAILURE;
  constructor(public payload: any) {}
}

export class Logout implements Action {
  readonly type: string = AuthActionTypes.LOGOUT;
  constructor(public payload: any) {}
}

export class LogoutSuccess implements Action {
  readonly type: string = AuthActionTypes.LOGOUT_SUCCESS;
  constructor(public payload: any) {}
}

export type All = Login | LoginSuccess | LoginFailure | Logout | LogoutSuccess;
