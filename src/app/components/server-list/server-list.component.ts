import { Server } from './../../model/server.model';
import {
  selectServerList,
  selectServerArray,
  selectServerArrayLength,
  selectServerFilteredDataSetLength,
  selectThemeNameState
} from './../../state/app.state';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  Renderer2,
  ElementRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { LoadServers } from '../../state/actions/servers-actions';
import { Observable, of, fromEvent } from 'rxjs';
import { ServerList } from '../../model/server.model';
import {
  combineLatest,
  map,
  debounceTime,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';
import {
  PageEvent,
  Sort,
  CanColor,
  mixinColor,
  ThemePalette
} from '@angular/material';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss']
})
export class ServerListComponent implements OnInit, CanColor {
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
  @Input() color: ThemePalette;
  selectedRow = '';

  constructor(public renderer: Renderer2, public _elementRef: ElementRef) {}

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
}
export const _MyComponentMixinBase = mixinColor(ServerListComponent, 'accent');
