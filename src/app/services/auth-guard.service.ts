import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Store } from '@ngrx/store';
import { AppState, selectAuthenticated } from '../state/app.state';
import { map } from 'rxjs/operators';
import * as NavActions from '../state/actions/nav-actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public store: Store<AppState>, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.store.select(selectAuthenticated).pipe(
      map(auth => {
        if (!auth) {
          this.store.dispatch(
            new NavActions.Go({
              path: ['']
            })
          );
        }
        return auth;
      })
    );
  }
}
