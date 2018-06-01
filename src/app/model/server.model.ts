export class Server {
  environments: string;
  name: string;
  hostname: string;
  port: string;
  url;
  serverStatusLoading: boolean;
  status?: ServerStatus;
}

export class ServerList {
  servers: Server[];
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
