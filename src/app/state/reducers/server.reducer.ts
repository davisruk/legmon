import {
  ChangePagePayload,
  ChangePageSizePayload
} from './../actions/servers-actions';
import { Server } from './../../model/server.model';
import { ServersState } from '../servers.state';
import { Action } from '@ngrx/store';
import { ServersActionTypes, All } from '../actions/servers-actions';

const initialState: ServersState = {
  serverList: { servers: [] },
  serverPage: { pageData: [], pageSize: 5 }
};

export function serverStateReducer(
  state: ServersState = initialState,
  action: All
) {
  switch (action.type) {
    case ServersActionTypes.LOAD_SERVERS_SUCCESS: {
      const servers: Server[] = action.payload.servers;
      return {
        serverList: { servers: servers },
        serverPage: {
          pageData: servers.slice(0, state.serverPage.pageSize),
          pageSize: state.serverPage.pageSize
        }
      };
    }
    case ServersActionTypes.CHANGE_PAGE: {
      const payload: ChangePagePayload = action.payload as ChangePagePayload;
      return {
        serverList: state.serverList,
        serverPage: {
          pageData: getPage(
            state.serverList.servers,
            payload.page,
            payload.pageSize
          ),
          pageSize: payload.pageSize
        }
      };
    }
    case ServersActionTypes.CHANGE_PAGE_SIZE: {
      const payload: ChangePageSizePayload = action.payload as ChangePageSizePayload;
      return {
        serverList: state.serverList,
        serverPage: {
          pageData: getPage(state.serverList.servers, 0, payload.pageSize),
          pageSize: payload.pageSize
        }
      };
    }
    default:
      return state;
  }
}

function getPage(servers: Server[], page: number, pageSize: number): Server[] {
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  return servers.slice(startIndex, endIndex);
}
