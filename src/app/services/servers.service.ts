import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { Server, ServerStatus } from 'src/app/model/server.model';
import { map, catchError } from 'rxjs/operators';

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

  public requestServerStatus(
    server: string,
    port: string,
    url: string
  ): Observable<ServerStatus> {
    /*
    const status: ServerStatus = {
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
    return of(status);
  */
    const errorStatus: ServerStatus = {
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

    return this.http
      .get<ServerStatus>('http://' + server + ':' + port + url)
      .pipe(
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
  }
}
