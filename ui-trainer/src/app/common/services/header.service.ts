import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  invokeEvent: Subject<any> = new Subject();

  constructor() { }

  changeHeaderApplication(app: string) {
    this.invokeEvent.next(app);
  }
}
