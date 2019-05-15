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

  getProjects(project_room: string) {
    this.socket.emit(constant.PROJECTS_URL, project_room);
    return Observable.create((observer) => {
      this.socket.on(constant.PROJECTS_LISTEN, (data) => {
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

  getProjectAlerts() {
    return Observable.create((observer) => {
      this.socket.on(constant.PROJECTS_RESPONSE, (data) => {
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

  createProject(new_project_stub: any, project_room: string) {
    this.socket.emit(constant.PROJECTS_CREATE, new_project_stub, project_room);
  }

  deleteProject(project_object_id: string, project_room: string) {
    this.socket.emit(constant.PROJECTS_DELETE, project_object_id, project_room);
  }

  editProject(edit_project_stub: any, project_room: string) {
    this.socket.emit(constant.PROJECTS_UPDATE, edit_project_stub, project_room);
  }

  copyProject(copy_project_stub: any, project_room: string) {
    this.socket.emit(constant.PROJECTS_COPY, copy_project_stub, project_room);
  }

  leaveProjectsRoom(project_room: string) {
    this.socket.emit('leave_room', project_room);
  }

  createDomainsRoom(domain_room: string) {
    this.socket.nsp = constant.DOMAINS_NSP;
    this.socket.emit('join_room', domain_room);
  }

  getDomains(project_id: string, room_name: string) {
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

  getDomainAlerts() {
    return Observable.create((observer) => {
      this.socket.on(constant.DOMAINS_RESPONSE, (data) => {
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

  createDomain(new_domain_stub: any, domain_room: string) {
    this.socket.emit(constant.DOMAINS_CREATE, new_domain_stub, domain_room);
  }

  deleteDomain(delete_domain_stub: any, domain_room: string) {
    this.socket.emit(constant.DOMAINS_DELETE, delete_domain_stub, domain_room);
  }

  editDomain(edit_domain_stub: any, domain_room: string) {
    this.socket.emit(constant.DOMAINS_UPDATE, edit_domain_stub, domain_room);
  }

  leaveDomainsRoom(domain_room: string) {
    this.socket.emit('leave_room', domain_room);
  }

  createIRSRoom(irs_room: string) {
    this.socket.nsp = constant.IRS_NSP;
    this.socket.emit('join_room', irs_room);
  }

  getIntents(project_domain_ids: any, irs_room: string) {
    this.socket.emit(constant.IRS_INTENTS_URL, project_domain_ids, irs_room);
    return Observable.create((observer) => {
      this.socket.on(constant.IRS_INTENTS_LISTEN, (data) => {
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

  getIntentAlerts() {
    return Observable.create((observer) => {
      this.socket.on(constant.IRS_INTENTS_RESPONSE, (data) => {
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

  createIntent(new_intent_stub: any, irs_room: string) {
    this.socket.emit(constant.IRS_INTENTS_CREATE, new_intent_stub, irs_room);
  }

  editIntent(edit_intent_stub: any, irs_room: string) {
    this.socket.emit(constant.IRS_INTENTS_UPDATE, edit_intent_stub, irs_room);
  }

  deleteIntent(delete_intent_stub: any, irs_room: string) {
    this.socket.emit(constant.IRS_INTENTS_DELETE, delete_intent_stub, irs_room);
  }

  getResponses(project_domain_ids: any, irs_room: string) {
    this.socket.emit(constant.IRS_RESPONSES_URL, project_domain_ids, irs_room);
    return Observable.create((observer) => {
      this.socket.on(constant.IRS_RESPONSES_LISTEN, (data) => {
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

  getResponseAlerts() {
    return Observable.create((observer) => {
      this.socket.on(constant.IRS_RESPONSES_RESPONSE, (data) => {
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
}
