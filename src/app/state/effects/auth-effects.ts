import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import {
  AuthActionTypes,
  Login,
  LoginSuccess,
  LoginFailure,
  Logout,
  LogoutSuccess
} from '../actions/auth-actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions: Actions,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  // ngrx effects listen for actions from the Store, perform some
  // logic then dispatch a new action
  // Component -> Action -> Effect -> Reducer -> Store -> Component
  // use Effects to access services so that components only ever
  // interact with the store
  @Effect()
  Login$: Observable<any> = this.actions.ofType(AuthActionTypes.LOGIN).pipe(
    map((action: Login) => action.payload),
    switchMap(payload => {
      return this.authService
        .authenticate(payload.email, payload.password)
        .pipe(
          map(user => {
            console.log(user);
            return new LoginSuccess({
              token: user.token,
              email: payload.email
            });
          }),
          catchError(error => {
            console.log(error);
            return of(new LoginFailure({ error: error }));
          })
        );
    })
  );

  @Effect({ dispatch: false })
  LoginSuccess$: Observable<any> = this.actions
    .ofType(AuthActionTypes.LOGIN_SUCCESS)
    .pipe(
      map((action: LoginSuccess) => action.payload),
      tap(payload => {
        localStorage.setItem('token', payload.token);
        this.router.navigateByUrl('/content');
      })
    );

  @Effect({ dispatch: false })
  LoginFailure$: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_FAILURE)
  );

  @Effect()
  Logout$: Observable<any> = this.actions.ofType(AuthActionTypes.LOGOUT).pipe(
    map((action: Logout) => {
      localStorage.removeItem('token');
      return new LogoutSuccess({});
    })
  );

  @Effect({ dispatch: false })
  LogoutSuccess$: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGOUT_SUCCESS),
    map((action: LogoutSuccess) => {
      this.router.navigateByUrl('');
    })
  );
}
