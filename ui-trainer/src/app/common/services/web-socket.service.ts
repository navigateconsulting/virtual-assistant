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

  createProjectsRoom(project_room) {
    this.socket.emit('join_room', constant.PROJECTS_NSP, project_room);
  }
}
