import {
  ChangePagePayload,
  ChangePageSizePayload,
  SetFilterPayload,
  SortDataSetPayload,
  SortDataSet,
  CheckServerStatusPayload
} from './../actions/servers-actions';
import { Server, ServerStatus } from './../../model/server.model';
import { ServersState } from '../servers.state';
import { Action } from '@ngrx/store';
import { ServersActionTypes, All } from '../actions/servers-actions';
import { Sort } from '@angular/material';
import { List as ImmutableList } from 'immutable';

const initialState: ServersState = {
  serverList: { servers: ImmutableList<Server>() },
  serverPage: {
    pageData: ImmutableList<Server>(),
    pageSize: 5,
    filter: {
      filter: '',
      filterSet: ImmutableList<string>(),
      filteredDataSet: ImmutableList<Server>()
    },
    currentPage: 0,
    currentSort: { active: null, direction: '' },
    currentServer: {
      environments: '',
      name: '',
      hostname: '',
      port: '',
      url: '',
      statusLoading: false
    }
  }
};

export function serverStateReducer(
  state: ServersState = initialState,
  action: All
) {
  switch (action.type) {
    case ServersActionTypes.LOAD_SERVERS_SUCCESS: {
      const servers: Server[] = action.payload.servers;
      const stateServers: ImmutableList<Server> = ImmutableList<Server>(
        servers
      );
      return {
        serverList: { servers: stateServers },
        serverPage: {
          pageData: ImmutableList<Server>(
            servers.slice(0, state.serverPage.pageSize)
          ),
          pageSize: state.serverPage.pageSize,
          currentPage: 0,
          currentSort: state.serverPage.currentSort,
          currentServer: state.serverPage.currentServer,
          filter: {
            filter: '',
            filterSet: computeFilterSet(stateServers),
            filteredDataSet: ImmutableList<Server>(servers)
          }
        }
      };
    }

    case ServersActionTypes.CHECK_SERVER_STATUS_FAILURE: {
      console.log('CHECK SERVER STATUS ERROR - Should never get here!!');
      return state;
    }

    case ServersActionTypes.SET_SERVER_STATUS_LOADING: {
      const servers: Server[] = action.payload.servers;
      return setServersStateLoading(state, servers, action.payload.isLoading);
    }

    case ServersActionTypes.CHECK_SERVER_STATUS_SUCCESS: {
      const s: Server = action.payload.server;
      return checkServerStatusSuccess(state, s);
    }

    case ServersActionTypes.SET_CURRENT_SERVER: {
      const currentServer: Server = action.payload.server;
      const server: Server = state.serverList.servers.find(s => {
        return s.hostname === currentServer.hostname;
      });

      return {
        serverList: state.serverList,
        serverPage: {
          pageData: state.serverPage.pageData,
          pageSize: state.serverPage.pageSize,
          currentPage: state.serverPage.currentPage,
          currentSort: state.serverPage.currentSort,
          currentServer: Object.assign({}, server),
          filter: {
            filter: state.serverPage.filter.filter,
            filterSet: computeFilterSet(state.serverList.servers),
            filteredDataSet: state.serverPage.filter.filteredDataSet
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
        state.serverPage.currentPage,
        payload.pageSize
      );
    }

    case ServersActionTypes.SET_FILTER: {
      const payload: SetFilterPayload = action.payload as SetFilterPayload;
      return getPageWithFilter(
        state,
        payload.filter,
        state.serverPage.currentPage,
        state.serverPage.pageSize
      );
    }

    case ServersActionTypes.SORT_DATA_SET: {
      const payload: SortDataSetPayload = action.payload as SortDataSetPayload;
      return getStateWithSort(state, payload.sort);
    }
    default:
      return state;
  }
}

function sortServers(
  servers: ImmutableList<Server>,
  sort: Sort
): ImmutableList<Server> {
  // sort the filtered data
  let sortedData: ImmutableList<Server>;
  if (!sort.active || sort.direction === '') {
    sortedData = servers;
  } else {
    sortedData = ImmutableList<Server>(
      servers.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'env':
            return compare(a.environments, b.environments, isAsc);
          case 'name':
            return compare(a.name, b.name, isAsc);
          case 'hostname':
            return compare(a.hostname, b.hostname, isAsc);
          case 'port':
            return compare(a.port, b.port, isAsc);
          case 'status':
            return compare(
              a.status.status.currentStatus,
              b.status.status.currentStatus,
              isAsc
            );
          default:
            return 0;
        }
      })
    );
  }
  return sortedData;
}

