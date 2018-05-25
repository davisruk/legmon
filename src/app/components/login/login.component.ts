import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AppState,
  selectAuthState,
  selectAuthError,
  selectAuthUser,
  selectAuthenticated
} from '../../state/app.state';
import { Login } from '../../state/actions/auth-actions';
import { Observable } from 'rxjs';
import { AuthenticationState } from '../../state/authentication-state';
import * as NavActions from '../../state/actions/nav-actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User;
  errorMessage$: Observable<string> | null;

  constructor(private store: Store<AppState>) {
    this.errorMessage$ = store.select(selectAuthError);
  }

  ngOnInit() {
    this.user = new User();
  }

  onSubmit() {
    const payload = {
      email: this.user.email,
      password: this.user.password
    };

    this.store.dispatch(new Login(payload));
  }
}
