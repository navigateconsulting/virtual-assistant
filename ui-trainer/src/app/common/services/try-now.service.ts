import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TryNowService {

  // Define API
  apiURL = environment.BASE_URL;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // HttpClient API post() method => Create employee
  tryNow(sessionId: string, projectObjectId: string): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/tryNow', JSON.stringify({sessionId: sessionId, projectObjectId: projectObjectId}), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API post() method => Create employee
  chatNow(sessionId: string, message: string): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/chatNow', JSON.stringify({sessionId: sessionId, message: message}), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
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
