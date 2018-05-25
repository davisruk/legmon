import { User } from '../model/user.model';
import { createSelector } from '@ngrx/store';

export class AuthenticationState {
    user: User;
    authenticated: boolean;
    errorMessage: string;
}

export const getErrorMessage = (state: AuthenticationState) => state.errorMessage;
export const isAuthenticated = (state: AuthenticationState) => state.authenticated;
export const getUser = (state: AuthenticationState) => state.user;

export const initialState: AuthenticationState = {
    user: null,
    authenticated: false,
    errorMessage: ''
};
