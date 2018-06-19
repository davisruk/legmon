/************************************************
 * Smart Component that acts as control for
 * ServerListComponent and ServerDetailComponent
 * ***********************************************/

import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AppState,
  selectServerPage,
  selectServerArray
} from '../../state/app.state';
import {
  LoadServers,
  SortDataSetPayload,
  SortDataSet,
  ChangePagePayload,
  ChangePage,
  SetFilterPayload,
  SetFilter,
  ChangePageSizePayload,
  ChangePageSize,
  CheckServerStatus,
  CheckServerStatusPayload,
  SetCurrentServer,
  SetCurrentServerPayload,
  SetServerStatusLoading,
  SetServerStatusLoadingPayload,
  ResetState
} from '../../state/actions/servers-actions';
import { Store } from '@ngrx/store';
import { List as ImmutableList } from 'immutable';
import { interval, from, Subject, merge, Subscription, Observable } from 'rxjs';
import { PageEvent, Sort } from '@angular/material';
import { Server } from 'src/app/model/server.model';
import { ServerPage } from '../../state/servers.state';
import { filter, tap, takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-servers-status-page',
  templateUrl: './servers-status-page.component.html',
  styleUrls: ['./servers-status-page.component.scss']
})
export class ServersStatusPageComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'env',
    'name',
    'hostname',
    'port',
    'status',
    'refreshServer'
  ];
  pageSizeOptions = [5, 10, 20, 50];
  servers: Server[] = [];
  runInitServerCheck = true;
  showSpinner = true;
  serversUnderCheck: string[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentPage: ServerPage;
  readonly DELAY = 30000;
  constructor(private store: Store<AppState>) {
    this.store.dispatch(new LoadServers({}));

    // show the spinner until all servers are loaded
    const serversPopulated$: Subject<boolean> = new Subject<boolean>();

    this.store
      .select(selectServerArray)
      .pipe(
        takeUntil(serversPopulated$), // unsubscribe triggered
        filter(servers => servers.size > 0),
        tap(_ => {
          this.showSpinner = false;
          serversPopulated$.next(true); // trigger unsubscribe
        })
      )
      .subscribe();
  }

  ngOnInit() {
    // run a status check every x seconds
    const timerOb$: Observable<number> = interval(this.DELAY).pipe(
      tap(_ => this.checkServersStatus(this.servers))
    );

    // all store updates for the serverlist are handled here
    const serverPage$: Observable<ServerPage> = this.store
      .select(selectServerPage)
      .pipe(
        tap(pg => {
          this.currentPage = pg;
          this.servers = pg.pageData.toArray();
          // run an initial status check
          if (this.servers.length > 0 && this.runInitServerCheck) {
            this.runInitServerCheck = false;
            this.checkServersStatus(this.servers);
          }
        })
      );

    merge(serverPage$, timerOb$)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    // cancel all subscriptions
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    // reset the server page state
    this.store.dispatch(new ResetState({}));
  }

  checkServersStatus(serversToCheck: Server[], override?: boolean) {
    override = override === undefined ? false : override;
    const servers = this.buildServerListToCheck(serversToCheck, override);
    if (servers.length > 0) {
      const payload: SetServerStatusLoadingPayload = {
        servers: servers,
        isLoading: true
      };

      // set all servers to a loading status (for spinner)
      this.store.dispatch(new SetServerStatusLoading(payload));
      // check the status of each server
      servers.forEach((server: Server) => {
        const checkStatusPayload: CheckServerStatusPayload = {
          server: server
        };
        this.store.dispatch(new CheckServerStatus(checkStatusPayload));
      });
    }
  }

  buildServerListToCheck(servers: Server[], override?: boolean): Server[] {
    override = override === undefined ? false : override;
    // only add servers to check that have not been checked
    // or have not been checked in x seconds
    const retVal: Server[] = [];
    from(servers)
      .pipe(
        filter(
          (s: Server) =>
            (s.status === undefined ||
              s.status.lastChecked < Date.now() - this.DELAY ||
              override) &&
            !s.statusLoading
        )
      )
      .subscribe(s => {
        const newServer: Server = Object.assign({}, s);
        retVal.push(newServer);
      });
    return retVal;
  }

  handlePageEvent(event: PageEvent) {
    if (this.currentPage.pageSize !== event.pageSize) {
      this.changePageSize(event.pageSize);
    } else {
      this.changePage(event.pageIndex, event.pageSize);
    }
  }

  handleFilterEvent(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    const payload: SetFilterPayload = { filter: filterValue };
    this.store.dispatch(new SetFilter(payload));
    this.checkServersStatus(this.servers);
  }

  handleSortEvent(sort: Sort) {
    const payload: SortDataSetPayload = { sort: sort };
    this.store.dispatch(new SortDataSet(payload));
    this.checkServersStatus(this.servers);
  }

  changePage(page: number, pageSize: number) {
    const payload: ChangePagePayload = { page: page, pageSize: pageSize };
    this.store.dispatch(new ChangePage(payload));
    this.checkServersStatus(this.servers);
  }

  changePageSize(pageSize: number) {
    const payload: ChangePageSizePayload = { pageSize: pageSize };
    this.store.dispatch(new ChangePageSize(payload));
    this.checkServersStatus(this.servers);
  }

  handleRowClick(server: Server) {
    const currentServerPayload: SetCurrentServerPayload = { server: server };
    this.store.dispatch(new SetCurrentServer(currentServerPayload));
  }

  handleRefresh() {
    this.store
      .select(selectServerArray)
      .pipe(take(1))
      .subscribe(servers => {
        const checkServers: Server[] = this.buildServerListToCheck(
          servers.toArray(),
          true
        );
        this.checkServersStatus(checkServers, true);
      });
  }

  handleRefreshServer(server: Server) {
    this.checkServersStatus([server], true);
  }
}
