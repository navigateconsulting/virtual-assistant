import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { constant } from '../../../environments/constants';
import io from 'socket.io-client';

@Injectable()
export class EntitiesDataService {

  entities: any;
  entitySource: BehaviorSubject<any>;
  newEntity: any;

  private socket: any;

  constructor() {
    if (environment.production === false) {
      this.socket = io(environment.BASE_URL);
    } else {
      this.socket = io();
    }
    this.socket.nsp = constant.ENTITIES_NSP;
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
}
