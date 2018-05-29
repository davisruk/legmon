import { selectServerPageData } from './../app.state';
import {
  ChangePage,
  ChangePagePayload,
  ChangePageSizePayload,
  ChangePageSize,
  SetFilterPayload,
  SetFilter,
  SortDataSetPayload,
  SortDataSet
} from './../actions/servers-actions';
import { Server } from './../../model/server.model';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { AppState, selectServerPage } from '../app.state';
import { Store } from '@ngrx/store';
import { Sort } from '@angular/material';

export class ServersDataSource implements DataSource<Server> {
  constructor(private store: Store<AppState>) {}
  connect(): Observable<Server[]> {
    return this.store.select(selectServerPageData);
  }

  disconnect(): void {}

  changePage(page: number, pageSize: number) {
    const payload: ChangePagePayload = { page: page, pageSize: pageSize };
    this.store.dispatch(new ChangePage(payload));
  }

  changePageSize(pageSize: number) {
    const payload: ChangePageSizePayload = { pageSize: pageSize };
    this.store.dispatch(new ChangePageSize(payload));
  }

  applyFilter(value: string) {
    const payload: SetFilterPayload = { filter: value };
    this.store.dispatch(new SetFilter(payload));
  }

  sort(sort: Sort) {
    const payload: SortDataSetPayload = { sort: sort };
    this.store.dispatch(new SortDataSet(payload));
  }
}
