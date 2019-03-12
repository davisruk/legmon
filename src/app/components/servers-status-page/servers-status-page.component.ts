/************************************************
 * Smart Component that acts as control for
 * ServerListComponent and ServerDetailComponent
 * ***********************************************/

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  AppState,
  selectServerPage,
  selectServerPageData
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
  CheckStatusForServers,
  CheckStatusForAllServersPayload,
  CheckStatusForAllServers,
  CheckStatusForServerPayload,
  CheckStatusForServer
} from '../../state/actions/servers-actions';
import { Store } from '@ngrx/store';
import { interval, Subject, merge, Observable } from 'rxjs';
import { PageEvent, Sort } from '@angular/material';
import { Server } from '../../model/server.model';
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
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentPage$: Observable<ServerPage>;
  readonly DELAY = 10000;

  constructor(
    private store: Store<AppState>,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initialiseViewObservables();
    this.initialiseServers();
  }

  ngOnDestroy(): void {
    // cancel all subscriptions
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    // reset the server page state
    this.store.dispatch(new ResetState({}));
  }

  initialiseViewObservables() {
    // run a status check every x seconds
    const timerOb$: Observable<number> = interval(this.DELAY).pipe(
      tap(_ => this.checkServersStatus())
    );

    // initialise the view's Observable used for change detection
    // use share operator so only 1 subscription is created by view
    this.currentPage$ = this.store.select(selectServerPage).pipe(share());

    // merge the two observables for easy management of unsubscribe
    merge(this.currentPage$, timerOb$)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  initialiseServers() {
    this.store.dispatch(new LoadServers({}));
    // once servers are loaded, check the current page for status
    this.store
      .select(selectServerPageData)
      .pipe(filter(servers => servers.size > 0))
      .subscribe(_ => {
        // force change detection so that there's no gap between
        // spinner being shown and the data table being populated
        this.changeDetector.detectChanges();
        this.checkServersStatus();
      });
  }

  checkServersStatus() {
    const payload: CheckStatusForServersPayload = {
      elapsedTimeAllowance: this.DELAY
    };

    this.store.dispatch(new CheckStatusForServers(payload));
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
    const payload: CheckStatusForAllServersPayload = {
      elapsedTimeAllowance: this.DELAY
    };

    this.store.dispatch(new CheckStatusForAllServers(payload));
  }

  handleRefreshServer(server: Server) {
    const payload: CheckStatusForServerPayload = {
      id: server.id,
      elapsedTimeAllowance: this.DELAY
    };

    this.store.dispatch(new CheckStatusForServer(payload));
  }
}
