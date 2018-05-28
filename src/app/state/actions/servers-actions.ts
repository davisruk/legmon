import { Action } from '@ngrx/store';

export enum ServersActionTypes {
  LOAD_SERVERS = '[Servers] Load Servers',
  LOAD_SERVERS_SUCCESS = '[Servers] Load Servers Success',
  LOAD_SERVERS_FAILURE = '[Servers] Load Servers Failure',
  CHANGE_PAGE = '[Servers] Change Page',
  CHANGE_PAGE_SIZE = '[Servers] Change Page Size',
  SET_FILTER = '[Servers] Set Filter'
}

export class LoadServers implements Action {
  readonly type: string = ServersActionTypes.LOAD_SERVERS;
  constructor(public payload: any) {}
}

export class LoadServersSuccess implements Action {
  readonly type: string = ServersActionTypes.LOAD_SERVERS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadServersFailure implements Action {
  readonly type: string = ServersActionTypes.LOAD_SERVERS_FAILURE;
  constructor(public payload: any) {}
}

export class ChangePagePayload {
  readonly page: number;
  readonly pageSize: number;
}

export class ChangePage implements Action {
  readonly type: string = ServersActionTypes.CHANGE_PAGE;
  constructor(public payload: any) {}
}

export class ChangePageSizePayload {
  readonly pageSize: number;
}

export class ChangePageSize implements Action {
  readonly type: string = ServersActionTypes.CHANGE_PAGE_SIZE;
  constructor(public payload: any) {}
}

export class SetFilterPayload {
  readonly filter: string;
}
export class SetFilter implements Action {
  readonly type: string = ServersActionTypes.SET_FILTER;
  constructor(public payload: any) {}
}

export type All =
  | LoadServers
  | LoadServersSuccess
  | LoadServersFailure
  | ChangePage
  | ChangePageSize
  | SetFilter;
