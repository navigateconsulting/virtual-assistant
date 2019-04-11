import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedDataService } from '../common/services/shared-data.service';
import { constant } from '../../environments/constants';
import { FileElement } from '../file-explorer/model/element';
import { Observable } from 'rxjs';
import { FileService } from '../common/services/file.service';

@Component({
  selector: 'app-manage-domains',
  templateUrl: './manage-domains.component.html',
  styleUrls: ['./manage-domains.component.scss']
})
export class ManageDomainsComponent implements OnInit {

  public fileElements: Observable<FileElement[]>;

  constructor(private sharedService: SharedDataService,
              public fileService: FileService) { }

  currentRoot: FileElement;
  currentPath: string;
  currentPathID: string;
  canNavigateUp = false;
  showAddFolderFile = true;
  all_json_data: any;
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
  propertyPanel: string;
  rootFoldersArray: Array<string> = ['Intents', 'Stories', 'Responses'];

  ngOnInit() {
    this.intentsJSON = sessionStorage.getItem('intents_json');
    if (this.intentsJSON !== null && this.intentsJSON !== '') {
      this.intentsJSON = this.convertToArrayOfObject(this.intentsJSON.split('*'));
      sessionStorage.setItem('intent_id', this.intentsJSON[this.intentsJSON.length - 1].intent_id);
    } else {
      this.intentsJSON = new Array<object>();
      sessionStorage.setItem('intent_id', '0');
    }
    this.storiesJSON = sessionStorage.getItem('stories_json');
    if (this.storiesJSON !== null && this.storiesJSON !== '') {
      this.storiesJSON = this.convertToArrayOfObject(this.storiesJSON.split('*'));
      sessionStorage.setItem('story_id', this.storiesJSON[this.storiesJSON.length - 1].story_id);
    } else {
      this.storiesJSON = new Array<object>();
      sessionStorage.setItem('story_id', '0');
    }
    this.responsesJSON = sessionStorage.getItem('responses_json');
    if (this.responsesJSON !== null && this.responsesJSON !== '') {
      this.responsesJSON = this.convertToArrayOfObject(this.responsesJSON.split('*'));
      sessionStorage.setItem('response_id', this.responsesJSON[this.responsesJSON.length - 1].response_id);
    } else {
      this.responsesJSON = new Array<object>();
      sessionStorage.setItem('response_id', '0');
    }
    this.all_json_data = sessionStorage.getItem('domains_json');
    if (this.all_json_data !== null) {
      const intents_string_arr = this.all_json_data.split('*');
      this.all_json_data = this.convertToArrayOfObject(intents_string_arr);
      sessionStorage.setItem('domain_id', this.all_json_data[this.all_json_data.length - 1].domain_id);
      this.loadStoriesJSON(this.all_json_data);
    } else {
      this.all_json_data = new Array<object>();
      sessionStorage.setItem('domain_id', '0');
    }
    // tslint:disable-next-line:quotemark
    this.currentPath = "<a href='javascript:;' class='root'> Home </a>" + ' / ';
    this.propertyPanel = 'entities';
  }

  addFolder(folder: { name: string }) {
    this.domain_id = +sessionStorage.getItem('domain_id');
    // tslint:disable-next-line:max-line-length
    const new_folder = this.fileService.add({ domain_id: this.domain_id + 1, name: folder.name, isFolder: true, parent: this.currentRoot ? this.currentRoot.id : 'root', type: 'domain' });
    // tslint:disable-next-line:max-line-length
    this.all_json_data.push({domain_id: this.domain_id + 1, domain_name: new_folder.name, domain: {Intents: [{}], Stories: [{}], Responses: [{}]}});
    this.fileService.add({ name: 'Intents', isFolder: true, parent: new_folder.id, type: 'intents' });
    this.fileService.add({ name: 'Stories', isFolder: true, parent: new_folder.id, type: 'stories' });
    this.fileService.add({ name: 'Responses', isFolder: true, parent: new_folder.id, type: 'responses' });
    this.updateFileElementQuery();
    this.updateDomainsJSON(this.all_json_data.slice(0));
  }

