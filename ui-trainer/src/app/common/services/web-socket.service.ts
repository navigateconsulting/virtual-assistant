import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { constant } from '../../../environments/constants';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: any;

  constructor() {
    if (environment.production === false) {
      this.socket = io(environment.BASE_URL);
    } else {
      this.socket = io();
    }
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
    });
  }

  createResponse(new_response_stub: any, irs_room: string) {
    this.socket.emit(constant.IRS_RESPONSES_CREATE, new_response_stub, irs_room);
  }

  editResponse(edit_response_stub: any, irs_room: string) {
    this.socket.emit(constant.IRS_RESPONSES_UPDATE, edit_response_stub, irs_room);
  }

  deleteResponse(delete_response_stub: any, irs_room: string) {
    this.socket.emit(constant.IRS_RESPONSES_DELETE, delete_response_stub, irs_room);
  }

  getStories(project_domain_ids: any, irs_room: string) {
    this.socket.emit(constant.IRS_STORIES_URL, project_domain_ids, irs_room);
    return Observable.create((observer) => {
      this.socket.on(constant.IRS_STORIES_LISTEN, (data) => {
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

  getStoryAlerts() {
    return Observable.create((observer) => {
      this.socket.on(constant.IRS_STORIES_RESPONSE, (data) => {
        if (data) {
          observer.next(data);
        } else {
          observer.error('Unable to reach the server');
        }
      });
    });
  }

  createStory(new_story_stub: any, irs_room: string) {
    this.socket.emit(constant.IRS_STORIES_CREATE, new_story_stub, irs_room);
  }

  editStory(edit_story_stub: any, irs_room: string) {
    this.socket.emit(constant.IRS_STORIES_UPDATE, edit_story_stub, irs_room);
  }

  deleteStory(delete_story_stub: any, irs_room: string) {
    this.socket.emit(constant.IRS_STORIES_DELETE, delete_story_stub, irs_room);
  }

  leaveIRSRoom(irs_room: string) {
    this.socket.emit('leave_room', irs_room);
  }

  createIntentRoom(intent_room: string) {
    this.socket.nsp = constant.INTENT_NSP;
    this.socket.emit('join_room', intent_room);
  }

  getIntentDetails(intent_details_stub: any, intent_room: string) {
    this.socket.emit(constant.INTENT_DETAILS_URL, intent_details_stub, intent_room);
    return Observable.create((observer) => {
      this.socket.on(constant.INTENT_DETAILS_LISTEN, (data) => {
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

  createIntentText(new_intent_text_stub: any, intent_room: string) {
    this.socket.emit(constant.INTENT_TEXT_CREATE, new_intent_text_stub, intent_room);
  }

  editIntentText(edit_intent_text_stub: any, intent_room: string) {
    this.socket.emit(constant.INTENT_TEXT_UPDATE, edit_intent_text_stub, intent_room);
  }

  deleteIntentText(delete_intent_text_stub: any, intent_room: string) {
    this.socket.emit(constant.INTENT_TEXT_DELETE, delete_intent_text_stub, intent_room);
  }

  createResponseRoom(response_room: string) {
    this.socket.nsp = constant.RESPONSE_NSP;
    this.socket.emit('join_room', response_room);
  }

  getResponseDetails(response_details_stub: any, response_room: string) {
    this.socket.emit(constant.RESPONSE_DETAILS_URL, response_details_stub, response_room);
    return Observable.create((observer) => {
      this.socket.on(constant.RESPONSE_DETAILS_LISTEN, (data) => {
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

  createResponseText(new_response_text_stub: any, response_room: string) {
    this.socket.emit(constant.RESPONSE_TEXT_CREATE, new_response_text_stub, response_room);
  }

  deleteResponseText(delete_response_text_stub: any, response_room: string) {
    this.socket.emit(constant.RESPONSE_TEXT_DELETE, delete_response_text_stub, response_room);
  }

  createStoryRoom(story_room: string) {
    this.socket.nsp = constant.STORY_NSP;
    this.socket.emit('join_room', story_room);
  }

  getStoryDetails(story_details_stub: any, story_room: string) {
    this.socket.emit(constant.STORY_DETAILS_URL, story_details_stub, story_room);
    return Observable.create((observer) => {
      this.socket.on(constant.STORY_DETAILS_LISTEN, (data) => {
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

  getStoryDetailAlerts() {
    return Observable.create((observer) => {
      this.socket.on(constant.STORY_ALERT_DETAILS_LISTEN, (data) => {
        if (data) {
          observer.next(data);
        } else {
          observer.error('Unable To Reach Server');
        }
      });
    });
  }

  getIntentsForStory() {
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

  getResponsesForStory() {
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

  insertDetailsToStory(new_ir_to_story_stub: any, story_room: string) {
    this.socket.emit(constant.STORY_DETAILS_INSERT, new_ir_to_story_stub, story_room);
  }

  deleteDetailsFromStory(delete_ir_from_story_stub: any, story_room: string) {
    this.socket.emit(constant.STORY_DETAILS_DELETE, delete_ir_from_story_stub, story_room);
  }

  updateDetailsFromStory(update_ir_from_story_stub: any, story_room: string) {
    this.socket.emit(constant.STORY_DETAILS_UPDATE, update_ir_from_story_stub, story_room);
  }

  createTryNowRoom(try_now_room: string) {
    this.socket.nsp = constant.TRY_NOW_NSP;
    this.socket.emit('join_room', try_now_room);
  }

  tryNowProject(try_now_project_stub: any) {
    this.socket.emit(constant.TRY_NOW_URL, try_now_project_stub);
    return Observable.create((observer) => {
      this.socket.on(constant.TRY_NOW_LISTEN, (data) => {
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

  chatNowProject(chat_now_stub: any) {
    this.socket.emit(constant.CHAT_NOW_URL, chat_now_stub);
    return Observable.create((observer) => {
      this.socket['_callbacks']['$chatResponse'] = [];
      this.socket.on(constant.TRY_NOW_LISTEN, (data) => {
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

  createProjectDeployNSP() {
    this.socket.nsp = constant.PROJECT_DEPLOY_NSP;
  }

  getProjectsForDeploy() {
    this.socket.emit(constant.PROJECT_DEPLOY_URL);
    return Observable.create((observer) => {
      this.socket.on(constant.PROJECT_DEPLOY_LISTEN, (data) => {
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

  getModelDeployAlerts() {
    return Observable.create((observer) => {
      this.socket.on(constant.MODEL_DEPLOY_LISTEN, (data) => {
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

  deployModel(projectObjectId: string) {
    this.socket.emit(constant.MODEL_DEPLOY_URL, projectObjectId);
  }
}