function getStateWithSort(state: ServersState, sort: Sort): ServersState {
  // sort the filtered data
  const sortedData: ImmutableList<Server> = sortServers(
    state.serverPage.filter.filteredDataSet,
    sort
  );
  return {
    serverList: state.serverList,
    serverPage: {
      pageData: getPage(
        sortedData,
        state.serverPage.currentPage,
        state.serverPage.pageSize
      ),
      pageSize: state.serverPage.pageSize,
      currentPage: state.serverPage.currentPage,
      currentSort: sort,
      currentServer: state.serverPage.currentServer,
      filter: {
        filter: state.serverPage.filter.filter,
        filterSet: computeFilterSet(state.serverList.servers),
        filteredDataSet: sortedData
      }
    }
  };
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function getPage(
  servers: ImmutableList<Server>,
  page: number,
  pageSize: number
): ImmutableList<Server> {
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  return ImmutableList<Server>(servers.slice(startIndex, endIndex));
}

function computeFilterSet(
  servers: ImmutableList<Server>
): ImmutableList<string> {
  const retVal: string[] = [];
  servers.forEach((s: Server) => {
    let statusFilter = '';
    if (s.status !== undefined && s.status.status !== undefined) {
      statusFilter = s.status.status.currentStatus;
    }
    retVal.push((s.hostname + s.name + s.port + statusFilter).toLowerCase());
  });
  return ImmutableList<string>(retVal);
}

function getPageWithFilter(
  state: ServersState,
  filter: string,
  page?: number,
  pageSize?: number
): ServersState {
  // if filter reset then return the base set
  const _pageSize = pageSize ? pageSize : state.serverPage.pageSize;
  let _page = page ? page : 0;
  if (filter == null || filter === undefined || filter.length === 0) {
    const sortedData: ImmutableList<Server> = sortServers(
      state.serverList.servers,
      state.serverPage.currentSort
    );
    return {
      serverList: state.serverList,
      serverPage: {
        pageData: getPage(sortedData, _page, _pageSize),
        pageSize: _pageSize,
        currentPage: _page,
        currentSort: state.serverPage.currentSort,
        currentServer: state.serverPage.currentServer,
        filter: {
          filter: '',
          filterSet: computeFilterSet(sortedData),
          filteredDataSet: sortedData
        }
      }
    };
  }

  // work out filtered dataset
  const filteredServers: Server[] = [];
  let i;
  for (i = 0; i < state.serverPage.filter.filterSet.size; i++) {
    const item: string = state.serverPage.filter.filterSet.get(i);
    if (item.includes(filter)) {
      filteredServers.push(state.serverList.servers.get(i));
    }
  }

  const maxPage = Math.floor(filteredServers.length / _pageSize);
  _page = _page >= maxPage ? maxPage : _page;

  const filteredDataSet = ImmutableList<Server>(filteredServers);
  const newState: ServersState = {
    serverList: state.serverList,
    serverPage: {
      pageData: getPage(filteredDataSet, _page, _pageSize),
      pageSize: _pageSize,
      currentPage: _page,
      currentSort: state.serverPage.currentSort,
      currentServer: state.serverPage.currentServer,
      filter: {
        filter: filter,
        filterSet: computeFilterSet(state.serverList.servers),
        filteredDataSet: filteredDataSet
      }
    }
  };

  if (state.serverPage.currentSort.active) {
    return getStateWithSort(newState, state.serverPage.currentSort);
  }
  return newState;
}

function setServersStateLoading(
  state: ServersState,
  servers: Server[],
  status: boolean
) {
  if (servers === undefined || servers == null || servers.length === 0) {
    return state;
  }
  let newPageData: ImmutableList<Server> = ImmutableList(
    state.serverPage.pageData
  );
  let newServerList: ImmutableList<Server> = ImmutableList(
    state.serverList.servers
  );
  let newFilteredDataSet: ImmutableList<Server> = ImmutableList(
    state.serverPage.filter.filteredDataSet
  );

  servers.forEach(server => {
    const stateServer: Server = getServerInServerList(server, newPageData);
    stateServer.statusLoading = status;
    newPageData = updateServerInServerList(stateServer, newPageData);
    newServerList = updateServerInServerList(stateServer, newServerList);
    newFilteredDataSet = updateServerInServerList(
      stateServer,
      newFilteredDataSet
    );
  });

  return {
    serverList: { servers: newServerList },
    serverPage: {
      pageData: newPageData,
      pageSize: state.serverPage.pageSize,
      currentPage: state.serverPage.currentPage,
      currentSort: state.serverPage.currentSort,
      currentServer: state.serverPage.currentServer,
      filter: {
        filter: state.serverPage.filter.filter,
        filterSet: computeFilterSet(newServerList),
        filteredDataSet: newFilteredDataSet
      }
    }
  };
}

function checkServerStatusSuccess(state: ServersState, server: Server) {
  if (server === undefined || server == null) {
    return state;
  }

  let newPageData: ImmutableList<Server> = ImmutableList(
    state.serverPage.pageData
  );
  let newServerList: ImmutableList<Server> = ImmutableList(
    state.serverList.servers
  );
  let newFilteredDataSet: ImmutableList<Server> = ImmutableList(
    state.serverPage.filter.filteredDataSet
  );

  const stateServer: Server = getServerInServerList(server, newPageData);
  stateServer.status = { ...server.status };
  stateServer.statusLoading = false;
  newPageData = updateServerInServerList(stateServer, newPageData);
  newServerList = updateServerInServerList(stateServer, newServerList);
  newFilteredDataSet = updateServerInServerList(
    stateServer,
    newFilteredDataSet
  );

  let newCurrentServer: Server;
  const useStateCurrentServer =
    state.serverPage.currentServer &&
    state.serverPage.currentServer.hostname === server.hostname;
  if (useStateCurrentServer) {
    newCurrentServer = Object.assign({}, state.serverPage.currentServer);
    newCurrentServer.status = server.status;
  }

  return {
    serverList: { servers: newServerList },
    serverPage: {
      pageData: newPageData,
      pageSize: state.serverPage.pageSize,
      currentPage: state.serverPage.currentPage,
      currentSort: state.serverPage.currentSort,
      currentServer: useStateCurrentServer
        ? state.serverPage.currentServer
        : state.serverPage.currentServer,
      filter: {
        filter: state.serverPage.filter.filter,
        filterSet: computeFilterSet(newServerList),
        filteredDataSet: newFilteredDataSet
      }
    }
  };
}

function getServerInServerList(
  server: Server,
  list: ImmutableList<Server>
): Server {
  const i: number = list.findIndex((item: Server) => {
    return item.hostname === server.hostname;
  });
  return Object.assign({}, list.get(i));
}

function updateServerInServerList(
  server: Server,
  list: ImmutableList<Server>
): ImmutableList<Server> {
  const i: number = list.findIndex((item: Server) => {
    return item.hostname === server.hostname;
  });
  return list.update(i, val => server);
}
