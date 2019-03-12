import { User } from '../model/user.model';

export class RegistrationState {
  user: User;
  errorMessage: string;
}

export const getErrorMessage = (state: RegistrationState) => state.errorMessage;
export const getUser = (state: RegistrationState) => state.user;

export const initialState: RegistrationState = {
  user: null,
  errorMessage: ''
};
