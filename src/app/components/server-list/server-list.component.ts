import { Server } from './../../model/server.model';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageEvent, Sort } from '@angular/material';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import { CdkDetailRowDirective } from '../../core/directives/cdk-detail-row.directive';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'void',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class ServerListComponent implements OnInit {
  @Input() displayedColumns: string[];
  @Input() pageSizeOptions: number[];
  @Input() pageSize: number;
  @Input() pageNumber: number;
  @Input() numberOfServers: number;
  @Input() servers: Server[];
  @Input() singleChildRowDetail: boolean;

  @Output('pageEvent') pageEvent = new EventEmitter<PageEvent>();
  @Output('filterEvent') filterEvent = new EventEmitter<string>();
  @Output('sortEvent') sortEvent = new EventEmitter<Sort>();
  @Output('rowClick') rowClick = new EventEmitter<Server>();
  @Output('refreshAll') refreshAll = new EventEmitter();
  @Output('refreshServer') refreshServer = new EventEmitter();

  selectedRow = '';
  private openedRow: CdkDetailRowDirective;

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

  onToggleChange(cdkDetailRow: CdkDetailRowDirective): void {
    if (
      this.singleChildRowDetail &&
      this.openedRow &&
      this.openedRow.expanded
    ) {
      this.openedRow.toggle();
    }
    this.openedRow = cdkDetailRow.expanded ? cdkDetailRow : undefined;
  }
}
