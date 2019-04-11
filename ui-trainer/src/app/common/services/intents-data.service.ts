import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntentsDataService {

  intents: any;
  intentsSource: BehaviorSubject<any>;
  newIntent: any;

  constructor() {
    this.intents = sessionStorage.getItem('intents_json');
    if (this.intents !== null && this.intents !== '') {
      const intents_string_arr = this.intents.split('*');
      this.intents = this.convertToArrayOfObject(intents_string_arr);
    }
    this.intentsSource = new BehaviorSubject(this.intents);
    this.newIntent = this.intentsSource.asObservable();
  }

  changeIntent(intents: any) {
    this.intentsSource.next(intents);
  }

  convertToArrayOfObject(intents: any) {
    intents.forEach(function (value: any, index: number) {
      intents[index] = JSON.parse(value);
    });
    return intents;
  }

  convertToArrayOfString(intents: any) {
    intents.forEach(function (value: any, index: number) {
      intents[index] = JSON.stringify(value);
    });
    return intents;
  }
}
