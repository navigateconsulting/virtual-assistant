import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private url = 'http://10.1.10.82:8089';
  private socket;

  constructor() { }

  sendMessage(message: string) {
    this.socket.emit('getDomains', message);
  }

  getMessages() {
    const observable = new Observable(observer => {
      const room_socket = io(this.url);
      this.socket = io(this.url + '/domain');
      room_socket.emit('join_room', '/domain', '2');
      this.socket.emit('getDomains', '2', '2');
      this.socket.on('allDomains', function(data) {
        console.log(data);
        // if (data) {
        //   observer.next(data);
        // } else {
        //   observer.error('Unable to reach the server');
        // }
        room_socket.emit('leave_room', '/domain', '2');
      });
      this.socket.on('error', (data) => {
        observer.error(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  createProject(project_stub) {
    this.socket.emit('createProject', project_stub);
    const observable = new Observable(observer => {
      this.socket.on('projectResponse', (data) => {
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
    return observable;
  }

  deleteProject(project_stub) {
    this.socket.emit('deleteProject', project_stub);
    const observable = new Observable(observer => {
      this.socket.on('projectResponse', (data) => {
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
    return observable;
  }

  updateProject(project_stub: any) {
    this.socket.emit('updateProject', project_stub);
    return Observable.create((observer) => {
      this.socket.on('projectResponse', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
