import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private sharedData: any = {};
  constructor() { }

  setSharedData(key: string, value: any, moduleName: string) {
    let sharedObj: any = {};
    if (this.sharedData.hasOwnProperty(moduleName)) {
      sharedObj = this.sharedData[moduleName];
    } else {
      this.sharedData[moduleName] = {};
      sharedObj = this.sharedData[moduleName];
    }
    sharedObj[key] = value;
  }

  getSharedData(key: string, moduleName: string) {
    if (this.sharedData.hasOwnProperty(moduleName)) {
      const sharedObj: any = this.sharedData[moduleName];
      return sharedObj[key];
    } else {
      return {};
    }
  }
}
