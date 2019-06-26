import { Injectable } from '@angular/core';
// import { HeaderComponent } from '../header/header.component';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(/* private headerComponent: HeaderComponent */) { }

  changeHeaderApplication() {
    // this.headerComponent.changeApplication();
  }
}
