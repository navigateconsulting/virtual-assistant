import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IntentsDataService } from '../common/services/intents-data.service';
import { ResponsesDataService } from '../common/services/responses-data.service';
import { StoriesDataService } from '../common/services/stories-data.service';
import { DomainsDataService } from '../common/services/domains-data.service';
import { FileElement } from '../file-explorer/model/element';
import { Observable } from 'rxjs';
import { FileService } from '../common/services/file.service';
import { ChatService } from '../common/services/chat.service';
import { WebSocketService } from '../common/services/web-socket.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDomainComponent } from '../common/modals/add-domain/add-domain.component';
import { DeleteDomainComponent } from '../common/modals/delete-domain/delete-domain.component';
import { EditDomainComponent } from '../common/modals/edit-domain/edit-domain.component';

@Component({
  selector: 'app-manage-domains',
  templateUrl: './manage-domains.component.html',
  styleUrls: ['./manage-domains.component.scss']
})
export class ManageDomainsComponent implements OnInit, OnDestroy {

  public fileElements: Observable<FileElement[]>;

  constructor(public fileService: FileService,
              public webSocketService: WebSocketService,
              public dialog: MatDialog) { }

  currentRoot: FileElement;
  currentPath: string;
  currentPathID: string;
  canNavigateUp = false;
  showAddFolderFile = true;
  openIntentORStoryORResponseFile: string;
  currentIntent: any;
  currentStory: any;
  currentResponse: any;
  domain_id: number;
  intent_id: number;
  story_id: number;
  response_id: number;
  intentsJSON: any;
  storiesJSON: any;
  responsesJSON: any;
  domainsJSON: any;
  projectsJSON: any;
  propertyPanel: string;
  rootFoldersArray: Array<string> = ['Intents', 'Stories', 'Responses'];

  connection: any;
  domains_json: any;
  domains_json_backup: any;
  show_success_error: boolean;
  success_error_class: string;
  success_error_type: string;
  success_error_message: string;

  @Input() projectObjectId: string;

  @Output() selectedDomain = new EventEmitter<string>();

  ngOnInit() {
    this.getDomains();
    // this.getIntents();
    // this.getStories();
    // this.getResponses();
    // this.getDomains();
    // this.getProjects();
    // // tslint:disable-next-line:quotemark
    // this.currentPath = "<a href='javascript:;' class='root'> Home </a>" + ' / ';
    // this.propertyPanel = 'entities';
  }

