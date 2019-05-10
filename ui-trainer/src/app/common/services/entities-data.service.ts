import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EntitiesDataService {

  entities: any;
  entitySource: BehaviorSubject<any>;
  newEntity: any;

  constructor() {
    this.entities = sessionStorage.getItem('entities_json');
    if (this.entities !== null && this.entities !== '') {
      const entities_string_arr = this.entities.split('*');
      this.entities = this.convertToArrayOfObject(entities_string_arr);
    }
    this.entitySource = new BehaviorSubject(this.entities);
    this.newEntity = this.entitySource.asObservable();
  }

  changeEntity(entities: any) {
    this.entitySource.next(entities);
  }

  saveEntitiesJson(entities_string_arr: any) {
    entities_string_arr = this.convertToArrayOfString(entities_string_arr);
    sessionStorage.setItem('entities_json', entities_string_arr.join('*'));
  }

  convertToArrayOfObject(entities: any) {
    entities.forEach(function (value: any, index: number) {
      entities[index] = JSON.parse(value);
    });
    return entities;
  }

  convertToArrayOfString(entities: any) {
    entities.forEach(function (value: any, index: number) {
      entities[index] = JSON.stringify(value);
    });
    return entities;
  }

}
