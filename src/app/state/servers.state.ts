import { ServerList, Server } from './../model/server.model';
import { Sort } from '@angular/material';
import { List as ImmutableList } from 'immutable';

export class ServersState {
  serverList: ServerList;
  serverPage: ServerPage;
}

export class ServerPage {
  pageData: ImmutableList<Server>;
  pageSize: number;
  filter: ServerFilter;
  currentPage: number;
  currentSort: Sort;
  currentServer: Server;
}

export class ServerFilter {
  filter: string;
  filterSet: ImmutableList<string>;
  filteredDataSet: ImmutableList<Server>;
}

export const getServerList = (state: ServersState): ServerList =>
  state.serverList;

export const getServerArray = (state: ServerList): ImmutableList<Server> =>
  state.servers;

export const getServerArrayLength = (state: ImmutableList<Server>): number =>
  state.size;

export const getServerPage = (state: ServersState): ServerPage =>
  state.serverPage;

export const getServerPageData = (state: ServerPage): ImmutableList<Server> =>
  state.pageData;

export const getServerFilter = (state: ServerPage): ServerFilter =>
  state.filter;

export const getServerFilterDataSetLength = (state: ServerFilter): number =>
  state.filteredDataSet.size;

export const getServerCurrentPage = (state: ServerPage): number =>
  state.currentPage;

export const getCurrentServer = (state: ServerPage): Server =>
  state.currentServer;
