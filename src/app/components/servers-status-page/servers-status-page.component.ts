/************************************************
 * Smart Component that acts as control for
 * ServerListComponent and ServerDetailComponent
 * ***********************************************/

import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AppState,
  selectServerFilteredDataSetLength,
  selectServerPageData,
  selectCurrentServer,
  selectServerPage,
  selectServerFilter,
  selectServerFilteredDataSet,
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
import {
  Observable,
  interval,
  timer,
  from,
  Subscription,
  of,
  Subject
} from 'rxjs';
import { PageEvent, Sort } from '@angular/material';
import { Server, ServerStatus } from 'src/app/model/server.model';
import { ServerPage } from '../../state/servers.state';
import { filter, map, takeWhile, tap, takeUntil, take } from 'rxjs/operators';
import { List as ImmutableList } from 'immutable';
@Component({
  selector: 'app-servers-status-page',
  templateUrl: './servers-status-page.component.html',
  styleUrls: ['./servers-status-page.component.scss']
})
export class ServersStatusPageComponent implements OnInit, OnDestroy {
  displayedColumns = ['env', 'name', 'hostname', 'port', 'status'];
  pageSizeOptions = [5, 10, 50];
  servers: Server[] = [];
  runInitServerCheck = true;
  showSpinner = true;
  serversUnderCheck: string[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentPage: ServerPage;

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

    this.store
      .select(selectServerPage)
      .pipe(
        takeUntil(this.destroy$),
        tap(pg => {
          this.currentPage = pg;
          this.servers = pg.pageData.toArray();
          if (this.servers.length > 0 && this.runInitServerCheck) {
            this.runInitServerCheck = false;
            this.checkServersStatus();
          }
        })
      )
      .subscribe();
  }

  ngOnInit() {
    interval(10000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => this.checkServersStatus());
  }

  ngOnDestroy(): void {
    // cancel all subscriptions
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    // reset the server page state
    this.store.dispatch(new ResetState({}));
  }

  cancelCheckServersStatus() {
    const servers = this.buildServerListToCancel();
    if (servers.length > 0) {
      const payload: SetServerStatusLoadingPayload = {
        servers: servers,
        isLoading: false
      };
      this.store.dispatch(new SetServerStatusLoading(payload));
    }
  }

  checkServersStatus() {
    this.cancelCheckServersStatus();
    const servers = this.buildServerListToCheck();
    if (servers.length > 0) {
      const payload: SetServerStatusLoadingPayload = {
        servers: servers,
        isLoading: true
      };

      this.store.dispatch(new SetServerStatusLoading(payload));
      servers.forEach((server: Server) => {
        const checkStatusPayload: CheckServerStatusPayload = {
          server: server
        };
        this.store.dispatch(new CheckServerStatus(checkStatusPayload));
      });
    }
  }

  buildServerListToCheck(): Server[] {
    const servers: Server[] = [];
    from(this.servers)
      .pipe(
        filter(
          (s: Server) =>
            s.status === undefined || s.status.lastChecked < Date.now() - 9000
        )
      )
      .subscribe(s => {
        servers.push(s);
      });
    return servers;
  }

  buildServerListToCancel(): Server[] {
    const servers: Server[] = [];
    from(this.servers)
      .pipe(filter((s: Server) => s.statusLoading))
      .subscribe(s => {
        servers.push(s);
      });
    return servers;
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
    this.checkServersStatus();
  }

  handleSortEvent(sort: Sort) {
    const payload: SortDataSetPayload = { sort: sort };
    this.store.dispatch(new SortDataSet(payload));
    this.checkServersStatus();
  }

  changePage(page: number, pageSize: number) {
    const payload: ChangePagePayload = { page: page, pageSize: pageSize };
    this.store.dispatch(new ChangePage(payload));
    this.checkServersStatus();
  }

  changePageSize(pageSize: number) {
    const payload: ChangePageSizePayload = { pageSize: pageSize };
    this.store.dispatch(new ChangePageSize(payload));
    this.checkServersStatus();
  }

  handleRowClick(server: Server) {
    const currentServerPayload: SetCurrentServerPayload = { server: server };
    this.store.dispatch(new SetCurrentServer(currentServerPayload));
  }
}
