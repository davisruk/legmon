import {
  LoadServers,
  LoadServersSuccess,
  ServersActionTypes,
  LoadServersFailure,
  CheckServersStatus,
  CheckServersStatusPayload,
  CheckServersStatusSuccess,
  CheckServersStatusSuccessPayload,
  CheckServersStatusFailure,
  CheckServerStatus,
  CheckServerStatusSuccessPayload,
  CheckServerStatusSuccess,
  CheckServerStatusFailure
} from './../actions/servers-actions';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ServersService } from '../../services/servers.service';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Server } from '../../model/server.model';

@Injectable()
export class ServersEffects {
  constructor(
    private actions: Actions,
    private serversService: ServersService
  ) {}

  // ngrx effects listen for actions from the Store, perform some
  // logic then dispatch a new action
  // Component -> Action -> Effect -> Reducer -> Store -> Component
  // use Effects to access services so that components only ever
  // interact with the store
  @Effect()
  loadServer$: Observable<any> = this.actions
    .ofType(ServersActionTypes.LOAD_SERVERS)
    .pipe(
      map((action: LoadServers) => action.payload),
      switchMap(payload => {
        return this.serversService.loadServers().pipe(
          map(servers => {
            return new LoadServersSuccess({ servers: servers });
          }),
          catchError(error => {
            console.log(error);
            return of(new LoadServersFailure({ error: error }));
          })
        );
      })
    );

  @Effect()
  checkServerStatus$: Observable<any> = this.actions
    .ofType(ServersActionTypes.CHECK_SERVER_STATUS)
    .pipe(
      map((action: CheckServerStatus) => action.payload),
      switchMap(payload => {
        return this.serversService
          .requestServerStatus(
            payload.server.hostname,
            payload.server.port,
            payload.server.url
          )
          .pipe(
            map(serverStatus => {
              console.log(serverStatus);
              if (
                serverStatus.status.currentStatus === 'UNRESPONSIVE' &&
                payload.server.status !== undefined &&
                payload.server.status.status.currentStatus !== 'UNRESPONSIVE'
              ) {
                payload.server.status.dataStale = true;
              } else {
                payload.server.status = serverStatus;
                payload.server.status.dataStale = false;
              }
              payload.server.status.lastChecked = Date.now();

              const successPayload: CheckServerStatusSuccessPayload = {
                server: payload.server
              };
              return new CheckServerStatusSuccess(successPayload);
            }),
            catchError(error => {
              console.log(error);
              return of(new CheckServerStatusFailure({ error: error }));
            })
          );
      })
    );

  @Effect()
  checkServersStatus$: Observable<any> = this.actions
    .ofType(ServersActionTypes.CHECK_SERVERS_STATUS)
    .pipe(
      map((action: CheckServersStatus) => action.payload),
      map(payload => {
        const checkPayload: CheckServersStatusPayload = payload as CheckServersStatusPayload;
        payload.servers.forEach((s: Server) => {
          /*
          let url: string = s.url;
          if (s.status && !s.status.dataStale) {
            url = 'error';
          }
*/
          this.serversService
            .requestServerStatus(s.hostname, s.port, s.url)
            .subscribe(status => {
              if (
                status.status.currentStatus === 'UNRESPONSIVE' &&
                s.status !== undefined &&
                s.status.status.currentStatus !== 'UNRESPONSIVE'
              ) {
                s.status.dataStale = true;
              } else {
                s.status = status;
                s.status.dataStale = false;
              }
              s.status.lastChecked = Date.now();
            });
        });
        const successPayload: CheckServersStatusSuccessPayload = {
          servers: payload.servers
        };
        return new CheckServersStatusSuccess(successPayload);
      }),
      catchError(error => {
        console.log(error);
        return of(new CheckServersStatusFailure({ error: error }));
      })
    );
}
