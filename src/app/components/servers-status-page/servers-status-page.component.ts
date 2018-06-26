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
  SetCurrentServer,
  SetCurrentServerPayload,
  ResetState,
  CheckStatusForServersPayload,
  CheckStatusForServers
} from '../../state/actions/servers-actions';
import { Store } from '@ngrx/store';
import { interval, from, Subject, merge, Observable } from 'rxjs';
import { PageEvent, Sort } from '@angular/material';
import { Server } from 'src/app/model/server.model';
import { ServerPage } from '../../state/servers.state';
import { filter, tap, takeUntil, take, share } from 'rxjs/operators';

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
  runInitServerCheck = true;
  showSpinner = true;
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentPage$: Observable<ServerPage>;
  readonly DELAY = 10000;

  constructor(private store: Store<AppState>) {
    // load the servers
    this.store.dispatch(new LoadServers({}));
  }

  ngOnInit() {
    this.initialiseServers();

    // run a status check every x seconds
    const timerOb$: Observable<number> = interval(this.DELAY).pipe(
      tap(_ => this.checkServersStatus())
    );

    // initialise the view's Observable
    this.currentPage$ = this.store.select(selectServerPage).pipe(share());

    // merge the two observables for easy management of unsubscribe
    merge(this.currentPage$, timerOb$)
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

  initialiseServers() {
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
          serversPopulated$.unsubscribe();
        })
      )
      .subscribe();

    // get status for first servers in first page
    const initDone$: Subject<boolean> = new Subject<boolean>();
    this.store
      .select(selectServerPage)
      .pipe(
        takeUntil(initDone$),
        filter(pg => pg.pageData.size > 0) // do nothing until the page is populated
      )
      .subscribe(_ => {
        initDone$.next(true);
        this.checkServersStatus(); // now check the status
        initDone$.unsubscribe();
      });
  }

  // could argue that this logic belongs in a side effect
  // along with the buildServerListToCheck logic
  checkServersStatus(serversToCheck?: Server[], override?: boolean) {
    if (serversToCheck === undefined) {
      this.store
        .select(selectServerPage)
        .pipe(take(1))
        .subscribe(
          (page: ServerPage) => (serversToCheck = page.pageData.toArray())
        );
    }
    override = override === undefined ? false : override;
    const servers = this.buildServerListToCheck(serversToCheck, override);

    if (servers.length > 0) {
      const payload: CheckStatusForServersPayload = {
        servers: servers
      };

      // notify store that these servers should be checked
      // side effect will split the action into 1 setStatusLoading
      // and multiple checkServerStatus actions
      this.store.dispatch(new CheckStatusForServers(payload));
    }
  }

  buildServerListToCheck(servers: Server[], override?: boolean): Server[] {
    override = override === undefined ? false : override;
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
              s.status.lastChecked < Date.now() - this.DELAY ||
              override) &&
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

  handlePageEvent(event: PageEvent) {
    this.store
      .select(selectServerPage)
      .pipe(take(1))
      .subscribe((page: ServerPage) => {
        if (page.pageSize !== event.pageSize) {
          this.changePageSize(event.pageSize);
        } else {
          this.changePage(event.pageIndex, event.pageSize);
        }
      });
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
