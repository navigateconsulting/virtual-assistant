import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsesDataService {

  responses: any;
  responsesSource: BehaviorSubject<any>;
  newResponse: any;

  constructor() {
    this.responses = sessionStorage.getItem('responses_json');
    if (this.responses !== null && this.responses !== '') {
      const responses_string_arr = this.responses.split('*');
      this.responses = this.convertToArrayOfObject(responses_string_arr);
    }
    this.responsesSource = new BehaviorSubject(this.responses);
    this.newResponse = this.responsesSource.asObservable();
  }

  changeResponse(responses: any) {
    this.responsesSource.next(responses);
  }

  convertToArrayOfObject(responses: any) {
    responses.forEach(function (value: any, index: number) {
      responses[index] = JSON.parse(value);
    });
    return responses;
  }

  convertToArrayOfString(responses: any) {
    responses.forEach(function (value: any, index: number) {
      responses[index] = JSON.stringify(value);
    });
    return responses;
  }
}
