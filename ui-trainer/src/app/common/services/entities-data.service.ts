import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { constant } from '../../../environments/constants';
import * as io from 'socket.io-client';

@Injectable()
export class EntitiesDataService {

  entities: any;
  entitySource: BehaviorSubject<any>;
  newEntity: any;

  private url = environment.BASEURL;
  private socket: any;

  constructor() {
    this.socket = io(this.url + constant.ENTITIES_NSP);
    // this.entities = sessionStorage.getItem('entities_json');
    // if (this.entities !== null && this.entities !== '') {
    //   const entities_string_arr = this.entities.split('*');
    //   this.entities = this.convertToArrayOfObject(entities_string_arr);
    // }
    // this.entitySource = new BehaviorSubject(this.entities);
    // this.newEntity = this.entitySource.asObservable();
  }

  createEntitiesRoom() {
    this.socket.emit('join_room', 'entities');
  }

  getEntities(get_entities_stub: any) {
    this.socket.emit(constant.ENTITIES_URL, get_entities_stub, 'entities');
    return Observable.create((observer) => {
      this.socket.on(constant.ENTITIES_LISTEN, (data) => {
        if (data) {
          observer.next(data);
        } else {
          observer.error('Unable To Reach Server');
        }
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  getEntityAlerts() {
    return Observable.create((observer) => {
      this.socket.on(constant.ENTITIES_RESPONSE, (data) => {
        if (data) {
          observer.next(data);
        } else {
          observer.error('Unable to reach the server');
        }
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  createEntity(new_entity_stub: any) {
    this.socket.emit(constant.ENTITIES_CREATE, new_entity_stub, 'entities');
  }

  editEntity(edit_entity_stub: any) {
    this.socket.emit(constant.ENTITIES_UPDATE, edit_entity_stub, 'entities');
  }

  deleteEntity(delete_entity_stub: string) {
    this.socket.emit(constant.ENTITIES_DELETE, delete_entity_stub, 'entities');
  }

  // changeEntity(entities: any) {
  //   this.entitySource.next(entities);
  // }

  // saveEntitiesJson(entities_string_arr: any) {
  //   entities_string_arr = this.convertToArrayOfString(entities_string_arr);
  //   sessionStorage.setItem('entities_json', entities_string_arr.join('*'));
  // }

  // convertToArrayOfObject(entities: any) {
  //   entities.forEach(function (value: any, index: number) {
  //     entities[index] = JSON.parse(value);
  //   });
  //   return entities;
  // }

  // convertToArrayOfString(entities: any) {
  //   entities.forEach(function (value: any, index: number) {
  //     entities[index] = JSON.stringify(value);
  //   });
  //   return entities;
  // }

}
