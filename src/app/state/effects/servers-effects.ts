import {
  LoadServers,
  LoadServersSuccess,
  ServersActionTypes,
  LoadServersFailure,
  RequestServerStatus,
  RequestServerStatusSuccess,
  RequestServerStatusFailure,
  RequestServerStatusSuccessPayload
} from './../actions/servers-actions';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ServersService } from '../../services/servers.service';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

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
            console.log(servers);
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
  requestServerStatus$: Observable<any> = this.actions
    .ofType(ServersActionTypes.REQUEST_SERVER_STATUS)
    .pipe(
      map((action: RequestServerStatus) => action.payload),
      switchMap(payload => {
        return this.serversService
          .requestServerStatus(
            payload.serverName,
            payload.serverPort,
            payload.url
          )
          .pipe(
            map(serverStatus => {
              console.log(serverStatus);
              const successPayload: RequestServerStatusSuccessPayload = {
                originalRequest: payload,
                serverStatus: serverStatus
              };
              return new RequestServerStatusSuccess(successPayload);
            }),
            catchError(error => {
              console.log(error);
              return of(new RequestServerStatusFailure({ error: error }));
            })
          );
      })
    );
}
