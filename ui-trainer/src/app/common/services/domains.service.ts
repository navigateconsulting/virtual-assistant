import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { constant } from '../../../environments/constants';

@Injectable({
  providedIn: 'root'
})
export class DomainsService {

  private url = environment.BASEURL;
  private socket;
  private domains_room;

  constructor() {
    this.socket = io(this.url + constant.DOMAINS_NSP);
    this.domains_room = io(this.url);
  }

  createDomainsRoom(domain_room: string) {
    console.log(domain_room);
    // this.domains_room.emit('join_room', constant.DOMAINS_NSP, 'domain');
  }

  getDomains(project_id, room_name) {
    const observable = new Observable(observer => {
      this.domains_room.emit('join_room', '/domain', '2');
      this.socket.emit('getDomains', '2', '2');
      this.socket.on('allDomains', function(data) {
        setTimeout(() => {
          console.log(data);
        }, 500);
        // if (data) {
        //   observer.next(data);
        // } else {
        //   observer.error('Unable to reach the server');
        // }
        this.domains_room.emit('leave_room', '/domain', '2');
      });
      this.socket.on('error', (data) => {
        observer.error(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
    // console.log(room_name);
    // const d = new Date(); // for now
    // console.log('Domains', this.socket);
    // this.socket.emit(constant.DOMAINS_URL, '1', 'domain');
    // return Observable.create((observer) => {
    //   console.log(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    //     this.socket.on(constant.DOMAINS_LISTEN, (data, fn) => {
    //       fn('HERE');
    //       if (data) {
    //         observer.next(data);
    //       } else {
    //         observer.error('Unable To Reach Server');
    //       }
    //     });
    //   console.log(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    //   // return () => {
    //   //   this.socket.disconnect();
    //   // };
    // });
  }
}
