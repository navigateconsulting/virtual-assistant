import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { constant } from '../../../environments/constants';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private url = environment.BASEURL;
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(this.url);
  }

  createProjectsRoom(project_room: string) {
    this.socket.nsp = constant.PROJECTS_NSP;
    this.socket.emit('join_room', project_room);
  }

  getProjects(room_name) {
    this.socket.emit(constant.PROJECTS_URL, room_name);
    return Observable.create((observer) => {
      this.socket.on(constant.PROJECTS_LISTEN, (data) => {
        if (data) {
          console.log('Inside Projects Listeting');
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

  leaveProjectsRoom(project_room: string) {
    this.socket.emit('leave_room', project_room);
  }

  createDomainsRoom(domain_room: string) {
    this.socket.nsp = constant.DOMAINS_NSP;
    this.socket.emit('join_room', domain_room);
  }

  getDomains(project_id, room_name) {
    this.socket.emit(constant.DOMAINS_URL, project_id, room_name);
    return Observable.create((observer) => {
      this.socket.on(constant.DOMAINS_LISTEN, (data) => {
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
}
