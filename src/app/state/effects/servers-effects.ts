import {
  LoadServers,
  LoadServersSuccess,
  ServersActionTypes,
  LoadServersFailure,
  CheckServerStatus,
  CheckServerStatusSuccessPayload,
  CheckServerStatusSuccess,
  CheckServerStatusFailure,
  UploadServersFile,
  UploadServersFileSuccess,
  UploadServersFileFailure,
  CheckStatusForServers,
  SetServerStatusLoadingPayload,
  SetServerStatusLoading,
  CheckStatusForServersPayload,
  CheckServerStatusPayload
} from './../actions/servers-actions';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ServersService } from '../../services/servers.service';
import {
  map,
  switchMap,
  catchError,
  mergeMap,
  tap,
  flatMap
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Server, ServerStatus } from 'src/app/model/server.model';
import { Action } from '@ngrx/store';

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
      // use mergeMap here as it is likely there will be many calls and we want all the responses
      // switchMap will only give us back the latest emitted value so we'd lose previous responses
      mergeMap(payload => {
        return this.serversService
          .requestServerStatus(
            payload.server.hostname,
            payload.server.port,
            payload.server.url
          )
          .pipe(
            map(
              serverStatus => {
                const server: Server = Object.assign({}, payload.server);
                if (
                  serverStatus.status.currentStatus === 'UNRESPONSIVE' &&
                  server.status !== undefined &&
                  server.status.status.currentStatus !== 'UNRESPONSIVE'
                ) {
                  serverStatus.dataStale = true;
                  server.status = serverStatus;
                } else {
                  server.status = serverStatus;
                  server.status.dataStale = false;
                }
                server.status.lastChecked = Date.now();

                const successPayload: CheckServerStatusSuccessPayload = {
                  server: server
                };
                return new CheckServerStatusSuccess(successPayload);
              },
              catchError(error => {
                console.log(error);
                return of(new CheckServerStatusFailure({ error: error }));
              })
            )
          );
      })
    );

  @Effect()
  uploadServer$: Observable<any> = this.actions
    .ofType(ServersActionTypes.UPLOAD_SERVERS_FILE)
    .pipe(
      map((action: UploadServersFile) => action.payload),
      switchMap(payload => {
        return this.serversService.uploadServersFile(payload.fileName).pipe(
          map(newServers => {
            this.serversService.updateServers(
              newServers,
              payload.currentServerFileContents
            );
            return new UploadServersFileSuccess({ servers: newServers });
          }),
          catchError(error => {
            console.log(error);
            return of(new UploadServersFileFailure({ error: error }));
          })
        );
      })
    );

  // action splitter - creates multiple actions from a single action
  @Effect()
  checkStatusForServers$: Observable<any> = this.actions
    .ofType(ServersActionTypes.CHECK_STATUS_FOR_SERVERS)
    .pipe(
      flatMap((action: CheckStatusForServers) => {
        const actions: Action[] = [];
        const loadingPayload: SetServerStatusLoadingPayload = {
          servers: action.payload.servers,
          isLoading: true
        };
        actions.push(new SetServerStatusLoading(loadingPayload));
        // create server status check action for each server
        action.payload.servers.forEach(server => {
          const checkStatusPayload: CheckServerStatusPayload = {
            server: server
          };
          actions.push(new CheckServerStatus(checkStatusPayload));
        });
        return actions;
      })
    );
}
