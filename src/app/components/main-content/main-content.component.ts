import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, selectThemeNameState } from '../../state/app.state';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  styleTheme: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.styleTheme = store.select(selectThemeNameState);
  }

  ngOnInit() {}
}
