import { Server } from './../../model/server.model';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageEvent, Sort } from '@angular/material';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss']
})
export class ServerListComponent implements OnInit {
  @Input() displayedColumns: string[];
  @Input() pageSizeOptions: number[];
  @Input() pageSize: number;
  @Input() pageNumber: number;
  @Input() numberOfServers: number;
  @Input() servers: Server[];
  @Output('pageEvent') pageEvent = new EventEmitter<PageEvent>();
  @Output('filterEvent') filterEvent = new EventEmitter<string>();
  @Output('sortEvent') sortEvent = new EventEmitter<Sort>();
  @Output('rowClick') rowClick = new EventEmitter<Server>();
  @Output('refreshAll') refreshAll = new EventEmitter();
  @Output('refreshServer') refreshServer = new EventEmitter();

  selectedRow = '';

  ngOnInit() {
    const inputBox = document.getElementById('filterInput');
    const typeahead = fromEvent(inputBox, 'input').pipe(
      map((e: KeyboardEvent) => (<HTMLTextAreaElement>e.target).value),
      debounceTime(300),
      distinctUntilChanged()
    );

    typeahead.subscribe(data => {
      this.applyFilter(data);
    });
  }

  onPageEvent(event: PageEvent) {
    this.pageEvent.emit(event);
  }

  applyFilter(filterValue: string) {
    this.filterEvent.emit(filterValue);
  }

  sortData(sort: Sort) {
    this.sortEvent.emit(sort);
  }

  highlight(row: Server) {
    this.rowClick.emit(row);
    this.selectedRow = row.hostname;
  }

  useHighlightClass(row: Server): boolean {
    return this.selectedRow === row.hostname;
  }

  handleRefresh() {
    this.refreshAll.emit();
  }

  handleRefreshServer(server: Server) {
    this.refreshServer.emit(server);
  }
}
