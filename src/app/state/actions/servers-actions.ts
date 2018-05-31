import { Action } from '@ngrx/store';
import { Sort } from '@angular/material';
import { ServerStatus, Server } from '../../model/server.model';

export enum ServersActionTypes {
  LOAD_SERVERS = '[Servers] Load Servers',
  LOAD_SERVERS_SUCCESS = '[Servers] Load Servers Success',
  LOAD_SERVERS_FAILURE = '[Servers] Load Servers Failure',
  CHANGE_PAGE = '[Servers] Change Page',
  CHANGE_PAGE_SIZE = '[Servers] Change Page Size',
  SET_FILTER = '[Servers] Set Filter',
  SORT_DATA_SET = '[Servers] Sort Data Set',
  REQUEST_SERVER_STATUS = '[Servers] Request Server Status',
  REQUEST_SERVER_STATUS_SUCCESS = '[Servers] Request Server Status Success',
  REQUEST_SERVER_STATUS_FAILURE = '[Servers] Request Server Status Failure',
  SET_CURRENT_SERVER = '[Servers] Set Current Server',
  SET_SERVER_STATUS_LOADING = '[Servers] Set Server Status Loading'
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

export class SortDataSetPayload {
  readonly sort: Sort;
}
export class SortDataSet implements Action {
  readonly type: string = ServersActionTypes.SORT_DATA_SET;
  constructor(public payload: any) {}
}

export class RequestServerStatusPayload {
  readonly url: string;
  readonly serverName: string;
  readonly serverPort: string;
}

export class RequestServerStatus implements Action {
  readonly type: string = ServersActionTypes.REQUEST_SERVER_STATUS;
  constructor(public payload: any) {}
}

export class RequestServerStatusSuccessPayload {
  readonly originalRequest: RequestServerStatusPayload;
  readonly serverStatus: ServerStatus;
}

export class RequestServerStatusSuccess implements Action {
  readonly type: string = ServersActionTypes.REQUEST_SERVER_STATUS_SUCCESS;
  constructor(public payload: any) {}
}

export class RequestServerStatusFailure implements Action {
  readonly type: string = ServersActionTypes.REQUEST_SERVER_STATUS_FAILURE;
  constructor(public payload: any) {}
}

export class SetCurrentServerPayload {
  readonly server: Server;
}

export class SetCurrentServer implements Action {
  readonly type: string = ServersActionTypes.SET_CURRENT_SERVER;
  constructor(public payload: any) {}
}

export class SetServerStatusLoadingPayload {
  readonly servers: Server[];
}

export class SetServerStatusLoading implements Action {
  readonly type: string = ServersActionTypes.SET_SERVER_STATUS_LOADING;
  constructor(public payload: any) {}
}

export type All =
  | LoadServers
  | LoadServersSuccess
  | LoadServersFailure
  | ChangePage
  | ChangePageSize
  | SetFilter
  | SortDataSet
  | RequestServerStatus
  | RequestServerStatusSuccess
  | RequestServerStatusFailure
  | SetCurrentServer
  | SetServerStatusLoading;
