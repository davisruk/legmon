import { Action } from '@ngrx/store';
import { Sort } from '@angular/material';
import { Server } from '../../model/server.model';

export enum ServersActionTypes {
  LOAD_SERVERS = '[Servers] Load Servers',
  LOAD_SERVERS_SUCCESS = '[Servers] Load Servers Success',
  LOAD_SERVERS_FAILURE = '[Servers] Load Servers Failure',
  CHANGE_PAGE = '[Servers] Change Page',
  CHANGE_PAGE_SIZE = '[Servers] Change Page Size',
  SET_FILTER = '[Servers] Set Filter',
  SORT_DATA_SET = '[Servers] Sort Data Set',
  CHECK_SERVER_STATUS = '[Servers] Check Server Status',
  CHECK_SERVER_STATUS_SUCCESS = '[Servers] Check Server Status Success',
  CHECK_SERVER_STATUS_FAILURE = '[Servers] Check Server Status Failure',
  SET_CURRENT_SERVER = '[Servers] Set Current Server',
  SET_SERVER_STATUS_LOADING = '[Servers] Set Server Status Loading',
  RESET_STATE = '[Servers] Reset State',
  UPLOAD_SERVERS_FILE = '[Servers] Upload Servers File',
  UPLOAD_SERVERS_FILE_SUCCESS = '[Servers] Upload Servers File Success',
  UPLOAD_SERVERS_FILE_FAILURE = '[Servers] Upload Servers File Failure',
  CHECK_STATUS_FOR_SERVERS = '[Servers] Check Status For Servers'
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

export class SetCurrentServerPayload {
  readonly server: Server;
}

export class SetCurrentServer implements Action {
  readonly type: string = ServersActionTypes.SET_CURRENT_SERVER;
  constructor(public payload: any) {}
}

export class SetServerStatusLoadingPayload {
  readonly servers: Server[];
  readonly isLoading: boolean;
}

export class SetServerStatusLoading implements Action {
  readonly type: string = ServersActionTypes.SET_SERVER_STATUS_LOADING;
  constructor(public payload: any) {}
}

export class CheckServerStatusPayload {
  readonly server: Server;
}

export class CheckServerStatus implements Action {
  readonly type: string = ServersActionTypes.CHECK_SERVER_STATUS;
  constructor(public payload: any) {}
}

export class CheckServerStatusSuccessPayload {
  readonly server: Server;
}

export class CheckServerStatusSuccess implements Action {
  readonly type: string = ServersActionTypes.CHECK_SERVER_STATUS_SUCCESS;
  constructor(public payload: any) {}
}

export class CheckServerStatusFailure implements Action {
  readonly type: string = ServersActionTypes.CHECK_SERVER_STATUS_FAILURE;
  constructor(public payload: any) {}
}

export class ResetState implements Action {
  readonly type: string = ServersActionTypes.RESET_STATE;
  constructor(public payload: any) {}
}

export class UploadServersFile implements Action {
  readonly type: string = ServersActionTypes.UPLOAD_SERVERS_FILE;
  constructor(public payload: any) {}
}

export class UploadServersFilePayload {
  readonly fileName: string;
  readonly currentServerFileContents: Server[];
}

export class UploadServersFileSuccess implements Action {
  readonly type: string = ServersActionTypes.UPLOAD_SERVERS_FILE_SUCCESS;
  constructor(public payload: any) {}
}

export class UploadServersFileFailure implements Action {
  readonly type: string = ServersActionTypes.UPLOAD_SERVERS_FILE_FAILURE;
  constructor(public payload: any) {}
}

export class CheckStatusForServersPayload {
  readonly servers: Server[];
}

export class CheckStatusForServers implements Action {
  readonly type: string = ServersActionTypes.CHECK_STATUS_FOR_SERVERS;
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
  | CheckServerStatus
  | CheckServerStatusSuccess
  | CheckServerStatusFailure
  | SetCurrentServer
  | SetServerStatusLoading
  | ResetState
  | UploadServersFile
  | UploadServersFileSuccess
  | UploadServersFileFailure
  | CheckStatusForServers;
