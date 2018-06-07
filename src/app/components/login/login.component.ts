import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { Store } from '@ngrx/store';
import { AppState, selectAuthError } from '../../state/app.state';
import { Login } from '../../state/actions/auth-actions';
import { Observable } from 'rxjs';

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