  getDomains() {
    this.webSocketService.createDomainsRoom('project_' + this.projectObjectId);
    this.webSocketService.getDomains(this.projectObjectId, 'project_' + this.projectObjectId).subscribe(domains => {
      this.domains_json = this.domains_json_backup = domains;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.webSocketService.getDomainAlerts().subscribe(response => {
      this.showDomainAlerts(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  addNewDomain() {
    const dialogRef = this.dialog.open(AddDomainComponent, {
      width: '400px',
      data: {projectObjectId: this.projectObjectId}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.createDomain(response, 'project_' + this.projectObjectId);
      }
    });
  }

  editDomain(domainObjectId: string, domainName: string, domainDescription: string) {
    const dialogRef = this.dialog.open(EditDomainComponent, {
      width: '400px',
      data: {
        projectObjectId: this.projectObjectId,
        domainObjectId: domainObjectId,
        domainName: domainName,
        domainDescription: domainDescription
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.editDomain(response, 'project_' + this.projectObjectId);
      }
    });
  }

  deleteDomain(domainObjectId: string) {
    const dialogRef = this.dialog.open(DeleteDomainComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        // tslint:disable-next-line: max-line-length
        this.webSocketService.deleteDomain({project_id: this.projectObjectId, object_id: domainObjectId}, 'project_' + this.projectObjectId);
      }
    });
  }

  applyDomainsFilter(filterValue: string) {
    this.domains_json = this.domains_json_backup;
    this.domains_json = this.domains_json.filter((value) => {
      if (value.domain_name.toLowerCase().includes(filterValue.trim())) {
        return value;
      }
    });
  }

  selectDomain(domainObjectId: string) {
    this.webSocketService.leaveDomainsRoom('project_' + this.projectObjectId);
    this.selectedDomain.emit(domainObjectId);
  }

  showDomainAlerts(res: any) {
    if (res.status === 'Error') {
      this.success_error_class = 'danger';
    } else if (res.status === 'Success') {
      this.success_error_class = 'success';
    }
    this.success_error_type = res.status;
    this.success_error_message = res.message;
    this.show_success_error = true;
    setTimeout(() => {
      this.show_success_error = false;
    }, 2000);
  }

  ngOnDestroy(): void {}

  // getIntents() {
  //   this.intents_data.newIntent.subscribe((intents: any) => {
  //     this.intentsJSON = (intents !== '' && intents !== null) ? intents : [];
  //     if (this.intentsJSON.length === 0) {
  //       this.intentsJSON = new Array<object>();
  //       sessionStorage.setItem('intent_id', '0');
  //     } else {
  //       sessionStorage.setItem('intent_id', this.intentsJSON[this.intentsJSON.length - 1].intent_id);
  //     }
  //   });
  // }

  // getStories() {
  //   this.stories_data.newStory.subscribe((stories: any) => {
  //     this.storiesJSON = (stories !== '' && stories !== null) ? stories : [];
  //     if (this.storiesJSON.length === 0) {
  //       this.storiesJSON = new Array<object>();
  //       sessionStorage.setItem('story_id', '0');
  //     } else {
  //       sessionStorage.setItem('story_id', this.storiesJSON[this.storiesJSON.length - 1].story_id);
  //     }
  //   });
  // }

  // getResponses() {
  //   this.responses_data.newResponse.subscribe((responses: any) => {
  //     this.responsesJSON = (responses !== '' && responses !== null) ? responses : [];
  //     if (this.responsesJSON.length === 0) {
  //       this.responsesJSON = new Array<object>();
  //       sessionStorage.setItem('response_id', '0');
  //     } else {
  //       sessionStorage.setItem('response_id', this.responsesJSON[this.responsesJSON.length - 1].response_id);
  //     }
  //   });
  // }

  // getDomains() {
  //   this.domains_data.newDomain.subscribe((domains: any) => {
  //     this.domainsJSON = (domains !== '' && domains !== null) ? domains : [];
  //     if (this.domainsJSON.length === 0) {
  //       this.domainsJSON = new Array<object>();
  //       sessionStorage.setItem('domain_id', '0');
  //     } else {
  //       sessionStorage.setItem('domain_id', this.domainsJSON[this.domainsJSON.length - 1].domain_id);
  //       // this.loadStoriesJSON(this.domainsJSON);
  //     }
  //   });
  // }

  // getProjects() {
  //   this.connection = this.chatService.getMessages().subscribe(projects => {
  //     this.projectsJSON = (projects !== '' && projects !== null) ? projects : [];
  //     if (this.projectsJSON.length === 0) {
  //       this.projectsJSON = new Array<object>();
  //     }
  //     this.createProjectsFolder(this.projectsJSON);
  //   },
  //   err => console.error('Observer got an error: ' + err),
  //   () => console.log('Observer got a complete notification'));
  // }

  createProjectsFolder(projects_json: any) {
    // console.log(projects_json);
    // this.fileService.clearMapElement();
    // projects_json.forEach(project => {
    //   // tslint:disable-next-line: max-line-length
    //   this.fileService.add({ oid: project._id['$oid'], project_id: project.project_id, name: project.project_name, description: project.project_description, isFolder: true, parent: 'root', type: 'projects' });
    // });
    // this.updateFileElementQuery();
  }

  // addFolder(folder: { name: string }) {
  //   const project_stub = '{"project_id": "13", "project_name": "' + folder.name + '", "project_description": "Test 13 Desc"}';
  //   this.connection = this.chatService.createProject(project_stub).subscribe(response => {
  //     console.log(response);
  //   },
  //   err => console.error('Observer got an error: ' + err),
  //   () => console.log('Observer got a complete notification'));
  //   // this.domain_id = +sessionStorage.getItem('domain_id') + 1;
  //   // // tslint:disable-next-line:max-line-length
  //   // const new_folder = this.fileService.add({ domain_id: this.domain_id, name: folder.name, isFolder: true, parent: this.currentRoot ? this.currentRoot.id : 'root', type: 'domain' });
  //   // // tslint:disable-next-line:max-line-length
  //   // this.domainsJSON.push({domain_id: this.domain_id, domain_name: new_folder.name, domain: {Intents: [{}], Stories: [{}], Responses: [{}]}});
  //   // this.fileService.add({ domain_id: this.domain_id, name: 'Intents', isFolder: true, parent: new_folder.id, type: 'intents' });
  //   // this.fileService.add({ domain_id: this.domain_id, name: 'Stories', isFolder: true, parent: new_folder.id, type: 'stories' });
  //   // this.fileService.add({ domain_id: this.domain_id, name: 'Responses', isFolder: true, parent: new_folder.id, type: 'responses' });
  //   // this.updateFileElementQuery();
  //   // this.updateDomainsJSON(this.domainsJSON.slice(0));
  // }

  // addFile(file: { name: string, description: string }) {
  //   // this.domain_id = +sessionStorage.getItem('domain_id');
  //   // if (this.currentRoot.type === 'intents') {
  //   //   this.intent_id = +sessionStorage.getItem('intent_id') + 1;
  //   //   // tslint:disable-next-line:max-line-length
  //   //   this.fileService.add({ domain_id: this.domain_id, intent_id: this.intent_id, name: file.name, description: file.description, isFolder: false, parent: this.currentRoot ? this.currentRoot.id : 'root', type: 'intent' });
  //   //   // tslint:disable-next-line:max-line-length
  //   //   this.intentsJSON.push({ domain_id: this.domain_id, intent_id: this.intent_id, intent: file.name, intent_desc: file.description, text_entities: [] });
  //   //   this.updateIntentsJSON(this.intentsJSON.slice(0));
  //   // } else if (this.currentRoot.type === 'stories') {
  //   //   this.story_id = +sessionStorage.getItem('story_id') + 1;
  //   //   // tslint:disable-next-line:max-line-length
  //   //   this.fileService.add({ domain_id: this.domain_id, story_id: this.story_id, name: file.name, description: file.description, isFolder: false, parent: this.currentRoot ? this.currentRoot.id : 'root', type: 'story' });
  //   //   // tslint:disable-next-line:max-line-length
  //   //   this.storiesJSON.push({ domain_id: this.domain_id, story_id: this.story_id, story: file.name, story_desc: file.description, intents_responses: [] });
  //   //   this.updateStoriesJSON(this.storiesJSON.slice(0));
  //   // } else if (this.currentRoot.type === 'responses') {
  //   //   this.response_id = +sessionStorage.getItem('response_id') + 1;
  //   //   // tslint:disable-next-line:max-line-length
  //   //   this.fileService.add({ domain_id: this.domain_id, response_id: this.response_id, name: file.name, description: file.description, isFolder: false, parent: this.currentRoot ? this.currentRoot.id : 'root', type: 'response' });
  //   //   // tslint:disable-next-line:max-line-length
  //   //   this.responsesJSON.push({ domain_id: this.domain_id, response_id: this.response_id, response: file.name, response_desc: file.description, text_entities: [] });
  //   //   this.updateResponsesJSON(this.responsesJSON.slice(0));
  //   // }
  //   // this.updateFileElementQuery();
  // }

  // removeElement(element: FileElement) {
  //   console.log(element);
  //   const project_stub = element.oid;
  //   this.connection = this.chatService.deleteProject(project_stub).subscribe(response => {
  //     console.log(response);
  //   },
  //   err => console.error('Observer got an error: ' + err),
  //   () => console.log('Observer got a complete notification'));
  //   // const previous_name_file = this.fileService.get(element.id);
  //   // if (element.type === 'domain') {
  //   //   this.domainsJSON = this.domainsJSON.filter(function( obj ) {
  //   //     return obj['domain_name'] !== previous_name_file.name;
  //   //   });
  //   //   this.updateDomainsJSON(this.domainsJSON.slice(0));
  //   // } else if (element.type === 'intent') {
  //   //   this.intentsJSON = this.intentsJSON.filter(function( obj ) {
  //   //     return obj['intent'] !== previous_name_file.name;
  //   //   });
  //   //   this.updateIntentsJSON(this.intentsJSON.slice(0));
  //   // } else if (element.type === 'story') {
  //   //   this.storiesJSON = this.storiesJSON.filter(function( obj ) {
  //   //     return obj['story'] !== previous_name_file.name;
  //   //   });
  //   //   this.updateStoriesJSON(this.storiesJSON.slice(0));
  //   // } else if (element.type === 'response') {
  //   //   this.responsesJSON = this.responsesJSON.filter(function( obj ) {
  //   //     return obj['response'] !== previous_name_file.name;
  //   //   });
  //   //   this.updateResponsesJSON(this.responsesJSON.slice(0));
  //   // }
  //   // this.fileService.delete(element.id);
  //   // this.updateFileElementQuery();
  // }

  // navigateToFolder(element: FileElement) {
  //   let isFile = false;
  //   if (element.parent === 'root') {
  //     this.showAddFolderFile = false;
  //     sessionStorage.setItem('domain_id', '' + element.domain_id);
  //   } else if (this.rootFoldersArray.includes(element.name)) {
  //     this.showAddFolderFile = true;
  //   } else {
  //     this.showAddFolderFile = false;
  //     this.showIntentORStoryORResponse(element);
  //     isFile = true;
  //   }
  //   this.currentRoot = element;
  //   this.currentPath = this.pushToPath(this.currentPath, element.name, element.id, isFile);
  //   this.canNavigateUp = true;
  //   this.updateFileElementQuery();
  // }

  // navigateUp(path_class: string) {
  //   if (path_class !== 'breadcrumb_path') {
  //     if (path_class === 'root') {
  //       this.currentRoot = null;
  //       this.canNavigateUp = false;
  //       this.showAddFolderFile = true;
  //     } else {
  //       this.currentRoot = this.fileService.get(path_class);
  //       if (this.currentRoot.parent === 'root') {
  //         this.showAddFolderFile = false;
  //       } else {
  //         this.showAddFolderFile = true;
  //       }
  //     }
  //     this.openIntentORStoryORResponseFile = '';
  //     this.updateFileElementQuery();
  //     this.currentPath = this.popFromPath(this.currentPath, path_class);
  //   }
  // }

  // moveElement(event: { element: FileElement; moveTo: FileElement }) {
  //   // this.fileService.update(event.element.id, { parent: event.moveTo.id });
  //   // this.updateFileElementQuery();
  // }

  // renameElement(element: FileElement) {
  //   // tslint:disable-next-line: max-line-length
  //   const project_stub = '{"object_id": "' + element.oid + '", "project_id": "' + element.project_id + '", "project_name": "' + element.name + '", "project_description": "' + element.description + '"}';
  //   this.connection = this.chatService.updateProject(project_stub).subscribe(response => {
  //     console.log(response);
  //   },
  //   err => console.error('Observer got an error: ' + err),
  //   () => console.log('Observer got a complete notification'));
  //   // const previous_name_file = this.fileService.get(element.id);
  //   // if (element.type === 'domain') {
  //   //   this.domainsJSON.find(function(data) {
  //   //     if (data['domain_name'] === previous_name_file.name) {
  //   //       data['domain_name'] = element.name;
  //   //       return true;
  //   //     }
  //   //   });
  //   //   this.updateDomainsJSON(this.domainsJSON.slice(0));
  //   // } else if (element.type === 'intent') {
  //   //   this.intentsJSON.find(function(data) {
  //   //     if (data['intent'] === previous_name_file.name) {
  //   //       data['intent'] = element.name;
  //   //       data['intent_desc'] = element.description;
  //   //       return true;
  //   //     }
  //   //   });
  //   //   this.updateIntentsJSON(this.intentsJSON.slice(0));
  //   // } else if (element.type === 'story') {
  //   //   this.storiesJSON.find(function(data) {
  //   //     if (data['story'] === previous_name_file.name) {
  //   //       data['story'] = element.name;
  //   //       data['story_desc'] = element.description;
  //   //       return true;
  //   //     }
  //   //   });
  //   //   this.updateStoriesJSON(this.storiesJSON.slice(0));
  //   // } else if (element.type === 'response') {
  //   //   this.responsesJSON.find(function(data) {
  //   //     if (data['response'] === previous_name_file.name) {
  //   //       data['response'] = element.name;
  //   //       data['response_desc'] = element.description;
  //   //       return true;
  //   //     }
  //   //   });
  //   //   this.updateResponsesJSON(this.responsesJSON.slice(0));
  //   // }
  //   // this.fileService.update(element.id, { name: element.name });
  //   // this.updateFileElementQuery();
  // }

  // updateFileElementQuery() {
  //   this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  // }

  // pushToPath(path: string, folderName: string, elementId: string, isFile: boolean) {
  //   let p = path ? path : '';
  //   if (isFile) {
  //     // tslint:disable-next-line:quotemark
  //     p += folderName;
  //   } else {
  //     // tslint:disable-next-line:quotemark
  //     p += "<a href='javascript:;' class='" + elementId + "'>" + `${folderName}` + "</a>" + ' / ';
  //   }
  //   return p;
  // }

  // popFromPath(path: string, path_class: string) {
  //   let index = 0;
  //   let p = path ? path : '';
  //   const split = p.split(' / ');
  //   for (let i = 0; i < split.length; i++) {
  //     if (split[i].includes(path_class)) {
  //       index = i;
  //     }
  //   }
  //   split.splice(index + 1);
  //   p = split.join(' / ') + ' / ';
  //   return p;
  // }

  // // loadStoriesJSON(domains_data: any) {
  // //   this.fileElements = new Observable<FileElement[]>();
  // //   for (let i = 0; i < domains_data.length; i++) {
  // //     // tslint:disable-next-line:max-line-length
  // //     const domain_folder = this.fileService.add({ domain_id: domains_data[i]['domain_id'], name: domains_data[i]['domain_name'], isFolder: true, parent: 'root', type: 'domain' });
  // //     const domain_data = domains_data[i]['domain'];
  // //     // tslint:disable-next-line:forin
  // //     for (const key in domain_data) {
  // //       const intents_stories_utter_key = key;
  // //       if (intents_stories_utter_key === 'Intents') {
  // //         // tslint:disable-next-line:max-line-length
  // //         const intents_folder = this.fileService.add({ domain_id: domains_data[i]['domain_id'], name: intents_stories_utter_key, isFolder: true, parent: domain_folder.id, type: 'intents' });
  // //         const intents_data = this.intentsJSON.filter(data => {
  // //           if (data['domain_id'] === domains_data[i]['domain_id']) {
  // //             return data;
  // //           }
  // //         });
  // //         if (intents_data.length > 0) {
  // //           for (let l = 0; l < intents_data.length; l++) {
  // //             // tslint:disable-next-line:max-line-length
  // //             this.fileService.add({ intent_id: intents_data[l].intent_id, name: intents_data[l].intent, description: intents_data[l].intent_desc, isFolder: false, parent: intents_folder.id, type: 'intent' });
  // //           }
  // //         }
  // //       }
  // //       if (intents_stories_utter_key === 'Stories') {
  // //         // tslint:disable-next-line:max-line-length
  // //         const stories_folder = this.fileService.add({ domain_id: domains_data[i]['domain_id'], name: intents_stories_utter_key, isFolder: true, parent: domain_folder.id, type: 'stories' });
  // //         const stories_data = this.storiesJSON.filter(data => {
  // //           if (data['domain_id'] === domains_data[i]['domain_id']) {
  // //             return data;
  // //           }
  // //         });
  // //         if (stories_data.length > 0) {
  // //           for (let l = 0; l < stories_data.length; l++) {
  // //             // tslint:disable-next-line:max-line-length
  // //             this.fileService.add({ story_id: stories_data[l].story_id, name: stories_data[l].story, description: stories_data[l].story_desc, isFolder: false, parent: stories_folder.id, type: 'story' });
  // //           }
  // //         }
  // //       }
  // //       if (intents_stories_utter_key === 'Responses') {
  // //         // tslint:disable-next-line:max-line-length
  // //         const responses_folder = this.fileService.add({ domain_id: domains_data[i]['domain_id'], name: intents_stories_utter_key, isFolder: true, parent: domain_folder.id, type: 'responses' });
  // //         const responses_data = this.responsesJSON.filter(data => {
  // //           if (data['domain_id'] === domains_data[i]['domain_id']) {
  // //             return data;
  // //           }
  // //         });
  // //         if (responses_data !== undefined) {
  // //           if (responses_data.length > 0) {
  // //             for (let l = 0; l < responses_data.length; l++) {
  // //               // tslint:disable-next-line:max-line-length
  // //               this.fileService.add({ response_id: responses_data[l].response_id, name: responses_data[l].response, description: responses_data[l].response_desc, isFolder: false, parent: responses_folder.id, type: 'response' });
  // //             }
  // //           }
  // //         }
  // //       }
  // //     }
  // //   }
  // //   this.updateFileElementQuery();
  // // }

  // updateDomainsJSON(domains_string_arr: any) {
  //   domains_string_arr = this.domains_data.convertToArrayOfString(domains_string_arr);
  //   sessionStorage.setItem('domains_json', domains_string_arr.join('*'));
  //   sessionStorage.setItem('domain_id', '' + this.domain_id);
  // }

  // updateIntentsJSON(intents_string_arr: any) {
  //   intents_string_arr = this.intents_data.convertToArrayOfString(intents_string_arr);
  //   sessionStorage.setItem('intents_json', intents_string_arr.join('*'));
  //   sessionStorage.setItem('intent_id', '' + this.intent_id);
  // }

  // updateStoriesJSON(stories_string_arr: any) {
  //   stories_string_arr = this.stories_data.convertToArrayOfString(stories_string_arr);
  //   sessionStorage.setItem('stories_json', stories_string_arr.join('*'));
  //   sessionStorage.setItem('story_id', '' + this.story_id);
  // }

  // updateResponsesJSON(responses_string_arr: any) {
  //   responses_string_arr = this.responses_data.convertToArrayOfString(responses_string_arr);
  //   sessionStorage.setItem('responses_json', responses_string_arr.join('*'));
  //   sessionStorage.setItem('response_id', '' + this.response_id);
  // }

  // showIntentORStoryORResponse(element: FileElement) {
  //   let currentIntent: any;
  //   let currentStory: any;
  //   let currentResponse: any;
  //   if (element.type === 'intent') {
  //     this.intentsJSON.map(function(data: any) {
  //       if (data['intent_id'] === element.intent_id) {
  //         currentIntent = data;
  //       }
  //     });
  //     this.currentIntent = currentIntent;
  //   } else if (element.type === 'story') {
  //     this.storiesJSON.map(function(data: any) {
  //       if (data['story_id'] === element.story_id) {
  //         currentStory = data;
  //       }
  //     });
  //     this.currentStory = currentStory;
  //   } else if (element.type === 'response') {
  //     this.responsesJSON.map(function(data: any) {
  //       if (data['response_id'] === element.response_id) {
  //         currentResponse = data;
  //       }
  //     });
  //     this.currentResponse = currentResponse;
  //   }
  //   this.openIntentORStoryORResponseFile = element.type;
  // }

  // saveIntentJSON(event: { intent_index: number, text_entities: [{}] }) {
  //   this.intentsJSON.map(function(data) {
  //     if (data['intent_id'] === event.intent_index) {
  //       data['text_entities'] = event.text_entities;
  //     }
  //   });
  //   this.updateIntentsJSON(this.intentsJSON.slice(0));
  // }

  // saveStoryJSON(event: { story_index: number, intents_responses: [{}] }) {
  //   this.storiesJSON.map(function(data) {
  //     if (data['story_id'] === event.story_index) {
  //       data['intents_responses'] = event.intents_responses;
  //     }
  //   });
  //   this.updateStoriesJSON(this.storiesJSON.slice(0));
  // }

  // saveResponseJSON(event: { response_index: number, text_entities: [] }) {
  //   this.responsesJSON.map(function(data) {
  //     if (data['response_id'] === event.response_index) {
  //       data['text_entities'] = event.text_entities;
  //     }
  //   });
  //   this.updateResponsesJSON(this.responsesJSON.slice(0));
  // }

  // saveIntentEntityValue(event: { intent_text_index: number, intent_entities: {} }) {
  //   this.currentIntent.text_entities[event.intent_text_index]['entities'].push(event.intent_entities);
  // }

  // openPropertyPanelComponent(propertyPanelComponent: string) {
  //   this.propertyPanel = propertyPanelComponent;
  // }
}
