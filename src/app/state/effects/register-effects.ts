import { Injectable } from '@angular/core';
import { RegisterService } from '../../services/register-service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  RegistrationActionTypes,
  RegisterUser,
  RegisterUserSuccess,
  RegisterUserFailure
} from '../actions/register-actions';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class RegisterEffects {
  constructor(private actions: Actions, private regService: RegisterService) {}

  // ngrx effects listen for actions from the Store, perform some
  // logic then dispatch a new action
  // Component -> Action -> Effect -> Reducer -> Store -> Component
  // use Effects to access services so that components only ever
  // interact with the store
  @Effect()
  Register$: Observable<any> = this.actions.pipe(
    ofType(RegistrationActionTypes.REGISTER_USER),
    map((action: RegisterUser) => action.payload),
    switchMap(payload => {
      return this.regService.registerUser(payload).pipe(
        map(user => {
          console.log(user);
          return new RegisterUserSuccess({
            user: user
          });
        }),
        catchError(error => {
          console.log(error);
          return of(new RegisterUserFailure({ error: error }));
        })
      );
    })
  );
}
