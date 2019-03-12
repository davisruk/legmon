import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private _baseUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<User> {
    return this.http
      .post<User>(this._baseUrl, user)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Registration Failed');
  }
}
