import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, retry, catchError, share } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { constant } from '../../../environments/constants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
  }

  login_user(reqObj: any) {
    const requestOptions = {
      headers: this.headers
    };
    return this.http.post(environment.BASEURL + constant.URL_LOGIN, reqObj , requestOptions).pipe(
                    map((value) => value),
                    catchError(this.handleError));
  }

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
