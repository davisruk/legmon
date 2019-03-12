import { Action } from '@ngrx/store';
import { User } from '../../model/user.model';

export enum RegistrationActionTypes {
  REGISTER_USER = '[Registration] Register User',
  REGISTER_USER_SUCCESS = '[Registration] Success',
  REGISTER_USER_FAILURE = '[Registration] Failure'
}

export class RegisterUserPayload {
  user: User;
}

export class RegisterUser implements Action {
  readonly type: string = RegistrationActionTypes.REGISTER_USER;
  constructor(public payload: any) {}
}

export class RegisterUserSuccess implements Action {
  readonly type: string = RegistrationActionTypes.REGISTER_USER_SUCCESS;
  constructor(public payload: RegisterUserSuccessPayload) {}
}
export class RegisterUserSuccessPayload {
  user: User;
}

export class RegisterUserFailure implements Action {
  readonly type: string = RegistrationActionTypes.REGISTER_USER_FAILURE;
  constructor(public payload: any) {}
}

export type All = RegisterUser | RegisterUserSuccess | RegisterUserFailure;