  addFile(file: { name: string }) {
    this.domain_id = +sessionStorage.getItem('domain_id');
    if (this.currentRoot.type === 'intents') {
      this.intent_id = +sessionStorage.getItem('intent_id');
      // tslint:disable-next-line:max-line-length
      this.fileService.add({ intent_id: this.intent_id + 1, name: file.name, isFolder: false, parent: this.currentRoot ? this.currentRoot.id : 'root', type: 'intent' });
      this.intentsJSON.push({domain_id: this.domain_id, intent_id: this.intent_id + 1, intent: file.name, text_entities: []});
    } else if (this.currentRoot.type === 'stories') {
      this.story_id = +sessionStorage.getItem('story_id');
      // tslint:disable-next-line:max-line-length
      this.fileService.add({ story_id: this.story_id + 1, name: file.name, isFolder: false, parent: this.currentRoot ? this.currentRoot.id : 'root', type: 'story' });
      this.storiesJSON.push({domain_id: this.domain_id, story_id: this.story_id + 1, story: file.name, intents_responses: []});
    } else if (this.currentRoot.type === 'responses') {
      this.response_id = +sessionStorage.getItem('response_id');
      // tslint:disable-next-line:max-line-length
      this.fileService.add({ response_id: this.response_id + 1, name: file.name, isFolder: false, parent: this.currentRoot ? this.currentRoot.id : 'root', type: 'response' });
      this.responsesJSON.push({domain_id: this.domain_id, response_id: this.response_id + 1, response: file.name, text_entities: []});
    }
    this.updateFileElementQuery();
    this.updateIntentsJSON(this.intentsJSON.slice(0));
    this.updateStoriesJSON(this.storiesJSON.slice(0));
    this.updateResponsesJSON(this.responsesJSON.slice(0));
  }

  removeElement(element: FileElement) {
    const previous_name_file = this.fileService.get(element.id);
    this.all_json_data = this.all_json_data.filter(function( obj ) {
      return obj['domain_name'] !== previous_name_file.name;
    });
    this.fileService.delete(element.id);
    this.updateFileElementQuery();
    this.updateDomainsJSON(this.all_json_data.slice(0));
  }

  navigateToFolder(element: FileElement) {
    let isFile = false;
    if (element.parent === 'root') {
      this.showAddFolderFile = false;
      sessionStorage.setItem('domain_id', '' + element.domain_id);
    } else if (this.rootFoldersArray.includes(element.name)) {
      this.showAddFolderFile = true;
    } else {
      this.showAddFolderFile = false;
      this.showIntentORStoryORResponse(element);
      isFile = true;
    }
    this.currentRoot = element;
    this.currentPath = this.pushToPath(this.currentPath, element.name, element.id, isFile);
    this.canNavigateUp = true;
    this.updateFileElementQuery();
  }

  navigateUp(path_class: string) {
    if (path_class !== 'breadcrumb_path') {
      if (path_class === 'root') {
        this.currentRoot = null;
        this.canNavigateUp = false;
        this.showAddFolderFile = true;
      } else {
        this.currentRoot = this.fileService.get(path_class);
        if (this.currentRoot.parent === 'root') {
          this.showAddFolderFile = false;
        } else {
          this.showAddFolderFile = true;
        }
      }
      this.openIntentORStoryORResponseFile = '';
      this.updateFileElementQuery();
      this.currentPath = this.popFromPath(this.currentPath, path_class);
    }
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.update(event.element.id, { parent: event.moveTo.id });
    this.updateFileElementQuery();
  }

