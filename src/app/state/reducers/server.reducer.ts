import {
  ChangePagePayload,
  ChangePageSizePayload,
  SetFilterPayload,
  SortDataSetPayload,
  SortDataSet
} from './../actions/servers-actions';
import { Server } from './../../model/server.model';
import { ServersState } from '../servers.state';
import { Action } from '@ngrx/store';
import { ServersActionTypes, All } from '../actions/servers-actions';
import { Sort } from '@angular/material';

const initialState: ServersState = {
  serverList: { servers: [] },
  serverPage: {
    pageData: [],
    pageSize: 5,
    filter: { filter: '', filterSet: [], filteredDataSet: [] },
    currentPage: 0,
    currentSort: { active: null, direction: '' }
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
          currentPage: 0,
          currentSort: state.serverPage.currentSort,
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

function sortServers(servers: Server[], sort: Sort): Server[] {
  // sort the filtered data
  let sortedData: Server[];
  if (!sort.active || sort.direction === '') {
    sortedData = servers;
  } else {
    sortedData = servers.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'hostname':
          return compare(a.hostname, b.hostname, isAsc);
        case 'port':
          return compare(a.port, b.port, isAsc);
        default:
          return 0;
      }
    });
  }
  return sortedData;
}

function getStateWithSort(state: ServersState, sort: Sort): ServersState {
  // sort the filtered data
  const sortedData: Server[] = sortServers(
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
): ServersState {
  // if filter reset then return the base set
  const _pageSize = pageSize ? pageSize : state.serverPage.pageSize;
  const _page = page ? page : 0;
  if (filter == null || filter === undefined || filter.length === 0) {
    const sortedData: Server[] = sortServers(
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
        filter: {
          filter: '',
          filterSet: computeFilterSet(sortedData),
          filteredDataSet: sortedData
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

  const newState: ServersState = {
    serverList: state.serverList,
    serverPage: {
      pageData: getPage(filteredDataSet, _page, _pageSize),
      pageSize: _pageSize,
      currentPage: _page,
      currentSort: state.serverPage.currentSort,
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
