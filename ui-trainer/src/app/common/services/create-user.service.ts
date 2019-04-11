import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, share } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { constant } from '../../../environments/constants';

@Injectable({
  providedIn: 'root'
})
export class CreateUserService {

  public headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
  }

  get_all_agents(reqObj: any) {
    const requestOptions = {
      headers: this.headers
    };
    return this.http.post(environment.BASEURL + constant.URL_GET_ALL_AGENTS, reqObj , requestOptions).pipe(
                    map((value) => value),
                    catchError(error => error));
  }

  add_new_user(reqObj: any) {
    const requestOptions = {
      headers: this.headers
    };
    return this.http.post(environment.BASEURL + constant.URL_ADD_NEW_USER, reqObj , requestOptions).pipe(
                    map((value) => value),
                    catchError(error => error));
  }
}
