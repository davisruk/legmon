/************************************************
 * Smart Component that acts as control for
 * ServerListComponent and ServerDetailComponent
 * ***********************************************/

import { Component, OnInit } from '@angular/core';
import {
  AppState,
  selectServerFilteredDataSetLength,
  selectServerPageData,
  selectCurrentServer,
  selectServerPage
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
  RequestServerStatus,
  RequestServerStatusPayload,
  SetCurrentServer,
  SetCurrentServerPayload
} from '../../state/actions/servers-actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageEvent, Sort } from '@angular/material';
import { Server, ServerStatus } from 'src/app/model/server.model';
import { ServerPage } from '../../state/servers.state';

@Component({
  selector: 'app-servers-status-page',
  templateUrl: './servers-status-page.component.html',
  styleUrls: ['./servers-status-page.component.scss']
})
export class ServersStatusPageComponent implements OnInit {
  displayedColumns = ['name', 'hostname', 'port', 'url'];
  pageSizeOptions = [5, 10, 50];
  pageSize = 10;
  pageNumber = 0;
  numberOfServers$: Observable<number>;
  servers$: Observable<Server[]>;
  serverPage$: Observable<ServerPage>;
  currentServer$: Observable<Server>;

  constructor(private store: Store<AppState>) {
    this.store.dispatch(new LoadServers({}));
    this.numberOfServers$ = this.store.select(
      selectServerFilteredDataSetLength
    );
    this.currentServer$ = this.store.select(selectCurrentServer);
    this.servers$ = this.store.select(selectServerPageData);
    this.serverPage$ = this.store.select(selectServerPage);
  }

  ngOnInit() {}

  handlePageEvent(event: PageEvent) {
    if (this.pageSize !== event.pageSize) {
      this.pageSize = event.pageSize;
      this.changePageSize(event.pageSize);
    }
    this.changePage(event.pageIndex, event.pageSize);
  }

  handleFilterEvent(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    const payload: SetFilterPayload = { filter: filterValue };
    this.store.dispatch(new SetFilter(payload));
  }

  handleSortEvent(sort: Sort) {
    const payload: SortDataSetPayload = { sort: sort };
    this.store.dispatch(new SortDataSet(payload));
  }

  changePage(page: number, pageSize: number) {
    const payload: ChangePagePayload = { page: page, pageSize: pageSize };
    this.store.dispatch(new ChangePage(payload));
  }

  changePageSize(pageSize: number) {
    const payload: ChangePageSizePayload = { pageSize: pageSize };
    this.store.dispatch(new ChangePageSize(payload));
  }

  handleRowClick(server: Server) {
    console.log(server);
    const payload: RequestServerStatusPayload = {
      url: server.url,
      serverName: server.hostname,
      serverPort: server.port
    };

    this.store.dispatch(new RequestServerStatus(payload));
    const currentServerPayload: SetCurrentServerPayload = { server: server };
    this.store.dispatch(new SetCurrentServer(currentServerPayload));
  }
}
