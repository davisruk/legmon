import { User } from '../../model/user.model';
import { RegistrationActionTypes } from '../actions/register-actions';
import { RegistrationState, initialState } from '../registration-state';
import { All } from '../actions/register-actions';

export function reducer(state = initialState, action: All): RegistrationState {
  switch (action.type) {
    case RegistrationActionTypes.REGISTER_USER_SUCCESS: {
      const user: User = Object.assign({}, action.payload.user);
      return { ...state, user: user, errorMessage: null };
    }
    case RegistrationActionTypes.REGISTER_USER_FAILURE: {
      return {
        ...state,
        user: null,
        errorMessage: 'Registration Failure'
      };
    }
    default: {
      return state;
    }
  }
}
