import { ServerList, Server } from './../model/server.model';
export class ServersState {
  serverList: ServerList;
  serverPage: ServerPage;
}

export class ServerPage {
  pageData: Server[];
  pageSize: number;
  filter: ServerFilter;
}

export class ServerFilter {
  filter: string;
  filterSet: string[];
  filteredDataSet: Server[];
}

export const getServerList = (state: ServersState): ServerList =>
  state.serverList;

export const getServerArray = (state: ServerList): Server[] => state.servers;

export const getServerArrayLength = (state: Server[]): number => state.length;

export const getServerPage = (state: ServersState): ServerPage =>
  state.serverPage;

export const getServerPageData = (state: ServerPage): Server[] =>
  state.pageData;

export const getServerFilter = (state: ServerPage): ServerFilter =>
  state.filter;

export const getServerFilterDataSetLength = (state: ServerFilter): number =>
  state.filteredDataSet.length;
