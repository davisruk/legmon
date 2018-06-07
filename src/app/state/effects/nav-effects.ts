import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Effect, ofType, Actions } from '@ngrx/effects';
import * as RouterActions from '../actions/nav-actions';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class RouterEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location
  ) {}

  @Effect({ dispatch: false })
  navigate$ = this.actions$.pipe(
    ofType(RouterActions.GO),
    map((action: RouterActions.Go) => action.payload),
    tap(({ path, query: queryParams, extras }) =>
      this.router.navigate(path, { queryParams, ...extras })
    )
  );

  @Effect({ dispatch: false })
  back$ = this.actions$.pipe(
    ofType(RouterActions.BACK),
    tap(() => this.location.back())
  );

  @Effect({ dispatch: false })
  forward$ = this.actions$.pipe(
    ofType(RouterActions.FORWARD),
    tap(() => this.location.forward())
  );

  /*
  @Effect({ dispatch: false })
  cancel$ = this.actions$.pipe(
    ofType(ROUTER_CANCEL),
    map((action: RouterCancelAction<RouterStateUrl>) => action.payload),
    tap(_ => {
      console.log('Cancel Effect Called');
      this.router.navigate(['']);
    })
  );
*/
}
