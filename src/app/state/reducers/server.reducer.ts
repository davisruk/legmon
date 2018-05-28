import {
  ChangePagePayload,
  ChangePageSizePayload,
  SetFilterPayload
} from './../actions/servers-actions';
import { Server } from './../../model/server.model';
import { ServersState } from '../servers.state';
import { Action } from '@ngrx/store';
import { ServersActionTypes, All } from '../actions/servers-actions';

const initialState: ServersState = {
  serverList: { servers: [] },
  serverPage: {
    pageData: [],
    pageSize: 5,
    filter: { filter: '', filterSet: [], filteredDataSet: [] }
  }
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
          pageSize: state.serverPage.pageSize,
          filter: {
            filter: '',
            filterSet: computeFilterSet(servers),
            filteredDataSet: servers
          }
        }
      };
    }

    case ServersActionTypes.CHANGE_PAGE: {
      const payload: ChangePagePayload = action.payload as ChangePagePayload;
      return getPageWithFilter(
        state,
        state.serverPage.filter.filter,
        payload.page,
        payload.pageSize
      );
    }

    case ServersActionTypes.CHANGE_PAGE_SIZE: {
      const payload: ChangePageSizePayload = action.payload as ChangePageSizePayload;
      return getPageWithFilter(
        state,
        state.serverPage.filter.filter,
        0,
        payload.pageSize
      );
    }

    case ServersActionTypes.SET_FILTER: {
      const payload: SetFilterPayload = action.payload as SetFilterPayload;
      return getPageWithFilter(state, payload.filter);
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

function computeFilterSet(servers: Server[]): string[] {
  const retVal: string[] = [];
  servers.forEach((s: Server, i: number, sa: Server[]) => {
    retVal.push((s.hostname + s.name + s.port).toLowerCase());
  });
  return retVal;
}

function getPageWithFilter(
  state: ServersState,
  filter: string,
  page?: number,
  pageSize?: number
) {
  // if filter reset then return the base set
  const _pageSize = pageSize ? pageSize : state.serverPage.pageSize;
  const _page = page ? page : 0;
  if (filter == null || filter === undefined || filter.length === 0) {
    return {
      serverList: state.serverList,
      serverPage: {
        pageData: getPage(state.serverList.servers, _page, _pageSize),
        pageSize: _pageSize,
        filter: {
          filter: '',
          filterSet: computeFilterSet(state.serverList.servers),
          filteredDataSet: state.serverList.servers
        }
      }
    };
  }

  // work out filtered dataset
  const filteredDataSet: Server[] = [];
  let i;
  for (i = 0; i < state.serverPage.filter.filterSet.length; i++) {
    if (state.serverPage.filter.filterSet[i].includes(filter)) {
      filteredDataSet.push(state.serverList.servers[i]);
    }
  }

  return {
    serverList: state.serverList,
    serverPage: {
      pageData: getPage(
        state.serverPage.filter.filteredDataSet,
        _page,
        _pageSize
      ),
      pageSize: _pageSize,
      filter: {
        filter: filter,
        filterSet: computeFilterSet(state.serverList.servers),
        filteredDataSet: filteredDataSet
      }
    }
  };
}
