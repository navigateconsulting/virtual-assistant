import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, share } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { constant } from '../../../environments/constants';

@Injectable({
  providedIn: 'root'
})
export class QueryUserService {

  public headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
  }

  get_all_active_users(reqObj: any) {
    const requestOptions = {
      headers: this.headers
    };
    return this.http.post(environment.BASEURL + constant.URL_GET_ALL_ACTIVE_USERS, reqObj , requestOptions).pipe(
                    map((value) => value),
                    catchError(error => error));
  }

  get_all_roles(reqObj: any) {
    const requestOptions = {
      headers: this.headers
    };
    return this.http.post(environment.BASEURL + constant.URL_GET_ALL_ROLES, reqObj , requestOptions).pipe(
                    map((value) => value),
                    catchError(error => error));
  }
}
