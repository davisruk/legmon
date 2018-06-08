import { List as ImmutableList } from 'immutable';
export class Server {
  details: ServerImportData;
  id: number;
  environments: string;
  name: string;
  hostname: string;
  port: string;
  url;
  statusLoading: boolean;
  status?: ServerStatus;
}

export class ServerList {
  servers: ImmutableList<Server>;
}

export class ServerStatus {
  lastChecked: number;
  dataStale: boolean;
  status: Status;
}

interface ParametersMap {
  [key: string]: string;
}

class Status {
  message: ServerMessage;
  available: boolean;
  currentStatus: string;
  deployments: Deployment[];
  label?: string;
}

class ServerMessage {
  code: string;
  level: string;
  messageDefault: string;
  parameters: ParametersMap;
}

class Deployment {
  deploymentName: string;
  deployed: string;
}

class ServerImportData {
  environment: string;
  status: string;
  machineType: string;
  location: string;
  serverName: string;
  os: string;
  vcpu: string;
  ram: string;
  vlan: string;
  ip: string;
  storage: string;
  datastore: string;
  drsCluster: string;
  componentsDeployed: string;
}

export enum ComponentTypes {
  UIS = 'Columbus UIS Servers',
  EAS = 'Columbus EAS Servers',
  SP_EAS = 'StockPlus EAS Servers',
  SP_BRIDGE = 'StockPlus Bridge Servers',
  OPT_EAS = 'Optimus EAS Servers',
  OPT_BRIDGE = 'Optimus Bridge Servers',
  OPT_TALEND = 'Optimus/PCE Talend Application/Database Server',
  EPS_BRIDGE = 'EPS Bridge Servers',
  OFF_BRIDGE = 'Offline Bridge Servers',
  HA_PROXY = 'HA Proxy',
  RESIP = 'RESIP',
  MD_WS = 'Master Data Web Services',
  MD_REP = 'Master Data Reporting Services',
  REP = 'Reporting Services',
  BOOTS_TALEND = 'TSF-N/Boots Talend Application/Database Server',
  TSFZ_TALEND = 'TSF-Z Talend Application/Database Server',
  MIGRATION = 'Migration Server',
  IMS_DCA = 'IMS DCA Server',
  BI = 'BI Application',
  SPOTFIRE = 'Spotfire Web Player',
  SPOTFIRE_GG = 'Spotfire Admin & GoldenGate Server',
  NP_MIGRATION = 'Nexphase / SmartScript Migration Servers',
  COLUMBUS_DB = 'Columbus DB Servers',
  DYNATRACE = 'Dynatrace Server'
}

export class ServerPortMap {
  portMap: Map<string, string>;
}

export const serverPorts: ServerPortMap = {
  portMap: new Map([
    [ComponentTypes.UIS, '80'],
    [ComponentTypes.EAS, '4080'],
    [ComponentTypes.SP_EAS, '3080'],
    [ComponentTypes.SP_BRIDGE, '3080'],
    [ComponentTypes.OPT_BRIDGE, '3080'],
    [ComponentTypes.EPS_BRIDGE, '3080'],
    [ComponentTypes.OFF_BRIDGE, '31415'],
    [ComponentTypes.HA_PROXY, '31415']
  ])
};
