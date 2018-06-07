import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import {
  Observable,
  throwError,
  of,
  Subscription,
  timer,
  forkJoin
} from 'rxjs';
import { Server, ServerStatus } from 'src/app/model/server.model';
import { map, catchError, delay, timeout, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServersService {
  private _baseUrl = 'http://localhost:3000/';
  constructor(private http: HttpClient) {}

  public loadServers(): Observable<Server[]> {
    return this.http
      .get<Server[]>(this._baseUrl + 'servers')
      .pipe(catchError(this.handleError));
  }

  public updateServers(newServers: Server[], oldServers: Server[]) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    newServers.forEach(server => {
      if (oldServers.find(s => s.id === server.id)) {
        this.http
          .put(this._baseUrl + 'servers/' + server.id, server, httpOptions)
          .pipe(catchError(this.handleError))
          .subscribe((serverResponse: Server) => {
            console.log(`${serverResponse.hostname} updated in db`);
          });
      } else {
        this.http
          .post(this._baseUrl + 'servers/', server, httpOptions)
          .pipe(catchError(this.handleError))
          .subscribe((serverResponse: Server) => {
            console.log(`${serverResponse.hostname} added to db`);
          });
      }
    });
  }

  public uploadServersFile(fileName: string): Observable<Server[]> {
    const file = 'assets/servers-master.csv';
    return this.http.get(file, { responseType: 'text' }).pipe(
      map(res => {
        return this.convertData(this.extractData(res));
      }),
      catchError(this.handleError)
    );
  }

  extractData(res: any): any {
    const csvData = res;
    const allTextLines = csvData.split(/\r\n|\n/);
    const headers = allTextLines[0].split(',');
    const lines = [];

    for (let i = 0; i < allTextLines.length; i++) {
      // split content based on comma
      const data = allTextLines[i].split(',');
      if (data.length === headers.length) {
        const tarr = [];
        for (let j = 0; j < headers.length; j++) {
          tarr.push(data[j]);
        }
        lines.push(tarr);
      }
    }
    console.log(lines);
    return lines;
  }

  convertData(lines: string[][]): Server[] {
    const servers: Server[] = [];
    let id = 1;
    lines.forEach((line: string[]) => {
      const server: Server = {
        id: id,
        environments: line[0],
        name: line[4],
        hostname: line[9],
        port: '8180',
        url:
          '/application-status-monitor/rest/applicationstatusmonitor/status.json?include_version=true',
        statusLoading: false
      };
      id++;
      servers.push(server);
    });
    servers.splice(0, 1);
    return servers;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  private randomIntBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  public requestServerStatus(
    server: string,
    port: string,
    url: string
  ): Observable<ServerStatus> {
    const validStatus: ServerStatus = {
      dataStale: false,
      lastChecked: 0,
      status: {
        message: {
          code: 'A1',
          level: 'One',
          messageDefault: 'default',
          parameters: { test1: 'test', test2: 'test' }
        },
        available: true,
        currentStatus: 'Online',
        deployments: [{ deploymentName: 'Deployment 1', deployed: 'true' }],
        label: 'X-Leg'
      }
    };

    const errorStatus: ServerStatus = {
      dataStale: false,
      lastChecked: 0,
      status: {
        message: {
          code: 'ERR',
          level: '',
          messageDefault: '',
          parameters: { err: '' }
        },
        available: false,
        currentStatus: 'UNRESPONSIVE',
        deployments: [{ deploymentName: 'None', deployed: 'false' }],
        label: ''
      }
    };

    return this.randomIntBetween(1, 2) === 1
      ? of(validStatus).pipe(delay(this.randomIntBetween(2000, 5000)))
      : of(errorStatus).pipe(delay(this.randomIntBetween(2000, 5000)));
    /*
    return this.http
      .get<ServerStatus>('http://' + server + ':' + port + url)
      .pipe(
        timeout(10000),
        catchError(error => {
          if (error.error instanceof ErrorEvent) {
            errorStatus.status.message.messageDefault = `An error occurred:', ${
              error.error.message
            }`;
          } else {
            errorStatus.status.message.messageDefault =
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`;
          }
          return of(errorStatus);
        })
      );
*/
  }
}
