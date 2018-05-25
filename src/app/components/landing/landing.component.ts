import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, selectThemeNameState } from '../../state/app.state';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  styleTheme: Observable<string>;

  constructor (private store: Store<AppState>) {
    this.styleTheme = store.select(selectThemeNameState);
  }


  ngOnInit() {
  }
}
