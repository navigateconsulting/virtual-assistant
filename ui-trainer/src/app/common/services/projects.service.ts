import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { constant } from '../../../environments/constants';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private url = environment.BASEURL;
  private socket;
  private projects_room;

  constructor() {
    this.socket = io(this.url + constant.PROJECTS_NSP);
    this.projects_room = io(this.url);
  }

  createProjectsRoom(project_room: string) {
    this.projects_room.emit('join_room', constant.PROJECTS_NSP, project_room);
  }

  getProjects(room_name) {
    const d = new Date(); // for now
    console.log('Projects', this.socket);
    this.socket.emit(constant.PROJECTS_URL, room_name);
    return Observable.create((observer) => {
      console.log(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
      this.socket.on(constant.PROJECTS_LISTEN, (data) => {
        if (data) {
          console.log('Inside Projects Listeting ')
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
    this.projects_room.emit('leave_room', constant.PROJECTS_NSP, project_room);
  }
}
