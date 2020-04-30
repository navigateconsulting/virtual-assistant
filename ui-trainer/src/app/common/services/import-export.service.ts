import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {

  // Define API
  apiURL = environment.BASE_URL;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  importProject(projectStub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/importProject', JSON.stringify(projectStub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  exportProject(projectName: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/exportProject', JSON.stringify({project_name: projectName}), this.httpOptions)
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
