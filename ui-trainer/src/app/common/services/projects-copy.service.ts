import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { constant } from '../../../environments/constants';

@Injectable({
  providedIn: 'root'
})
export class ProjectsCopyService {

  private url = environment.BASEURL;
  private socket;
  private projects_room;

  constructor() {
    this.socket = io(this.url + constant.DOMAINS_NSP);
    this.projects_room = io(this.url);
  }

  createProjectsRoom(project_room: string) {
    this.projects_room.emit('join_room', constant.DOMAINS_NSP, project_room);
  }

  getProjects(room_name) {
    const d = new Date(); // for now
    this.socket.emit('/domain', '2', 'root');
    return Observable.create((observer) => {
      this.socket.on('allDomains', (data) => {
        if (data) {
          console.log('Inside Domains Listeting ');
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
    this.projects_room.emit('leave_room', constant.DOMAINS_NSP, project_room);
  }
}
