import { ServerList, Server } from './../model/server.model';
export class ServersState {
  serverList: ServerList;
  serverPage: ServerPage;
}

export class ServerPage {
  pageData: Server[];
  pageSize: number;
}

export const getServerList = (state: ServersState): ServerList =>
  state.serverList;

export const getServerArray = (state: ServerList): Server[] => state.servers;

export const getServerArrayLength = (state: Server[]): number => state.length;

export const getServerPage = (state: ServersState): ServerPage =>
  state.serverPage;

export const getServerPageData = (state: ServerPage): Server[] =>
  state.pageData;
