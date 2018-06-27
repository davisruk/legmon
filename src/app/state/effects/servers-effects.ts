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
  CheckServerStatusPayload,
  CheckStatusForAllServers,
  CheckStatusForServer
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
  flatMap,
  take,
  filter
} from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';
import { Server, ServerStatus } from 'src/app/model/server.model';
import { Action, Store } from '@ngrx/store';
import { AppState, selectServerPage, selectServerArray } from '../app.state';
import { ServerPage } from '../servers.state';

@Injectable()
export class ServersEffects {
  constructor(
    private actions: Actions,
    private serversService: ServersService,
    private store: Store<AppState>
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
        let actions: Action[];
        let servers: Server[];
        this.store
          .select(selectServerPage)
          .pipe(take(1))
          .subscribe((page: ServerPage) => {
            servers = this.buildServerListToCheck(
              page.pageData.toArray(),
              action.payload.elapsedTimeAllowance
            );
            actions = this.buildActionsForStatusCheck(servers);
          });
        return actions;
      })
    );

  @Effect()
  checkStatusForAllServers$: Observable<any> = this.actions
    .ofType(ServersActionTypes.CHECK_STATUS_FOR_ALL_SERVERS)
    .pipe(
      flatMap((action: CheckStatusForAllServers) => {
        let actions: Action[];
        let checkServers: Server[];
        this.store
          .select(selectServerArray)
          .pipe(take(1))
          .subscribe(servers => {
            checkServers = this.buildServerListToCheck(
              servers.toArray(),
              action.payload.elapsedTimeAllowance
            );
            actions = this.buildActionsForStatusCheck(checkServers);
          });
        return actions;
      })
    );

  @Effect()
  checkStatusForServer$: Observable<any> = this.actions
    .ofType(ServersActionTypes.CHECK_STATUS_FOR_SERVER)
    .pipe(
      flatMap((action: CheckStatusForServer) => {
        let actions: Action[];
        let checkServers: Server[];
        this.store
          .select(selectServerArray)
          .pipe(take(1))
          .subscribe(servers => {
            const i: number = servers.findIndex(
              (item: Server) => item.id === action.payload.id
            );
            const server: Server =
              i === -1 ? undefined : Object.assign({}, servers.get(i));
            checkServers = this.buildServerListToCheck(
              [server],
              action.payload.elapsedTimeAllowance
            );
            actions = this.buildActionsForStatusCheck(checkServers);
          });
        return actions;
      })
    );

  buildServerListToCheck(
    servers: Server[],
    sinceLastCheckedAllowance: number
  ): Server[] {
    // only add servers to check that have never been checked
    // or have not been checked in this.DELAY seconds
    // or are currently being checked
    const retVal: Server[] = [];

    if (servers == null) {
      return retVal;
    }

    from(servers)
      .pipe(
        filter(
          (s: Server) =>
            (s.status === undefined ||
              s.status.lastChecked < Date.now() - sinceLastCheckedAllowance) &&
            !s.statusLoading
        )
      )
      .subscribe(s => {
        // servers are from the store and therefore immutable
        // side effect / reducer should probably do this
        const newServer: Server = Object.assign({}, s);
        retVal.push(newServer);
      });
    return retVal;
  }

  buildActionsForStatusCheck(servers: Server[]): Action[] {
    const actions: Action[] = [];
    const loadingPayload: SetServerStatusLoadingPayload = {
      servers: servers,
      isLoading: true
    };
    actions.push(new SetServerStatusLoading(loadingPayload));
    // create server status check action for each server
    servers.forEach(server => {
      const checkStatusPayload: CheckServerStatusPayload = {
        server: server
      };
      actions.push(new CheckServerStatus(checkStatusPayload));
    });
    return actions;
  }
}
