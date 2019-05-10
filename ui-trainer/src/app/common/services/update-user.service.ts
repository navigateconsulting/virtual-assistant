import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, share } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { constant } from '../../../environments/constants';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserService {

  public headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
  }

  update_user_details(reqObj: any) {
    const requestOptions = {
      headers: this.headers
    };
    return this.http.post(environment.BASEURL + constant.URL_UPDATE_USER, reqObj , requestOptions).pipe(
                    map((value) => value),
                    catchError(error => error));
  }
}