  renameElement(element: FileElement) {
    const previous_name_file = this.fileService.get(element.id);
    this.all_json_data.find(function(data) {
      if (data['domain_name'] === previous_name_file.name) {
        data['domain_name'] = element.name;
        return true;
      }
    });
    this.fileService.update(element.id, { name: element.name });
    this.updateFileElementQuery();
    this.updateDomainsJSON(this.all_json_data.slice(0));
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  pushToPath(path: string, folderName: string, elementId: string, isFile: boolean) {
    let p = path ? path : '';
    if (isFile) {
      // tslint:disable-next-line:quotemark
      p += folderName;
    } else {
      // tslint:disable-next-line:quotemark
      p += "<a href='javascript:;' class='" + elementId + "'>" + `${folderName}` + "</a>" + ' / ';
    }
    return p;
  }

  popFromPath(path: string, path_class: string) {
    let index = 0;
    let p = path ? path : '';
    const split = p.split(' / ');
    for (let i = 0; i < split.length; i++) {
      if (split[i].includes(path_class)) {
        index = i;
      }
    }
    split.splice(index + 1);
    p = split.join(' / ') + ' / ';
    return p;
  }

  loadStoriesJSON(all_json_data: any) {
    const json_data = all_json_data;
    this.fileElements = new Observable<FileElement[]>();
    for (let i = 0; i < json_data.length; i++) {
      const domain_folder = this.fileService.add({ name: json_data[i]['domain_name'], isFolder: true, parent: 'root', type: 'domain' });
      const domain_data = json_data[i]['domain'];
      // tslint:disable-next-line:forin
      for (const key in domain_data) {
        const intents_stories_utter_key = key;
        if (intents_stories_utter_key === 'Intents') {
          // tslint:disable-next-line:max-line-length
          const intents_folder = this.fileService.add({ name: intents_stories_utter_key, isFolder: true, parent: domain_folder.id, type: 'intents' });
          const intents_data = this.intentsJSON;
          if (intents_data.length > 0) {
            for (let l = 0; l < intents_data.length; l++) {
              // tslint:disable-next-line:max-line-length
              this.fileService.add({ intent_id: intents_data[l].intent_id, name: intents_data[l].intent, isFolder: false, parent: intents_folder.id, type: 'intents' });
            }
          }
        }
        if (intents_stories_utter_key === 'Stories') {
          // tslint:disable-next-line:max-line-length
          const stories_folder = this.fileService.add({ name: intents_stories_utter_key, isFolder: true, parent: domain_folder.id, type: 'stories' });
          const stories_data = this.storiesJSON;
          if (stories_data.length > 0) {
            for (let l = 0; l < stories_data.length; l++) {
              // tslint:disable-next-line:max-line-length
              this.fileService.add({ story_id: stories_data[l].story_id, name: stories_data[l].story, isFolder: false, parent: stories_folder.id, type: 'stories' });
            }
          }
        }
        if (intents_stories_utter_key === 'Responses') {
          // tslint:disable-next-line:max-line-length
          const responses_folder = this.fileService.add({ name: intents_stories_utter_key, isFolder: true, parent: domain_folder.id, type: 'responses' });
          const responses_data = this.responsesJSON;
          if (responses_data !== undefined) {
            if (responses_data.length > 0) {
              for (let l = 0; l < responses_data.length; l++) {
                // tslint:disable-next-line:max-line-length
                this.fileService.add({ response_id: responses_data[l].response_id, name: responses_data[l].response, isFolder: false, parent: responses_folder.id, type: 'responses' });
              }
            }
          }
        }
      }
    }
    this.updateFileElementQuery();
  }

  updateDomainsJSON(domains_string_arr: any) {
    domains_string_arr = this.convertToArrayOfString(domains_string_arr);
    sessionStorage.setItem('domains_json', domains_string_arr.join('*'));
    sessionStorage.setItem('domain_id', '' + (this.domain_id + 1));
  }

  updateIntentsJSON(intents_string_arr: any) {
    intents_string_arr = this.convertToArrayOfString(intents_string_arr);
    sessionStorage.setItem('intents_json', intents_string_arr.join('*'));
    sessionStorage.setItem('intent_id', '' + (this.intent_id + 1));
  }

  updateStoriesJSON(stories_string_arr: any) {
    stories_string_arr = this.convertToArrayOfString(stories_string_arr);
    sessionStorage.setItem('stories_json', stories_string_arr.join('*'));
    sessionStorage.setItem('story_id', '' + (this.story_id + 1));
  }

  updateResponsesJSON(responses_string_arr: any) {
    responses_string_arr = this.convertToArrayOfString(responses_string_arr);
    sessionStorage.setItem('responses_json', responses_string_arr.join('*'));
    sessionStorage.setItem('response_id', '' + (this.response_id + 1));
  }

  showIntentORStoryORResponse(element: FileElement) {
    let currentIntent: any;
    let currentStory: any;
    let currentResponse: any;
    if (element.type === 'intents') {
      this.intentsJSON.map(function(data: any) {
        if (data['intent_id'] === element.intent_id) {
          currentIntent = data;
        }
      });
      this.currentIntent = currentIntent;
    } else if (element.type === 'stories') {
      this.storiesJSON.map(function(data: any) {
        if (data['story_id'] === element.story_id) {
          currentStory = data;
        }
      });
      this.currentStory = currentStory;
    } else if (element.type === 'responses') {
      this.responsesJSON.map(function(data: any) {
        if (data['response_id'] === element.response_id) {
          currentResponse = data;
        }
      });
      this.currentResponse = currentResponse;
    }
    this.openIntentORStoryORResponseFile = element.type;
  }

  saveIntentJSON(event: { intent_index: number, text_entities: [{}] }) {
    this.intentsJSON.map(function(data) {
      if (data['intent_id'] === event.intent_index) {
        data['text_entities'] = event.text_entities;
      }
    });
    this.updateIntentsJSON(this.intentsJSON.slice(0));
  }

  saveStoryJSON(event: { story_index: number, intents_responses: [{}] }) {
    this.storiesJSON.map(function(data) {
      if (data['story_id'] === event.story_index) {
        data['intents_responses'] = event.intents_responses;
      }
    });
    this.updateStoriesJSON(this.storiesJSON.slice(0));
  }

  saveResponseJSON(event: { response_index: number, text_entities: [] }) {
    this.responsesJSON.map(function(data) {
      if (data['response_id'] === event.response_index) {
        data['text_entities'] = event.text_entities;
      }
    });
    this.updateResponsesJSON(this.responsesJSON.slice(0));
  }

  saveIntentEntityValue(event: { intent_text_index: number, intent_entities: {} }) {
    this.currentIntent.text_entities[event.intent_text_index]['entities'].push(event.intent_entities);
  }

  openPropertyPanelComponent(propertyPanelComponent: string) {
    this.propertyPanel = propertyPanelComponent;
  }

  convertToArrayOfString(entities: any) {
    entities.forEach(function (value: any, index: number) {
      entities[index] = JSON.stringify(value);
    });
    return entities;
  }

  convertToArrayOfObject(entities: any) {
    entities.forEach(function (value: any, index: number) {
      entities[index] = JSON.parse(value);
    });
    return entities;
  }

}
