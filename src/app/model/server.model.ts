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
